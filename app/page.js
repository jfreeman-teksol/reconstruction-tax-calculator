'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function ReconstructionTaxCalculator() {
  const [firmData, setFirmData] = useState({
    attorneys: 50,
    blendedRate: 300,
    matterVolume: 400
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateTax();
  }, [firmData]);

  const calculateTax = () => {
    const { attorneys, blendedRate, matterVolume } = firmData;
    
    const effectiveBillableHours = 730;
    const annualRecordedPerAttorney = effectiveBillableHours * blendedRate;
    const firmWideRecorded = attorneys * annualRecordedPerAttorney;
    
    const realizationLeakage = firmWideRecorded * 0.12;
    
    const reconstructionRate = matterVolume * 0.10;
    const hoursPerMatter = 8;
    const seniorCost = 250;
    const capacityLeakage = reconstructionRate * hoursPerMatter * seniorCost;
    
    const totalExposure = realizationLeakage + capacityLeakage;
    const monthlyTax = totalExposure / 12;
    
    const addressableRealization = realizationLeakage * 0.25;
    const addressableCapacity = capacityLeakage * 0.30;

    setResults({
      realizationLeakage,
      capacityLeakage,
      totalExposure,
      monthlyTax,
      addressableRealization,
      addressableCapacity,
      firmWideRecorded
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <h1 className="text-4xl font-bold" style={{ fontFamily: "'Crimson Text', 'Georgia', serif", letterSpacing: '0.02em' }}>Reconstruction Tax Calculator</h1>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tracking-wider" style={{ fontFamily: "'Crimson Text', 'Georgia', serif", letterSpacing: '0.15em' }}>YAVARDI</div>
              <div className="text-sm text-slate-400" style={{ fontFamily: "'Georgia', serif" }}>Technology Governance for Legal Operations</div>
            </div>
          </div>
          <p className="text-slate-300 text-lg">
            Calculate the hidden tax your firm pays monthly for missing digital proof of authority
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-8 mb-8 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>Firm Profile</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Number of Attorneys
              </label>
              <input
                type="number"
                value={firmData.attorneys}
                onChange={(e) => setFirmData({...firmData, attorneys: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Blended Hourly Rate ($)
              </label>
              <input
                type="number"
                value={firmData.blendedRate}
                onChange={(e) => setFirmData({...firmData, blendedRate: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Annual Matter Volume
              </label>
              <input
                type="number"
                value={firmData.matterVolume}
                onChange={(e) => setFirmData({...firmData, matterVolume: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                min="1"
              />
            </div>
          </div>
        </div>

        {results && (
          <>
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-xl p-8 mb-8 border-2 border-red-500/50">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>Your Reconstruction Tax</h2>
                  <p className="text-red-200">The cost of missing digital proof of authority</p>
                </div>
                <DollarSign className="w-12 h-12 text-red-400" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border-2 border-red-500/30">
                  <div className="text-red-400 text-sm font-medium mb-2" style={{ letterSpacing: '0.1em' }}>MONTHLY TAX</div>
                  <div className="text-6xl font-bold text-red-400" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>{formatCurrency(results.monthlyTax)}</div>
                  <div className="text-slate-400 mt-2">Every 30 days</div>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-6 border-2 border-red-500/30">
                  <div className="text-red-400 text-sm font-medium mb-2" style={{ letterSpacing: '0.1em' }}>ANNUAL TAX</div>
                  <div className="text-6xl font-bold text-red-400" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>{formatCurrency(results.totalExposure)}</div>
                  <div className="text-slate-400 mt-2">Conservative floor</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-semibold" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>Realization Tax</h3>
                </div>
                <div className="text-4xl font-bold mb-2 text-white" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>{formatCurrency(results.realizationLeakage)}</div>
                <p className="text-slate-400 mb-4">Annual revenue written down</p>
                <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300">
                  Partners write down {formatCurrency(results.realizationLeakage)} annually during billing review. Authorization existed. Digital proof was never captured. <strong className="text-orange-300">{formatCurrency(results.addressableRealization)}</strong> is defensive write-downs from missing proof of authority.
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>Capacity Tax</h3>
                </div>
                <div className="text-4xl font-bold mb-2 text-white" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>{formatCurrency(results.capacityLeakage)}</div>
                <p className="text-slate-400 mb-4">Annual capacity consumed</p>
                <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300">
                  Senior attorneys consume {formatCurrency(results.capacityLeakage)} annually reconstructing authority. Email searches, calendar reviews, explaining old decisions. <strong className="text-blue-300">{formatCurrency(results.addressableCapacity)}</strong> is authority-driven reconstruction.
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 mb-8 border border-slate-700">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>What This Tax Costs You</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-red-400 mb-2" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>{formatCurrency(results.monthlyTax)}</div>
                  <div className="text-slate-400 mb-6">Monthly accumulation</div>
                  
                  <div className="space-y-3 text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <div>Partners writing down <strong className="text-white">{formatCurrency(results.realizationLeakage / 12)}/month</strong> in unbillable work</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <div>Senior capacity bleeding <strong className="text-white">{formatCurrency(results.capacityLeakage / 12)}/month</strong> to reconstruction</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <div>Billing disputes resolved through concession, not evidence</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <div>Partner conflicts over historical authorization</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-5xl font-bold text-red-400 mb-2" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>{formatCurrency(results.totalExposure)}</div>
                  <div className="text-slate-400 mb-6">Annual tax liability</div>
                  
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-200 text-sm font-semibold mb-2" style={{ letterSpacing: '0.05em' }}>TAX MULTIPLIERS</div>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div>• Carrier audits and reviews</div>
                      <div>• Client billing challenges</div>
                      <div>• Partner compensation disputes</div>
                      <div>• Discovery authority requirements</div>
                      <div>• Malpractice claim reconstruction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-8 border-2 border-blue-500/50">
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle className="w-12 h-12 text-blue-400" />
                <div>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>Dominion Baseline Assessment</h2>
                  <p className="text-blue-200 text-lg mt-1">30-day authority gap diagnostic</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border-2 border-blue-500/30">
                  <div className="text-blue-400 text-sm font-medium mb-2" style={{ letterSpacing: '0.1em' }}>INVESTMENT</div>
                  <div className="text-5xl font-bold text-blue-400" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>$7,500</div>
                  <div className="text-slate-400 text-sm mt-2">Paid in advance</div>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-6">
                  <div className="text-slate-400 text-sm font-medium mb-2" style={{ letterSpacing: '0.1em' }}>TIMELINE</div>
                  <div className="text-4xl font-bold" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>30</div>
                  <div className="text-slate-400 text-sm mt-2">Days to complete</div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6">
                  <div className="text-slate-400 text-sm font-medium mb-2" style={{ letterSpacing: '0.1em' }}>KICKOFF</div>
                  <div className="text-4xl font-bold" style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}>5</div>
                  <div className="text-slate-400 text-sm mt-2">Days after access</div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 mb-4">
                <p className="text-slate-300 mb-4">
                  <strong className="text-white">The Baseline maps every authority gap in your environment.</strong> We document where decisions execute without preserved digital proof of authority and quantify the financial impact.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
                  <div>• Authority failure mapping</div>
                  <div>• Financial impact quantification</div>
                  <div>• Execution risk documentation</div>
                  <div>• Governance implementation path</div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>Next step:</strong> Baseline kickoff. Assessment begins within 5 business days of access provisioning.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-slate-900/30 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-400" style={{ letterSpacing: '0.05em' }}>METHODOLOGY</h3>
                <div className="text-xs text-slate-500">Yavardi Legal Economic Model</div>
              </div>
              <div className="text-xs text-slate-400 space-y-2">
                <p>• 730 effective billable hours per attorney annually (conservative floor)</p>
                <p>• 12% realization leakage (industry standard pre-invoice write-downs)</p>
                <p>• 10% of matters trigger reconstruction at 8 hours senior time per matter</p>
                <p>• 25% of realization write-downs are defensive, 30% of capacity burn is authority-driven</p>
                <p>• Excludes insurance exposure, motion practice costs, regulatory penalties, reputational impact</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
