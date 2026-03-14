'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle, FileQuestion, FileText, Loader2, RefreshCw, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { EDITORIAL_STATUSES, type EditorialStatus } from '@/lib/editorial-review';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import { formatDateTime } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';

type VerificationCase = {
  id: string;
  status: 'UNDER_REVIEW' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
  submittedBarCouncilId?: string | null;
  identityDocumentUrl?: string | null;
  enrollmentCertificateUrl?: string | null;
  practiceCertificateUrl?: string | null;
  lawyerNotes?: string | null;
  adminNotes?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  lawyerProfile: {
    id: string;
    city: string;
    state?: string | null;
    barCouncilID?: string | null;
    isVerified: boolean;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  };
};

type TemplateRecord = {
  id: string;
  title: string;
  category: string;
  downloads: number;
  editorialStatus: EditorialStatus;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
};

type FAQRecord = {
  id: string;
  question: string;
  editorialStatus: EditorialStatus;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
  category: {
    id: string;
    name: string;
  };
};

type GuideRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime?: number | null;
  hasPublishedContent: boolean;
  editorialStatus: EditorialStatus;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
};

type RightRecord = {
  id: string;
  slug: string;
  title: string;
  editorialStatus: EditorialStatus;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
};

type LawRecord = {
  id: string;
  slug: string;
  shortCode: string;
  title: string;
  description: string;
  editorialStatus: EditorialStatus;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
  sections: Array<{ id: string; editorialStatus: EditorialStatus }>;
};

type LawSectionRecord = {
  id: string;
  sectionKey: string;
  title: string;
  plainEnglish: string;
  editorialStatus: EditorialStatus;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
  act: {
    id: string;
    slug: string;
    shortCode: string;
    title: string;
  };
};

const VERIFICATION_STATUSES: VerificationCase['status'][] = [
  'UNDER_REVIEW',
  'APPROVED',
  'CHANGES_REQUESTED',
  'REJECTED',
];

export default function AdminDashboardClient({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) {
  const { lang, fontClass } = useLanguage();
	  const copy = localizeTreeFromMemory(
	    {
	      badgeLine: 'LexIndia Admin',
	      title: 'Trust and editorial review',
	      subtitle:
	        'Review lawyer verification submissions plus templates, FAQs, guides, rights pages, and law knowledge status from one dashboard.',
	      refresh: 'Refresh queue',
      verificationQueue: 'Lawyer verification queue',
      templateQueue: 'Template editorial queue',
      faqQueue: 'FAQ editorial queue',
      guideQueue: 'Guide editorial queue',
      rightsQueue: 'Rights editorial queue',
      lawsQueue: 'Law acts review queue',
      lawSectionsQueue: 'Law sections review queue',
      noCases: 'No verification cases found.',
      noTemplates: 'No templates found.',
      noFaqs: 'No FAQs found.',
      noGuides: 'No guides found.',
      noRights: 'No rights pages found.',
      noLaws: 'No laws found.',
      noLawSections: 'No law sections found.',
      save: 'Save review',
      status: 'Status',
      notes: 'Notes',
      submitted: 'Submitted',
      reviewed: 'Reviewed',
      city: 'City',
      category: 'Category',
      readTime: 'Read time',
      question: 'Question',
      slug: 'Slug',
      act: 'Act',
      actCode: 'Act code',
      sectionKey: 'Section',
      liveContent: 'Live content',
      topicOnly: 'Topic only',
	      openDocument: 'Open document',
	      certificate: 'Certificate',
	      identity: 'Identity',
	      practice: 'Practice',
	      viewPublicProfile: 'View public profile',
	      viewGuide: 'View guide',
	      viewRightsPage: 'View rights page',
	      saved: 'Review saved.',
	      loadFailed: 'Failed to load review queue.',
	      updateFailed: 'Failed to update review.',
	    } as const,
	    lang
	  );

  const [cases, setCases] = useState<VerificationCase[]>([]);
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [faqs, setFaqs] = useState<FAQRecord[]>([]);
  const [guides, setGuides] = useState<GuideRecord[]>([]);
  const [rights, setRights] = useState<RightRecord[]>([]);
  const [laws, setLaws] = useState<LawRecord[]>([]);
  const [lawSections, setLawSections] = useState<LawSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCaseId, setSavingCaseId] = useState<string | null>(null);
  const [savingTemplateId, setSavingTemplateId] = useState<string | null>(null);
  const [savingFaqId, setSavingFaqId] = useState<string | null>(null);
  const [savingGuideId, setSavingGuideId] = useState<string | null>(null);
  const [savingRightId, setSavingRightId] = useState<string | null>(null);
  const [savingLawId, setSavingLawId] = useState<string | null>(null);
  const [savingLawSectionId, setSavingLawSectionId] = useState<string | null>(null);
  const [caseDrafts, setCaseDrafts] = useState<Record<string, { status: VerificationCase['status']; adminNotes: string }>>({});
  const [templateDrafts, setTemplateDrafts] = useState<Record<string, { editorialStatus: EditorialStatus; reviewerNotes: string }>>({});
  const [faqDrafts, setFaqDrafts] = useState<Record<string, { editorialStatus: EditorialStatus; reviewerNotes: string }>>({});
  const [guideDrafts, setGuideDrafts] = useState<Record<string, { editorialStatus: EditorialStatus; reviewerNotes: string }>>({});
  const [rightDrafts, setRightDrafts] = useState<Record<string, { editorialStatus: EditorialStatus; reviewerNotes: string }>>({});
  const [lawDrafts, setLawDrafts] = useState<Record<string, { editorialStatus: EditorialStatus; reviewerNotes: string }>>({});
  const [lawSectionDrafts, setLawSectionDrafts] = useState<Record<string, { editorialStatus: EditorialStatus; reviewerNotes: string }>>({});

  const loadQueues = useCallback(async () => {
    setLoading(true);
    try {
      const [caseResponse, templateResponse, faqResponse, guideResponse, rightResponse, lawResponse, lawSectionResponse] = await Promise.all([
        fetch('/api/admin/verification-cases'),
        fetch('/api/admin/templates'),
        fetch('/api/admin/faqs'),
        fetch('/api/admin/guides'),
        fetch('/api/admin/rights'),
        fetch('/api/admin/laws'),
        fetch('/api/admin/law-sections'),
      ]);
      const [caseData, templateData, faqData, guideData, rightData, lawData, lawSectionData] = await Promise.all([
        caseResponse.json(),
        templateResponse.json(),
        faqResponse.json(),
        guideResponse.json(),
        rightResponse.json(),
        lawResponse.json(),
        lawSectionResponse.json(),
      ]);

      if (!caseResponse.ok || !templateResponse.ok || !faqResponse.ok || !guideResponse.ok || !rightResponse.ok || !lawResponse.ok || !lawSectionResponse.ok) {
        throw new Error(
          caseData.error ??
            templateData.error ??
            faqData.error ??
            guideData.error ??
            rightData.error ??
            lawData.error ??
            lawSectionData.error ??
            copy.loadFailed
        );
      }

      setCases(caseData.cases ?? []);
      setTemplates(templateData.templates ?? []);
      setFaqs(faqData.faqs ?? []);
      setGuides(guideData.guides ?? []);
      setRights(rightData.rights ?? []);
      setLaws(lawData.laws ?? []);
      setLawSections(lawSectionData.lawSections ?? []);
      setCaseDrafts(
        Object.fromEntries(
          (caseData.cases ?? []).map((entry: VerificationCase) => [
            entry.id,
            {
              status: entry.status,
              adminNotes: entry.adminNotes ?? '',
            },
          ])
        )
      );
      setTemplateDrafts(
        Object.fromEntries(
          (templateData.templates ?? []).map((entry: TemplateRecord) => [
            entry.id,
            {
              editorialStatus: entry.editorialStatus,
              reviewerNotes: entry.reviewerNotes ?? '',
            },
          ])
        )
      );
      setFaqDrafts(
        Object.fromEntries(
          (faqData.faqs ?? []).map((entry: FAQRecord) => [
            entry.id,
            {
              editorialStatus: entry.editorialStatus,
              reviewerNotes: entry.reviewerNotes ?? '',
            },
          ])
        )
      );
      setGuideDrafts(
        Object.fromEntries(
          (guideData.guides ?? []).map((entry: GuideRecord) => [
            entry.id,
            {
              editorialStatus: entry.editorialStatus,
              reviewerNotes: entry.reviewerNotes ?? '',
            },
          ])
        )
      );
      setRightDrafts(
        Object.fromEntries(
          (rightData.rights ?? []).map((entry: RightRecord) => [
            entry.id,
            {
              editorialStatus: entry.editorialStatus,
              reviewerNotes: entry.reviewerNotes ?? '',
            },
          ])
        )
      );
      setLawDrafts(
        Object.fromEntries(
          (lawData.laws ?? []).map((entry: LawRecord) => [
            entry.id,
            {
              editorialStatus: entry.editorialStatus,
              reviewerNotes: entry.reviewerNotes ?? '',
            },
          ])
        )
      );
      setLawSectionDrafts(
        Object.fromEntries(
          (lawSectionData.lawSections ?? []).map((entry: LawSectionRecord) => [
            entry.id,
            {
              editorialStatus: entry.editorialStatus,
              reviewerNotes: entry.reviewerNotes ?? '',
            },
          ])
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [copy.loadFailed]);

  useEffect(() => {
    void loadQueues();
  }, [loadQueues]);

  const pendingVerificationCount = useMemo(
    () => cases.filter((entry) => entry.status === 'UNDER_REVIEW').length,
    [cases]
  );
  const pendingTemplateCount = useMemo(
    () => templates.filter((entry) => entry.editorialStatus === 'REVIEW').length,
    [templates]
  );
  const pendingFaqCount = useMemo(
    () => faqs.filter((entry) => entry.editorialStatus === 'REVIEW').length,
    [faqs]
  );
  const pendingGuideCount = useMemo(
    () => guides.filter((entry) => entry.editorialStatus === 'REVIEW').length,
    [guides]
  );
  const pendingRightCount = useMemo(
    () => rights.filter((entry) => entry.editorialStatus === 'REVIEW').length,
    [rights]
  );
  const pendingLawCount = useMemo(
    () => laws.filter((entry) => entry.editorialStatus === 'REVIEW').length,
    [laws]
  );
  const pendingLawSectionCount = useMemo(
    () => lawSections.filter((entry) => entry.editorialStatus === 'REVIEW').length,
    [lawSections]
  );

  const saveCaseReview = async (entry: VerificationCase) => {
    const draft = caseDrafts[entry.id];
    if (!draft) {
      return;
    }

    setSavingCaseId(entry.id);
    try {
      const response = await fetch(`/api/admin/verification-cases/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.updateFailed);
      }
      setCases((prev) => prev.map((item) => (item.id === entry.id ? data.case : item)));
      toast.success(copy.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateFailed);
    } finally {
      setSavingCaseId(null);
    }
  };

  const saveTemplateReview = async (entry: TemplateRecord) => {
    const draft = templateDrafts[entry.id];
    if (!draft) {
      return;
    }

    setSavingTemplateId(entry.id);
    try {
      const response = await fetch(`/api/admin/templates/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.updateFailed);
      }
      setTemplates((prev) =>
        prev.map((item) =>
          item.id === entry.id
            ? {
                ...item,
                editorialStatus: data.template.editorialStatus,
                reviewerNotes: data.template.reviewerNotes,
                reviewedAt: data.template.reviewedAt,
              }
            : item
        )
      );
      toast.success(copy.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateFailed);
    } finally {
      setSavingTemplateId(null);
    }
  };

  const saveFaqReview = async (entry: FAQRecord) => {
    const draft = faqDrafts[entry.id];
    if (!draft) {
      return;
    }

    setSavingFaqId(entry.id);
    try {
      const response = await fetch(`/api/admin/faqs/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.updateFailed);
      }
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === entry.id
            ? {
                ...item,
                editorialStatus: data.faq.editorialStatus,
                reviewerNotes: data.faq.reviewerNotes,
                reviewedAt: data.faq.reviewedAt,
              }
            : item
        )
      );
      toast.success(copy.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateFailed);
    } finally {
      setSavingFaqId(null);
    }
  };

  const saveGuideReview = async (entry: GuideRecord) => {
    const draft = guideDrafts[entry.id];
    if (!draft) {
      return;
    }

    setSavingGuideId(entry.id);
    try {
      const response = await fetch(`/api/admin/guides/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.updateFailed);
      }
      setGuides((prev) =>
        prev.map((item) =>
          item.id === entry.id
            ? {
                ...item,
                editorialStatus: data.guide.editorialStatus,
                reviewerNotes: data.guide.reviewerNotes,
                reviewedAt: data.guide.reviewedAt,
              }
            : item
        )
      );
      toast.success(copy.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateFailed);
    } finally {
      setSavingGuideId(null);
    }
  };

  const saveRightReview = async (entry: RightRecord) => {
    const draft = rightDrafts[entry.id];
    if (!draft) {
      return;
    }

    setSavingRightId(entry.id);
    try {
      const response = await fetch(`/api/admin/rights/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.updateFailed);
      }
      setRights((prev) =>
        prev.map((item) =>
          item.id === entry.id
            ? {
                ...item,
                editorialStatus: data.right.editorialStatus,
                reviewerNotes: data.right.reviewerNotes,
                reviewedAt: data.right.reviewedAt,
              }
            : item
        )
      );
      toast.success(copy.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateFailed);
    } finally {
      setSavingRightId(null);
    }
  };

  const saveLawReview = async (entry: LawRecord) => {
    const draft = lawDrafts[entry.id];
    if (!draft) {
      return;
    }

    setSavingLawId(entry.id);
    try {
      const response = await fetch(`/api/admin/laws/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.updateFailed);
      }
      setLaws((prev) =>
        prev.map((item) =>
          item.id === entry.id
            ? {
                ...item,
                editorialStatus: data.law.editorialStatus,
                reviewerNotes: data.law.reviewerNotes,
                reviewedAt: data.law.reviewedAt,
                sections: data.law.sections,
              }
            : item
        )
      );
      toast.success(copy.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateFailed);
    } finally {
      setSavingLawId(null);
    }
  };

  const saveLawSectionReview = async (entry: LawSectionRecord) => {
    const draft = lawSectionDrafts[entry.id];
    if (!draft) {
      return;
    }

    setSavingLawSectionId(entry.id);
    try {
      const response = await fetch(`/api/admin/law-sections/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.updateFailed);
      }
      setLawSections((prev) =>
        prev.map((item) =>
          item.id === entry.id
            ? {
                ...item,
                editorialStatus: data.lawSection.editorialStatus,
                reviewerNotes: data.lawSection.reviewerNotes,
                reviewedAt: data.lawSection.reviewedAt,
                act: data.lawSection.act,
              }
            : item
        )
      );
      toast.success(copy.saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateFailed);
    } finally {
      setSavingLawSectionId(null);
    }
  };

  return (
	    <div className="min-h-screen bg-muted">
	      <div className="bg-gradient-to-r from-primary to-accent/80 text-primary-foreground">
	        <div className="mx-auto max-w-6xl px-4 py-8">
	          <p className="text-sm text-primary-foreground/85">{copy.badgeLine}</p>
	          <h1 className={`text-3xl font-bold ${fontClass}`}>{copy.title}</h1>
	          <p className="mt-2 max-w-3xl text-sm text-primary-foreground/85">{copy.subtitle}</p>
	          <p className="mt-1 text-xs text-primary-foreground/75">
            {user.name} {user.email ? `• ${user.email}` : ''}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          <div className="rounded-2xl border border-warning/30 bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.verificationQueue}
            </p>
            <p data-testid="admin-verification-pending-count" className="mt-2 text-3xl font-bold text-warning">{pendingVerificationCount}</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.templateQueue}
            </p>
            <p data-testid="admin-template-pending-count" className="mt-2 text-3xl font-bold text-primary">{pendingTemplateCount}</p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.faqQueue}
            </p>
            <p data-testid="admin-faq-pending-count" className="mt-2 text-3xl font-bold text-accent">{pendingFaqCount}</p>
          </div>
          <div className="rounded-2xl border border-success/30 bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.guideQueue}
            </p>
            <p data-testid="admin-guide-pending-count" className="mt-2 text-3xl font-bold text-success">{pendingGuideCount}</p>
          </div>
          <div className="rounded-2xl border border-secondary/30 bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.rightsQueue}
            </p>
            <p data-testid="admin-rights-pending-count" className="mt-2 text-3xl font-bold text-secondary">{pendingRightCount}</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.lawsQueue}
            </p>
            <p data-testid="admin-laws-pending-count" className="mt-2 text-3xl font-bold text-primary">{pendingLawCount}</p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {copy.lawSectionsQueue}
            </p>
            <p data-testid="admin-law-sections-pending-count" className="mt-2 text-3xl font-bold text-accent">{pendingLawSectionCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <button
              onClick={() => void loadQueues()}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              {copy.refresh}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{copy.verificationQueue}</h2>
              </div>
              {cases.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noCases}</p>
              ) : (
                <div className="space-y-5">
                  {cases.map((entry) => {
                    const draft = caseDrafts[entry.id];
                    return (
                      <div key={entry.id} data-testid={`verification-case-${entry.id}`} className="rounded-2xl border border-border bg-surface/60 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {entry.lawyerProfile.user.name ?? 'Lawyer'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {entry.lawyerProfile.user.email} • {copy.city}: {entry.lawyerProfile.city}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {copy.submitted}: {formatDateTime(entry.submittedAt, lang)}
                            </p>
                            {entry.reviewedAt ? (
                              <p className="text-xs text-muted-foreground">
                                {copy.reviewed}: {formatDateTime(entry.reviewedAt, lang)}
                              </p>
                            ) : null}
                          </div>
	                          <Link
	                            href={`/${lang}/lawyers/${entry.lawyerProfile.id}`}
	                            target="_blank"
	                            className="text-sm font-medium text-primary hover:underline"
	                          >
	                            {copy.viewPublicProfile}
	                          </Link>
	                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                          {entry.identityDocumentUrl ? (
                            <a href={entry.identityDocumentUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-background px-3 py-2 text-foreground hover:bg-surface-hover">
                              {copy.openDocument}: {copy.identity}
                            </a>
                          ) : null}
                          {entry.enrollmentCertificateUrl ? (
                            <a href={entry.enrollmentCertificateUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-background px-3 py-2 text-foreground hover:bg-surface-hover">
                              {copy.openDocument}: {copy.certificate}
                            </a>
                          ) : null}
                          {entry.practiceCertificateUrl ? (
                            <a href={entry.practiceCertificateUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-background px-3 py-2 text-foreground hover:bg-surface-hover">
                              {copy.openDocument}: {copy.practice}
                            </a>
                          ) : null}
                        </div>

                        <div className="mt-4 space-y-3">
                          <select
                            data-testid={`verification-case-status-${entry.id}`}
                            value={draft?.status ?? entry.status}
                            onChange={(event) =>
                              setCaseDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  status: event.target.value as VerificationCase['status'],
                                  adminNotes: prev[entry.id]?.adminNotes ?? entry.adminNotes ?? '',
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            {VERIFICATION_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <textarea
                            data-testid={`verification-case-notes-${entry.id}`}
                            rows={3}
                            value={draft?.adminNotes ?? entry.adminNotes ?? ''}
                            onChange={(event) =>
                              setCaseDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  status: prev[entry.id]?.status ?? entry.status,
                                  adminNotes: event.target.value,
                                },
                              }))
                            }
                            placeholder={copy.notes}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            data-testid={`verification-case-save-${entry.id}`}
                            onClick={() => void saveCaseReview(entry)}
                            disabled={savingCaseId === entry.id}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            {savingCaseId === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {copy.save}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{copy.templateQueue}</h2>
              </div>
              {templates.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noTemplates}</p>
              ) : (
                <div className="space-y-5">
                  {templates.map((entry) => {
                    const draft = templateDrafts[entry.id];
                    return (
                      <div key={entry.id} data-testid={`template-review-${entry.id}`} className="rounded-2xl border border-border bg-surface/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {entry.category} • {entry.downloads} downloads
                            </p>
                            {entry.reviewedAt ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {copy.reviewed}: {formatDateTime(entry.reviewedAt, lang)}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <select
                            data-testid={`template-review-status-${entry.id}`}
                            value={draft?.editorialStatus ?? entry.editorialStatus}
                            onChange={(event) =>
                              setTemplateDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: event.target.value as TemplateRecord['editorialStatus'],
                                  reviewerNotes: prev[entry.id]?.reviewerNotes ?? entry.reviewerNotes ?? '',
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            {EDITORIAL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <textarea
                            data-testid={`template-review-notes-${entry.id}`}
                            rows={3}
                            value={draft?.reviewerNotes ?? entry.reviewerNotes ?? ''}
                            onChange={(event) =>
                              setTemplateDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: prev[entry.id]?.editorialStatus ?? entry.editorialStatus,
                                  reviewerNotes: event.target.value,
                                },
                              }))
                            }
                            placeholder={copy.notes}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            data-testid={`template-review-save-${entry.id}`}
                            onClick={() => void saveTemplateReview(entry)}
                            disabled={savingTemplateId === entry.id}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            {savingTemplateId === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {copy.save}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{copy.faqQueue}</h2>
              </div>
              {faqs.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noFaqs}</p>
              ) : (
                <div className="space-y-5">
                  {faqs.map((entry) => {
                    const draft = faqDrafts[entry.id];
                    return (
                      <div key={entry.id} data-testid={`faq-review-${entry.id}`} className="rounded-2xl border border-border bg-surface/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{entry.question}</h3>
                            <p className="text-sm text-muted-foreground">
                              {copy.category}: {entry.category.name}
                            </p>
                            {entry.reviewedAt ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {copy.reviewed}: {formatDateTime(entry.reviewedAt, lang)}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <select
                            data-testid={`faq-review-status-${entry.id}`}
                            value={draft?.editorialStatus ?? entry.editorialStatus}
                            onChange={(event) =>
                              setFaqDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: event.target.value as EditorialStatus,
                                  reviewerNotes: prev[entry.id]?.reviewerNotes ?? entry.reviewerNotes ?? '',
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            {EDITORIAL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <textarea
                            data-testid={`faq-review-notes-${entry.id}`}
                            rows={3}
                            value={draft?.reviewerNotes ?? entry.reviewerNotes ?? ''}
                            onChange={(event) =>
                              setFaqDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: prev[entry.id]?.editorialStatus ?? entry.editorialStatus,
                                  reviewerNotes: event.target.value,
                                },
                              }))
                            }
                            placeholder={copy.notes}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            data-testid={`faq-review-save-${entry.id}`}
                            onClick={() => void saveFaqReview(entry)}
                            disabled={savingFaqId === entry.id}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            {savingFaqId === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {copy.save}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{copy.guideQueue}</h2>
              </div>
              {guides.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noGuides}</p>
              ) : (
                <div className="space-y-5">
                  {guides.map((entry) => {
                    const draft = guideDrafts[entry.id];
                    return (
                      <div key={entry.id} data-testid={`guide-review-${entry.id}`} className="rounded-2xl border border-border bg-surface/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {copy.category}: {entry.category} • {copy.slug}: {entry.slug}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {copy.readTime}: {entry.readTime ?? '—'} min • {entry.hasPublishedContent ? copy.liveContent : copy.topicOnly}
                            </p>
                            {entry.reviewedAt ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {copy.reviewed}: {formatDateTime(entry.reviewedAt, lang)}
                              </p>
                            ) : null}
                          </div>
	                          <Link
	                            href={`/${lang}/guides/${entry.slug}`}
	                            target="_blank"
	                            className="text-sm font-medium text-primary hover:underline"
	                          >
	                            {copy.viewGuide}
	                          </Link>
	                        </div>

                        <div className="mt-4 space-y-3">
                          <select
                            data-testid={`guide-review-status-${entry.id}`}
                            value={draft?.editorialStatus ?? entry.editorialStatus}
                            onChange={(event) =>
                              setGuideDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: event.target.value as EditorialStatus,
                                  reviewerNotes: prev[entry.id]?.reviewerNotes ?? entry.reviewerNotes ?? '',
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            {EDITORIAL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <textarea
                            data-testid={`guide-review-notes-${entry.id}`}
                            rows={3}
                            value={draft?.reviewerNotes ?? entry.reviewerNotes ?? ''}
                            onChange={(event) =>
                              setGuideDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: prev[entry.id]?.editorialStatus ?? entry.editorialStatus,
                                  reviewerNotes: event.target.value,
                                },
                              }))
                            }
                            placeholder={copy.notes}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            data-testid={`guide-review-save-${entry.id}`}
                            onClick={() => void saveGuideReview(entry)}
                            disabled={savingGuideId === entry.id}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            {savingGuideId === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {copy.save}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{copy.rightsQueue}</h2>
              </div>
              {rights.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noRights}</p>
              ) : (
                <div className="space-y-5">
                  {rights.map((entry) => {
                    const draft = rightDrafts[entry.id];
                    return (
                      <div key={entry.id} data-testid={`right-review-${entry.id}`} className="rounded-2xl border border-border bg-surface/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {copy.slug}: {entry.slug}
                            </p>
                            {entry.reviewedAt ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {copy.reviewed}: {formatDateTime(entry.reviewedAt, lang)}
                              </p>
                            ) : null}
                          </div>
	                          <Link
	                            href={`/${lang}/rights/${entry.slug}`}
	                            target="_blank"
	                            className="text-sm font-medium text-primary hover:underline"
	                          >
	                            {copy.viewRightsPage}
	                          </Link>
	                        </div>

                        <div className="mt-4 space-y-3">
                          <select
                            data-testid={`right-review-status-${entry.id}`}
                            value={draft?.editorialStatus ?? entry.editorialStatus}
                            onChange={(event) =>
                              setRightDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: event.target.value as EditorialStatus,
                                  reviewerNotes: prev[entry.id]?.reviewerNotes ?? entry.reviewerNotes ?? '',
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            {EDITORIAL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <textarea
                            data-testid={`right-review-notes-${entry.id}`}
                            rows={3}
                            value={draft?.reviewerNotes ?? entry.reviewerNotes ?? ''}
                            onChange={(event) =>
                              setRightDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: prev[entry.id]?.editorialStatus ?? entry.editorialStatus,
                                  reviewerNotes: event.target.value,
                                },
                              }))
                            }
                            placeholder={copy.notes}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            data-testid={`right-review-save-${entry.id}`}
                            onClick={() => void saveRightReview(entry)}
                            disabled={savingRightId === entry.id}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            {savingRightId === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {copy.save}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{copy.lawsQueue}</h2>
              </div>
              {laws.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noLaws}</p>
              ) : (
                <div className="space-y-5">
                  {laws.map((entry) => {
                    const draft = lawDrafts[entry.id];
                    return (
                      <div key={entry.id} data-testid={`law-review-${entry.id}`} className="rounded-2xl border border-border bg-surface/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {copy.actCode}: {entry.shortCode} • {entry.sections.length} sections
                            </p>
                            {entry.reviewedAt ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {copy.reviewed}: {formatDateTime(entry.reviewedAt, lang)}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <select
                            data-testid={`law-review-status-${entry.id}`}
                            value={draft?.editorialStatus ?? entry.editorialStatus}
                            onChange={(event) =>
                              setLawDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: event.target.value as EditorialStatus,
                                  reviewerNotes: prev[entry.id]?.reviewerNotes ?? entry.reviewerNotes ?? '',
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            {EDITORIAL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <textarea
                            data-testid={`law-review-notes-${entry.id}`}
                            rows={3}
                            value={draft?.reviewerNotes ?? entry.reviewerNotes ?? ''}
                            onChange={(event) =>
                              setLawDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: prev[entry.id]?.editorialStatus ?? entry.editorialStatus,
                                  reviewerNotes: event.target.value,
                                },
                              }))
                            }
                            placeholder={copy.notes}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            data-testid={`law-review-save-${entry.id}`}
                            onClick={() => void saveLawReview(entry)}
                            disabled={savingLawId === entry.id}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            {savingLawId === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {copy.save}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{copy.lawSectionsQueue}</h2>
              </div>
              {lawSections.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noLawSections}</p>
              ) : (
                <div className="space-y-5">
                  {lawSections.map((entry) => {
                    const draft = lawSectionDrafts[entry.id];
                    return (
                      <div key={entry.id} data-testid={`law-section-review-${entry.id}`} className="rounded-2xl border border-border bg-surface/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {copy.act}: {entry.act.shortCode} • {copy.sectionKey}: {entry.sectionKey}
                            </p>
                            {entry.reviewedAt ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {copy.reviewed}: {formatDateTime(entry.reviewedAt, lang)}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <select
                            data-testid={`law-section-review-status-${entry.id}`}
                            value={draft?.editorialStatus ?? entry.editorialStatus}
                            onChange={(event) =>
                              setLawSectionDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: event.target.value as EditorialStatus,
                                  reviewerNotes: prev[entry.id]?.reviewerNotes ?? entry.reviewerNotes ?? '',
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            {EDITORIAL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <textarea
                            data-testid={`law-section-review-notes-${entry.id}`}
                            rows={3}
                            value={draft?.reviewerNotes ?? entry.reviewerNotes ?? ''}
                            onChange={(event) =>
                              setLawSectionDrafts((prev) => ({
                                ...prev,
                                [entry.id]: {
                                  editorialStatus: prev[entry.id]?.editorialStatus ?? entry.editorialStatus,
                                  reviewerNotes: event.target.value,
                                },
                              }))
                            }
                            placeholder={copy.notes}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            data-testid={`law-section-review-save-${entry.id}`}
                            onClick={() => void saveLawSectionReview(entry)}
                            disabled={savingLawSectionId === entry.id}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                          >
                            {savingLawSectionId === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {copy.save}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
