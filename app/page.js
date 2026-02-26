'use client';

import React, { useState } from 'react';
import { DollarSign, AlertTriangle, TrendingUp, Clock, Calendar } from 'lucide-react';

const BOOKING_URL = "https://outlook.office.com/bookwithme/user/73ce913e61ec43db99eddfad99a96ead%40yavardi.com/meetingtype/_vaZ8cL86UG1locDCtC5CA2?bookingcode=4261da7b-58fd-46b7-8c8e-b7fb03279a9b&anonymous&ismsaljsauthenabled";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkovyjky";

export default function ReconstructionTaxCalculator() {
  const [firmData, setFirmData] = useState({
    attorneys: '',
    blendedRate: '',
    matterVolume: '',
    billableHours: '',
    leakageRate: ''
  });

  const [leadData, setLeadData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    firmName: ''
  });

  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');

  const allInputsFilled = () => {
    return Object.values(firmData).every(v => v !== '' && parseFloat(v) > 0);
  };

  const calculateResults = () => {
    const attorneys = parseFloat(firmData.attorneys);
    const blendedRate = parseFloat(firmData.blendedRate);
    const matterVolume = parseFloat(firmData.matterVolume);
    const billableHours = parseFloat(firmData.billableHours);
    const leakageRate = parseFloat(firmData.leakageRate) / 100;

    const firmWideRecorded = attorneys * billableHours * blendedRate;
    const realizationLeak = firmWideRecorded * leakageRate;
    const capacityLeak = matterVolume * 0.10 * 8 * blendedRate;
    const total = realizationLeak + capacityLeak;
    const addrR = realizationLeak * 0.25;
    const addrC = capacityLeak * 0.30;

    return {
      firmWideRecorded,
      realizationLeak,
      capacityLeak,
      total,
      monthly: total / 12,
      addrR,
      addrC
    };
  };

  const results = allInputsFilled() ? calculateResults() : null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleLeadSubmit = async () => {
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.firmName) {
      setLeadError('All fields are required.');
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email);
    if (!emailValid) {
      setLeadError('Enter a valid email address.');
      return;
    }
    const personalDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','aol.com','protonmail.com','mail.com','msn.com','live.com','me.com','mac.com'];
    const emailDomain = leadData.email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(emailDomain)) {
      setLeadError('Please enter a work email address.');
      return;
    }

    setLeadSubmitting(true);
    setLeadError('');

    try {
      const payload = {
        ...leadData,
        attorneys: firmData.attorneys,
        blendedRate: firmData.blendedRate,
        matterVolume: firmData.matterVolume,
        billableHours: firmData.billableHours,
        leakageRate: firmData.leakageRate,
        annualAddressableExposure: results ? formatCurrency(results.addrR) : 'N/A',
        annualTax: results ? formatCurrency(results.total) : 'N/A',
        monthlyTax: results ? formatCurrency(results.monthly) : 'N/A',
        submittedAt: new Date().toISOString()
      };

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setLeadSubmitted(true);
      } else {
        setLeadError('Submission failed. Please try again.');
      }
    } catch (err) {
      setLeadError('Submission failed. Please try again.');
    }

    setLeadSubmitting(false);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgb(15,23,42)',
    border: '1px solid rgb(71,85,105)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '16px',
    fontFamily: 'Georgia, Times New Roman, serif',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgb(203,213,225)',
    marginBottom: '8px'
  };

  const cardStyle = {
    background: 'rgba(30,41,59,0.5)',
    borderRadius: '12px',
    padding: '32px 40px',
    marginBottom: '32px',
    border: '1px solid rgb(51,65,85)'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, rgb(15,23,42) 0%, rgb(30,41,59) 50%, rgb(15,23,42) 100%)', color: 'white', padding: '32px', fontFamily: 'Georgia, Times New Roman, serif' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle style={{ width: '40px', height: '40px', color: 'rgb(239,68,68)' }} />
              <h1 style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '0.02em', margin: 0 }}>Reconstruction Tax Calculator</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.15em' }}>YAVARDI</div>
              <div style={{ fontSize: '13px', color: 'rgb(148,163,184)' }}>Technology Governance for Legal Operations</div>
            </div>
          </div>
          <p style={{ fontSize: '18px', color: 'rgb(203,213,225)', margin: 0 }}>Calculate the hidden tax your firm pays for missing digital proof of authority</p>
        </div>

        {/* Firm Profile Inputs */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', fontFamily: 'Georgia, serif', marginTop: 0 }}>Firm Profile</h2>
          <p style={{ fontSize: '13px', color: 'rgb(100,116,139)', marginBottom: '28px', marginTop: 0 }}>Enter your firm's actual numbers. All fields required to generate results.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Number of Attorneys</label>
              <input style={inputStyle} type="number" value={firmData.attorneys} onChange={e => setFirmData({ ...firmData, attorneys: e.target.value })} min="1" />
            </div>
            <div>
              <label style={labelStyle}>Blended Hourly Rate ($)</label>
              <input style={inputStyle} type="number" value={firmData.blendedRate} onChange={e => setFirmData({ ...firmData, blendedRate: e.target.value })} min="1" />
            </div>
            <div>
              <label style={labelStyle}>Annual Matter Volume</label>
              <input style={inputStyle} type="number" value={firmData.matterVolume} onChange={e => setFirmData({ ...firmData, matterVolume: e.target.value })} min="1" />
            </div>
            <div>
              <label style={labelStyle}>Target Billable Hours / Attorney <span style={{ fontSize: '12px', color: 'rgb(100,116,139)', fontWeight: 400 }}>— Industry avg: 730</span></label>
              <input style={inputStyle} type="number" value={firmData.billableHours} onChange={e => setFirmData({ ...firmData, billableHours: e.target.value })} min="1" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Realization Leakage Rate (%) <span style={{ fontSize: '12px', color: 'rgb(100,116,139)', fontWeight: 400 }}>— Industry avg: 12%</span></label>
            <input style={inputStyle} type="number" value={firmData.leakageRate} onChange={e => setFirmData({ ...firmData, leakageRate: e.target.value })} min="0.1" max="100" step="0.1" />
            <p style={{ fontSize: '12px', color: 'rgb(100,116,139)', marginTop: '6px', marginBottom: 0 }}>Percentage of recorded billable value written down before invoicing</p>
          </div>
        </div>

        {/* Lead Gate */}
        {results && !leadSubmitted && (
          <div style={{ ...cardStyle, border: '1px solid rgba(59,130,246,0.4)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', fontFamily: 'Georgia, serif', marginTop: 0 }}>Your Results Are Ready</h2>
            <p style={{ fontSize: '13px', color: 'rgb(100,116,139)', marginBottom: '28px', marginTop: 0 }}>Enter your contact information to view your firm's Reconstruction Tax exposure.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input style={inputStyle} type="text" value={leadData.firstName} onChange={e => setLeadData({ ...leadData, firstName: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input style={inputStyle} type="text" value={leadData.lastName} onChange={e => setLeadData({ ...leadData, lastName: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Work Email</label>
                <input style={inputStyle} type="email" value={leadData.email} onChange={e => setLeadData({ ...leadData, email: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Firm Name</label>
                <input style={inputStyle} type="text" value={leadData.firmName} onChange={e => setLeadData({ ...leadData, firmName: e.target.value })} />
              </div>
            </div>

            {leadError && <p style={{ color: 'rgb(239,68,68)', fontSize: '13px', marginBottom: '16px' }}>{leadError}</p>}

            <button
              onClick={handleLeadSubmit}
              disabled={leadSubmitting}
              style={{ width: '100%', background: leadSubmitting ? 'rgb(30,58,138)' : 'rgb(37,99,235)', color: 'white', border: 'none', borderRadius: '8px', padding: '16px 24px', fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 600, cursor: leadSubmitting ? 'default' : 'pointer' }}
            >
              {leadSubmitting ? 'Submitting...' : 'Show My Reconstruction Tax →'}
            </button>
            <p style={{ fontSize: '11px', color: 'rgb(71,85,105)', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>Used only to follow up on your results. No spam.</p>
          </div>
        )}

        {/* Results */}
        {results && leadSubmitted && (
          <>
            {/* Hero — Addressable Realization */}
            <div style={{ background: 'linear-gradient(135deg, rgba(127,29,29,0.7), rgba(100,10,10,0.8))', borderRadius: '12px', padding: '40px 48px', marginBottom: '24px', border: '2px solid rgba(239,68,68,0.6)' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'rgb(252,165,165)', textTransform: 'uppercase', marginBottom: '8px' }}>Estimated Defensive Write-Downs from Missing Authority Records</div>
              <div style={{ fontSize: '13px', color: 'rgb(185,130,130)', marginBottom: '28px', lineHeight: 1.6 }}>
                At {leadData.firmName}, approximately 25% of pre-invoice write-downs are defensive — value conceded not because work was unjustified, but because authorization could not be proven.
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '36px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgb(252,165,165)', textTransform: 'uppercase', marginBottom: '6px' }}>Annual Addressable Exposure</div>
                  <div style={{ fontSize: '72px', fontWeight: 700, color: 'rgb(239,68,68)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{formatCurrency(results.addrR)}</div>
                </div>
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ fontSize: '13px', color: 'rgb(185,130,130)' }}>per year in write-downs</div>
                  <div style={{ fontSize: '13px', color: 'rgb(185,130,130)' }}>tied directly to missing proof of authority</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgb(185,130,130)', textTransform: 'uppercase', marginBottom: '6px' }}>Monthly</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(239,68,68)', fontFamily: 'Georgia, serif' }}>{formatCurrency(results.addrR / 12)}</div>
                  <div style={{ fontSize: '12px', color: 'rgb(120,80,80)', marginTop: '4px' }}>addressable / month</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgb(185,130,130)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Realization Leakage</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(203,213,225)', fontFamily: 'Georgia, serif' }}>{formatCurrency(results.realizationLeak)}</div>
                  <div style={{ fontSize: '12px', color: 'rgb(120,80,80)', marginTop: '4px' }}>written down annually</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgb(185,130,130)', textTransform: 'uppercase', marginBottom: '6px' }}>Firm Recorded Value</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(203,213,225)', fontFamily: 'Georgia, serif' }}>{formatCurrency(results.firmWideRecorded)}</div>
                  <div style={{ fontSize: '12px', color: 'rgb(120,80,80)', marginTop: '4px' }}>annual billable recorded</div>
                </div>
              </div>
            </div>

            {/* Total Exposure Context */}
            <div style={{ background: 'rgba(20,25,35,0.7)', borderRadius: '12px', padding: '28px 40px', marginBottom: '24px', border: '1px solid rgb(40,50,65)' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgb(71,85,105)', textTransform: 'uppercase', marginBottom: '16px' }}>Total Reconstruction Tax — Full Economic Context</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgb(71,85,105)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Annual Tax</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'rgb(185,50,50)', fontFamily: 'Georgia, serif' }}>{formatCurrency(results.total)}</div>
                  <div style={{ fontSize: '12px', color: 'rgb(55,65,81)', marginTop: '4px' }}>Realization + Capacity leakage</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgb(71,85,105)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Monthly Tax</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'rgb(185,50,50)', fontFamily: 'Georgia, serif' }}>{formatCurrency(results.monthly)}</div>
                  <div style={{ fontSize: '12px', color: 'rgb(55,65,81)', marginTop: '4px' }}>Every 30 days</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgb(71,85,105)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Capacity Leakage</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'rgb(185,50,50)', fontFamily: 'Georgia, serif' }}>{formatCurrency(results.capacityLeak)}</div>
                  <div style={{ fontSize: '12px', color: 'rgb(55,65,81)', marginTop: '4px' }}>Senior time burned on reconstruction</div>
                </div>
              </div>
            </div>

            {/* Where it originates */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Georgia, serif', marginTop: 0, marginBottom: '20px' }}>Where This Tax Originates</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgb(251,146,60)', textTransform: 'uppercase', marginBottom: '12px' }}>Realization Leakage</div>
                  <p style={{ fontSize: '13px', color: 'rgb(148,163,184)', lineHeight: 1.7, marginTop: 0 }}>
                    During billing review, partners write down recorded time when authorization cannot be proven. The work was done. The authorization existed. The digital record was never captured. The firm concedes value to avoid dispute — not because the charge was wrong.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {['Partners second-guess past decisions', 'Clients challenge scope without documentation', 'Staff cannot defend charges under scrutiny', 'Discounts applied to preserve relationships'].map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '6px', height: '6px', background: 'rgb(251,146,60)', borderRadius: '50%', flexShrink: 0, marginTop: '5px' }} />
                        <div style={{ fontSize: '12px', color: 'rgb(100,116,139)' }}>{t}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgb(96,165,250)', textTransform: 'uppercase', marginBottom: '12px' }}>Capacity Leakage</div>
                  <p style={{ fontSize: '13px', color: 'rgb(148,163,184)', lineHeight: 1.7, marginTop: 0 }}>
                    After disputes surface, senior attorney time is consumed reconstructing what happened — searching emails, reviewing calendars, explaining old decisions. That time could have been billable. It produces no revenue.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {['Email and calendar reconstruction', 'Partner debate over historical authorization', 'Attorney time explaining prior work', 'Reconstruction that never becomes billable'].map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '6px', height: '6px', background: 'rgb(96,165,250)', borderRadius: '50%', flexShrink: 0, marginTop: '5px' }} />
                        <div style={{ fontSize: '12px', color: 'rgb(100,116,139)' }}>{t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '28px', background: 'rgba(80,20,20,0.3)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '16px 20px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgb(252,165,165)', textTransform: 'uppercase', marginBottom: '10px' }}>Tax Multipliers — Not Included in This Estimate</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {['Carrier audits and reviews', 'Client billing challenges', 'Partner compensation disputes', 'Discovery authority requirements', 'Malpractice claim reconstruction'].map((t, i) => (
                    <div key={i} style={{ fontSize: '12px', color: 'rgb(100,116,139)' }}>• {t}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.3), rgba(30,64,175,0.3))', borderRadius: '12px', padding: '32px 40px', border: '2px solid rgba(59,130,246,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <Calendar style={{ width: '48px', height: '48px', color: 'rgb(96,165,250)', flexShrink: 0 }} />
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Georgia, serif', margin: 0 }}>Governance Discovery Call</h2>
                  <p style={{ color: 'rgb(191,219,254)', marginTop: '4px', marginBottom: 0, fontSize: '15px' }}>A deep-dive session to identify your authority gap exposure</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'rgb(100,116,139)', marginBottom: '28px', lineHeight: 1.7 }}>
                Your firm has an estimated <strong style={{ color: 'rgb(239,68,68)' }}>{formatCurrency(results.addrR)}</strong> in annual write-downs tied directly to missing proof of authority. This call maps the specific authority failure points driving that exposure and what it takes to close them.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', width: '100%', background: 'rgb(37,99,235)', color: 'white', borderRadius: '8px', padding: '18px 24px', fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 600, textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}
              >
                Schedule Your Discovery Call →
              </a>
            </div>

            <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: 'rgb(51,65,85)' }}>
              © {new Date().getFullYear()} Yavardi. All rights reserved.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
