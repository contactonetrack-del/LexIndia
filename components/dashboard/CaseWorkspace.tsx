'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Save, FileText, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

export default function CaseWorkspace({ appointmentId, citizenName }: CaseWorkspaceProps) {
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/notes`);
      if (!res.ok) throw new Error('Failed to load notes');
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNote }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save note');
      }

      setNewNote('');
      toast.success('Case note added securely.');
      await fetchNotes();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center bg-gray-50/50 rounded-xl border border-gray-100 mt-4">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
     return (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm flex items-center gap-2 mt-4">
           <AlertCircle className="w-4 h-4" /> {error}
        </div>
     );
  }

  return (
    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner">
      <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
         <h4 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-slate-500" /> 
            Private Case File: <span className="text-[#1E3A8A]">{citizenName}</span>
         </h4>
         <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full border border-slate-300">
             Confidential
         </span>
      </div>

      <div className="p-4 space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">
            No private notes have been added to this consultation yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {notes.map((note) => (
              <div key={note.id} className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm relative group">
                <p className="whitespace-pre-wrap leading-relaxed">{note.text}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Encrypted Memo
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Document legal strategies, case references, or internal memos here..."
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] min-h-[100px] resize-y bg-white text-slate-800"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || !newNote.trim()}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Note to Case File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
