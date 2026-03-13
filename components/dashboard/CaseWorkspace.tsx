'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, FileText, Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import { formatDateTime } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';

interface CaseNote {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface CaseWorkspaceProps {
  appointmentId: string;
  citizenName: string;
}

const COPY = {
  loadError: 'Failed to load notes',
  saveError: 'Failed to save note',
  saveSuccess: 'Case note added securely.',
  titlePrefix: 'Private Case File:',
  confidentialityLabel: 'Confidential',
  emptyState: 'No private notes have been added to this consultation yet.',
  encryptedMemo: 'Encrypted Memo',
  inputPlaceholder: 'Document legal strategies, case references, or internal memos here...',
  saveAction: 'Save Note to Case File',
} as const;

export default function CaseWorkspace({ appointmentId, citizenName }: CaseWorkspaceProps) {
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(COPY, lang);
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/notes`, {
        headers: {
          [REQUEST_LOCALE_HEADER]: lang,
        },
      });
      if (!response.ok) throw new Error(copy.loadError);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (caughtError: any) {
      setError(caughtError.message);
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId, copy.loadError, lang]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({ text: newNote }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || copy.saveError);
      }

      setNewNote('');
      toast.success(copy.saveSuccess);
      await fetchNotes();
    } catch (caughtError: any) {
      toast.error(caughtError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center rounded-xl border border-border bg-muted/50 p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface shadow-inner">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-muted-foreground" />
          {copy.titlePrefix} <span className="text-primary">{citizenName}</span>
        </h4>
        <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {copy.confidentialityLabel}
        </span>
      </div>

      <div className="space-y-4 p-4">
        {notes.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">{copy.emptyState}</div>
        ) : (
          <div className="custom-scrollbar max-h-60 space-y-3 overflow-y-auto pr-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative rounded-lg border border-border bg-background p-3 text-sm text-foreground shadow-sm"
              >
                <p className="whitespace-pre-wrap leading-relaxed">{note.text}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(note.createdAt, lang, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">
                    {copy.encryptedMemo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <textarea
            value={newNote}
            onChange={(event) => setNewNote(event.target.value)}
            placeholder={copy.inputPlaceholder}
            className="min-h-[100px] w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || !newNote.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {copy.saveAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
