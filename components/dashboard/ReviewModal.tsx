'use client';

import React, { useState } from 'react';
import { Loader2, Star, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import { useLanguage } from '@/lib/LanguageContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  lawyerName: string;
  onSuccess: () => void;
}

const COPY = {
  ratingRequired: 'Please select a rating',
  submitError: 'Failed to submit review',
  submitSuccess: 'Review submitted successfully!',
  title: 'Rate Your Consultation',
  promptPrefix: 'How was your experience with',
  promptSuffix: '?',
  commentsLabel: 'Additional Comments (Optional)',
  commentsPlaceholder: 'Share details of your experience to help others...',
  submitting: 'Submitting...',
  submit: 'Submit Review',
} as const;

export default function ReviewModal({
  isOpen,
  onClose,
  appointmentId,
  lawyerName,
  onSuccess,
}: ReviewModalProps) {
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(COPY, lang);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (rating === 0) {
      toast.error(copy.ratingRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({ appointmentId, rating, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || copy.submitError);
      }

      toast.success(copy.submitSuccess);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-in overflow-hidden rounded-2xl border border-border bg-background shadow-xl fade-in zoom-in duration-200">
        <div className="relative flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="flex-1 text-center text-lg font-bold text-foreground">{copy.title}</h3>
          <button
            onClick={onClose}
            className="absolute right-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {copy.promptPrefix} <span className="font-semibold text-foreground">{lawyerName}</span>
            {copy.promptSuffix}
          </p>

          <div className="mb-8 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`p-2 transition-all ${
                  (hoverRating || rating) >= star
                    ? 'scale-110 text-warning'
                    : 'scale-100 text-muted-foreground/40 hover:text-warning/60'
                }`}
              >
                <Star className="h-10 w-10 fill-current" />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">{copy.commentsLabel}</label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={copy.commentsPlaceholder}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? copy.submitting : copy.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
