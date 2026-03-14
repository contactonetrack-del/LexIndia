'use client';

import { useEffect, useState } from 'react';

type AdminQueueSummary = {
  verificationPendingCount: number;
  templateReviewCount: number;
  faqReviewCount: number;
  guideReviewCount: number;
  rightsReviewCount: number;
  lawReviewCount: number;
  lawSectionReviewCount: number;
  pendingTotal: number;
};

const EMPTY_SUMMARY: AdminQueueSummary = {
  verificationPendingCount: 0,
  templateReviewCount: 0,
  faqReviewCount: 0,
  guideReviewCount: 0,
  rightsReviewCount: 0,
  lawReviewCount: 0,
  lawSectionReviewCount: 0,
  pendingTotal: 0,
};

export function useAdminQueueSummary(enabled: boolean) {
  const [summary, setSummary] = useState<AdminQueueSummary>(EMPTY_SUMMARY);

  useEffect(() => {
    if (!enabled) {
      setSummary(EMPTY_SUMMARY);
      return;
    }

    let cancelled = false;

    const loadSummary = async () => {
      try {
        const response = await fetch('/api/admin/queue-summary', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('queue_summary_unavailable');
        }

        const data = await response.json();
        if (!cancelled) {
          setSummary({
            verificationPendingCount: data.verificationPendingCount ?? 0,
            templateReviewCount: data.templateReviewCount ?? 0,
            faqReviewCount: data.faqReviewCount ?? 0,
            guideReviewCount: data.guideReviewCount ?? 0,
            rightsReviewCount: data.rightsReviewCount ?? 0,
            lawReviewCount: data.lawReviewCount ?? 0,
            lawSectionReviewCount: data.lawSectionReviewCount ?? 0,
            pendingTotal: data.pendingTotal ?? 0,
          });
        }
      } catch {
        if (!cancelled) {
          setSummary(EMPTY_SUMMARY);
        }
      }
    };

    loadSummary();
    const interval = window.setInterval(loadSummary, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [enabled]);

  return summary;
}
