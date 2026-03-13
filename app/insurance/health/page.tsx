'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, Check, ChevronRight, Plus, X } from 'lucide-react';

import JsonLd from '@/components/JsonLd';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { healthPolicies } from '@/lib/insuranceData';
import { formatCurrency, formatNumber } from '@/lib/i18n/format';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { useLanguage } from '@/lib/LanguageContext';

const HEALTH_INSURANCE_PAGE = {
  maxCompareAlert: 'You can compare a maximum of 3 policies.',
  breadcrumbInsurance: 'Insurance',
  breadcrumbHealth: 'Health Insurance',
  title: 'Compare Health Insurance Plans',
  subtitle: 'Find the best medical cover for you and your family.',
  coverageType: 'Coverage Type',
  filterAll: 'All',
  filterIndividual: 'Individual',
  filterFamilyFloater: 'Family Floater',
  coverAmount: 'Cover Amount',
  cashlessHospitals: 'Cashless Hospitals',
  claimSettlement: 'Claim Settlement',
  preExistingWait: 'Pre-existing Wait',
  premium: 'Premium',
  buyNow: 'Buy Now',
  added: 'Added',
  addToCompare: 'Add to Compare',
  selectedLabel: 'Selected',
  compareNow: 'Compare Now',
  perMonth: '/mo',
  lakhsLabel: 'Lakhs',
} as const;

export default function HealthInsuranceListing() {
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(HEALTH_INSURANCE_PAGE, lang);
  const localizedPolicies = localizeTreeFromMemory(healthPolicies, lang, {
    skipKeys: ['id', 'providerName', 'planName', 'coverageType', 'sumInsured', 'premium', 'claimSettlementRatio', 'networkHospitals'],
  });
  const coverageOptions = [
    { value: 'All', label: copy.filterAll },
    { value: 'Individual', label: copy.filterIndividual },
    { value: 'Family Floater', label: copy.filterFamilyFloater },
  ] as const;
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [coverageTypeFilter, setCoverageTypeFilter] = useState<string>('All');

  const handleCompareToggle = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((policyId) => policyId !== id));
      return;
    }

    if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, id]);
      return;
    }

    alert(copy.maxCompareAlert);
  };

  const filteredPolicies = localizedPolicies.filter(
    (policy) => coverageTypeFilter === 'All' || policy.coverageType === coverageTypeFilter
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filteredPolicies.map((policy, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: policy.planName,
        provider: {
          '@type': 'Organization',
          name: policy.providerName,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: policy.premium * 12,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-muted pb-32">
      <JsonLd data={schema} />

      <div className="border-b border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center text-sm text-muted-foreground">
            <Link href={withLocalePrefix('/insurance', lang)} className="transition-colors hover:text-primary">
              {copy.breadcrumbInsurance}
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium text-foreground">{copy.breadcrumbHealth}</span>
          </div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground">
            <Activity className="h-8 w-8 text-danger" />
            {copy.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{copy.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-foreground">{copy.coverageType}</h3>
            <div className="space-y-3">
              {coverageOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="coverageType"
                    value={option.value}
                    checked={coverageTypeFilter === option.value}
                    onChange={(event) => setCoverageTypeFilter(event.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-3">
          {filteredPolicies.map((policy) => {
            const isSelected = selectedForCompare.includes(policy.id);
            return (
              <div
                key={policy.id}
                className="rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h2 className="text-xl font-bold text-foreground">{policy.providerName}</h2>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {policy.planName}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">{copy.coverAmount}</p>
                        <p className="font-bold text-foreground">{formatNumber(policy.sumInsured / 100000, lang, { maximumFractionDigits: 0 })} {copy.lakhsLabel}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">{copy.cashlessHospitals}</p>
                        <p className="font-bold text-foreground">{formatNumber(policy.networkHospitals, lang)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">{copy.claimSettlement}</p>
                        <p className="font-bold text-success">{policy.claimSettlementRatio}%</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">{copy.preExistingWait}</p>
                        <p className="font-bold text-foreground">{policy.preExistingWaitingPeriod}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {policy.features.slice(0, 2).map((feature) => (
                        <span
                          key={feature}
                          className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          <Check className="h-3 w-3 text-success" /> {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-center border-t border-border pt-4 md:w-auto md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <p className="mb-1 text-sm text-muted-foreground">{copy.premium}</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(policy.premium, lang)}
                      <span className="text-sm font-normal text-muted-foreground">{copy.perMonth}</span>
                    </p>
                    <button className="mt-4 w-full rounded-xl bg-accent px-6 py-2 font-bold text-accent-foreground transition-opacity hover:opacity-90">
                      {copy.buyNow}
                    </button>
                    <button
                      onClick={() => handleCompareToggle(policy.id)}
                      className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-4 w-4" /> {copy.added}
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> {copy.addToCompare}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <span className="font-bold text-foreground">
                {selectedForCompare.length}/3 {copy.selectedLabel}
              </span>
              <div className="flex gap-2">
                {selectedForCompare.map((id) => {
                  const policy = localizedPolicies.find((item) => item.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm">
                      <span className="font-medium text-foreground">{policy?.providerName}</span>
                      <button onClick={() => handleCompareToggle(id)} className="text-muted-foreground transition-colors hover:text-danger">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link
              href={`${withLocalePrefix('/insurance/health/compare', lang)}?ids=${selectedForCompare.join(',')}`}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold transition-colors ${
                selectedForCompare.length > 1
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'pointer-events-none cursor-not-allowed bg-muted text-muted-foreground'
              }`}
            >
              {copy.compareNow} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
