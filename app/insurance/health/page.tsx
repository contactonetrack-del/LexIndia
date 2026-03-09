'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { healthPolicies, InsurancePolicy } from '@/lib/insuranceData';
import { Shield, Check, Plus, X, ArrowRight, ChevronRight, Activity } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

export default function HealthInsuranceListing() {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [coverageTypeFilter, setCoverageTypeFilter] = useState<string>('All');

  const handleCompareToggle = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(pid => pid !== id));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, id]);
      } else {
        alert('You can compare a maximum of 3 policies.');
      }
    }
  };

  const filteredPolicies = healthPolicies.filter(p => 
    coverageTypeFilter === 'All' || p.coverageType === coverageTypeFilter
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredPolicies.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "FinancialProduct",
        "name": p.planName,
        "provider": {
          "@type": "Organization",
          "name": p.providerName
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": p.premium * 12 // Annualized
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <JsonLd data={schema} />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/insurance" className="hover:text-[#1E3A8A]">Insurance</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Health Insurance</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-rose-600" />
            Compare Health Insurance Plans
          </h1>
          <p className="text-gray-600 mt-2">Find the best medical cover for you and your family.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Coverage Type</h3>
            <div className="space-y-3">
              {['All', 'Individual', 'Family Floater'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="coverageType" 
                    value={type}
                    checked={coverageTypeFilter === type}
                    onChange={(e) => setCoverageTypeFilter(e.target.value)}
                    className="w-4 h-4 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Policy List */}
        <div className="lg:col-span-3 space-y-6">
          {filteredPolicies.map(policy => {
            const isSelected = selectedForCompare.includes(policy.id);
            return (
              <div key={policy.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{policy.providerName}</h2>
                      <span className="px-3 py-1 bg-blue-50 text-[#1E3A8A] text-xs font-bold rounded-full">
                        {policy.planName}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cover Amount</p>
                        <p className="font-bold text-gray-900">₹{(policy.sumInsured / 100000).toFixed(0)} Lakhs</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cashless Hospitals</p>
                        <p className="font-bold text-gray-900">{policy.networkHospitals.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Claim Settlement</p>
                        <p className="font-bold text-green-600">{policy.claimSettlementRatio}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pre-existing Wait</p>
                        <p className="font-bold text-gray-900">{policy.preExistingWaitingPeriod}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {policy.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          <Check className="w-3 h-3 text-green-500" /> {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto flex flex-col items-center md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <p className="text-sm text-gray-500 mb-1">Premium</p>
                    <p className="text-2xl font-bold text-[#1E3A8A]">₹{policy.premium}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                    <button className="w-full mt-4 bg-[#D4AF37] text-gray-900 font-bold py-2 px-6 rounded-xl hover:bg-yellow-500 transition-colors">
                      Buy Now
                    </button>
                    <button 
                      onClick={() => handleCompareToggle(policy.id)}
                      className={`w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-colors border ${isSelected ? 'bg-blue-50 border-blue-200 text-[#1E3A8A]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {isSelected ? <><Check className="w-4 h-4" /> Added</> : <><Plus className="w-4 h-4" /> Add to Compare</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Compare Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 p-4 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-900">{selectedForCompare.length}/3 Selected</span>
              <div className="flex gap-2">
                {selectedForCompare.map(id => {
                  const p = healthPolicies.find(p => p.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-sm">
                      <span className="font-medium text-gray-700">{p?.providerName}</span>
                      <button onClick={() => handleCompareToggle(id)} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link 
              href={`/insurance/health/compare?ids=${selectedForCompare.join(',')}`}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors ${selectedForCompare.length > 1 ? 'bg-[#1E3A8A] text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'}`}
            >
              Compare Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
