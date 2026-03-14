'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Scale,
  ShieldCheck,
  User,
  type LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { localizeTreeFromMemory, localizeTemplateText } from '@/lib/content/localized';
import { localizeHref } from '@/lib/i18n/navigation';
import { useLanguage } from '@/lib/LanguageContext';

type StepKey = 'type' | 'details' | 'contact';
type FormState = {
  category: string;
  description: string;
  urgency: string;
  name: string;
  phone: string;
};

const STEP_IDS: StepKey[] = ['type', 'details', 'contact'];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  family: User,
  criminal: ShieldCheck,
  property: Briefcase,
  corporate: FileText,
  other: Scale,
};

const CATEGORY_ORDER = ['family', 'criminal', 'property', 'corporate', 'other'] as const;
const EVALUATE_PAGE = {
  stepType: 'Case type',
  stepDetails: 'Details',
  stepContact: 'Contact',
  categoryFamily: 'Family and divorce',
  categoryCriminal: 'Criminal defense',
  categoryProperty: 'Property and real estate',
  categoryCorporate: 'Corporate and startup',
  categoryOther: 'Other or not sure',
  successTitle: 'You are on the list',
  successBody:
    'Our legal triage team is reviewing your details. We will call you at {phone} shortly with next steps and expert matches.',
  successAction: 'Browse lawyers meantime',
  headerTitle: 'Free legal pre-screening',
  headerBody:
    'Answer a few quick questions so we can match you with highly-rated legal experts for your situation.',
  typeTitle: 'What kind of legal help do you need?',
  detailsTitle: 'Tell us briefly about the situation.',
  detailsBody:
    'Avoid highly sensitive personal information. Keep it general so we can understand urgency and context.',
  detailsPlaceholder:
    'For example, I was terminated without notice and denied my final severance package.',
  urgencyLabel: 'How urgent is this matter?',
  urgencyLow: 'Low - Just seeking advice',
  urgencyMedium: 'Medium - Exploring options',
  urgencyHigh: 'High - Hearing or deadline imminent',
  contactTitle: 'Where should we send your matches?',
  contactBody: 'Your data is encrypted and not shared externally without explicit permission.',
  fullName: 'Full name',
  fullNamePlaceholder: 'John Doe',
  phone: 'Phone number',
  phonePlaceholder: '+91 98765 43210',
  back: 'Back',
  evaluating: 'Evaluating',
  getMatches: 'Get fast matches',
  continue: 'Continue',
} as const;

export default function PreScreeningPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const copy = localizeTreeFromMemory(EVALUATE_PAGE, lang);

  const stepTitles: Record<StepKey, string> = {
    type: copy.stepType,
    details: copy.stepDetails,
    contact: copy.stepContact,
  };

  const categoryLabels: Record<string, string> = {
    family: copy.categoryFamily,
    criminal: copy.categoryCriminal,
    property: copy.categoryProperty,
    corporate: copy.categoryCorporate,
    other: copy.categoryOther,
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormState>({
    category: '',
    description: '',
    urgency: copy.urgencyMedium,
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep < STEP_IDS.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground">{copy.successTitle}</h2>
          <p className="mb-8 text-muted-foreground">
            {localizeTemplateText(copy.successBody, lang, { phone: formData.phone })}
          </p>
          <button
            onClick={() => router.push(localizeHref('/lawyers', lang))}
            className="w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copy.successAction}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{copy.headerTitle}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{copy.headerBody}</p>
        </div>

        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-border" />
            <div
              className="absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(currentStep / (STEP_IDS.length - 1)) * 100}%` }}
            />
            {STEP_IDS.map((step, index) => (
              <div key={step} className="flex flex-col items-center gap-2 bg-muted px-2 text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                    index <= currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                </div>
                <span className={`text-xs font-semibold ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {stepTitles[step]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex min-h-[400px] flex-col rounded-2xl border border-border bg-background p-6 shadow-xl md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {currentStep === 0 ? (
                <div className="space-y-6">
                  <h2 className="mb-2 text-2xl font-bold text-foreground">{copy.typeTitle}</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {CATEGORY_ORDER.map((categoryId) => {
                      const Icon = CATEGORY_ICONS[categoryId];
                      const selected = formData.category === categoryId;
                      return (
                        <button
                          key={categoryId}
                          onClick={() => setFormData({ ...formData, category: categoryId })}
                          className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${
                            selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-foreground hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <span className="font-semibold">{categoryLabels[categoryId]}</span>
                          </div>
                          {selected ? <CheckCircle2 className="h-5 w-5" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {currentStep === 1 ? (
                <div className="space-y-6">
                  <h2 className="mb-2 text-2xl font-bold text-foreground">{copy.detailsTitle}</h2>
                  <p className="mb-6 text-muted-foreground">{copy.detailsBody}</p>
                  <div className="space-y-4">
                    <textarea
                      rows={5}
                      className="w-full resize-none rounded-xl border border-border p-4 outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder={copy.detailsPlaceholder}
                      value={formData.description}
                      onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    />
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground">{copy.urgencyLabel}</label>
                      <select
                        className="w-full rounded-xl border border-border bg-background p-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        value={formData.urgency}
                        onChange={(event) => setFormData({ ...formData, urgency: event.target.value })}
                      >
                        <option>{copy.urgencyLow}</option>
                        <option>{copy.urgencyMedium}</option>
                        <option>{copy.urgencyHigh}</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep === 2 ? (
                <div className="space-y-6">
                  <h2 className="mb-2 text-2xl font-bold text-foreground">{copy.contactTitle}</h2>
                  <p className="mb-6 text-muted-foreground">{copy.contactBody}</p>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground">{copy.fullName}</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-border p-4 outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder={copy.fullNamePlaceholder}
                        value={formData.name}
                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground">{copy.phone}</label>
                      <input
                        type="tel"
                        className="w-full rounded-xl border border-border p-4 outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder={copy.phonePlaceholder}
                        value={formData.phone}
                        onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-auto flex items-center justify-between border-t border-border pt-8">
            <button
              onClick={() => setCurrentStep((step) => step - 1)}
              disabled={currentStep === 0 || isSubmitting}
              className={`font-semibold text-muted-foreground transition-colors hover:text-foreground ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              {copy.back}
            </button>
            <button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (currentStep === 0 && !formData.category) ||
                (currentStep === 2 && (!formData.name || !formData.phone))
              }
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? copy.evaluating
                : currentStep === STEP_IDS.length - 1
                  ? copy.getMatches
                  : copy.continue}
              {!isSubmitting ? <ArrowRight className="h-5 w-5" /> : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
