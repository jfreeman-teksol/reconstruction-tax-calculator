'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';

const BOOKING_URL = "https://outlook.office.com/bookwithme/user/73ce913e61ec43db99eddfad99a96ead%40yavardi.com/meetingtype/_vaZ8cL86UG1locDCtC5CA2?bookingcode=4261da7b-58fd-46b7-8c8e-b7fb03279a9b&anonymous&ismsaljsauthenabled";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkovyjky";

const TAX_MULTIPLIERS = [
  'Fee dispute resolution costs',
  'Carrier audits and reviews',
  'Malpractice claim reconstruction',
  'Bar complaint defense',
  'Client billing challenges',
  'Partner compensation disputes',
  'Discovery authority requirements',
  'Matter write-off acceleration during partner transitions',
];

// Text hierarchy
const T = {
  bright:  'rgb(241,245,249)',
  body:    'rgb(186,198,214)',
  dim:     'rgb(113,128,150)',
  red:     'rgb(239,68,68)',
  redSoft: 'rgb(252,165,165)',
};

export default function ReconstructionTaxCalculator() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [firmData, setFirmData] = useState({
    attorneys: '', blendedRate: '', matterVolume: '', billableHours: '', leakageRate: ''
  });

  const [leadData, setLeadData] = useState({
    firstName: '', lastName: '', email: '', firmName: '', phone: ''
  });

  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');

  const allInputsFilled = () => Object.values(firmData).every(v => v !== '' && parseFloat(v) > 0);

  const calculateResults = () => {
    const a = parseFloat(firmData.attorneys);
    const r = parseFloat(firmData.blendedRate);
    const m = parseFloat(firmData.matterVolume);
    const h = parseFloat(firmData.billableHours);
    const lr = parseFloat(firmData.leakageRate) / 100;
    const firmWideRecorded = a * h * r;
    const realizationLeak = firmWideRecorded * lr;
    const capacityLeak = m * 0.10 * 8 * r;
    const total = realizationLeak + capacityLeak;
    return {
      firmWideRecorded, realizationLeak, capacityLeak,
      total, monthly: total / 12,
      addrR: realizationLeak * 0.25,
      addrC: capacityLeak * 0.30
    };
  };

  const results = allInputsFilled() ? calculateResults() : null;

  const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  const blockNonNumeric = (e) => {
    if (['e', 'E', '-', '+', '.'].includes(e.key) && e.target.type === 'number') e.preventDefault();
  };

  const handleLeadSubmit = async () => {
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.firmName || !leadData.phone) {
      setLeadError('All fields are required.'); return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email);
    if (!emailValid) { setLeadError('Enter a valid email address.'); return; }
    const personalDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','aol.com','protonmail.com','mail.com','msn.com','live.com','me.com','mac.com'];
    const emailDomain = leadData.email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(emailDomain)) { setLeadError('Please enter a work email address.'); return; }

    setLeadSubmitting(true);
    setLeadError('');
    try {
      const payload = {
        ...leadData,
        attorneys: firmData.attorneys, blendedRate: firmData.blendedRate,
        matterVolume: firmData.matterVolume, billableHours: firmData.billableHours,
        leakageRate: firmData.leakageRate,
        annualAddressableExposure: results ? fmt(results.addrR) : 'N/A',
        annualTax: results ? fmt(results.total) : 'N/A',
        monthlyTax: results ? fmt(results.monthly) : 'N/A',
        submittedAt: new Date().toISOString()
      };
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) { setLeadSubmitted(true); }
      else { setLeadError('Submission failed. Please try again.'); }
    } catch (err) {
      setLeadError('Submission failed. Please try again.');
    }
    setLeadSubmitting(false);
  };

  const inp = {
    width: '100%', background: 'rgb(15,23,42)', border: '1px solid rgb(71,85,105)',
    borderRadius: '8px', padding: '12px 16px', color: 'white', fontSize: '16px',
    fontFamily: 'Georgia, Times New Roman, serif', boxSizing: 'border-box', outline: 'none'
  };
  const lbl = {
    display: 'block', fontSize: '13px', fontWeight: 700, color: T.dim,
    letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px'
  };
  const card = {
    background: 'rgba(30,41,59,0.5)', borderRadius: '12px',
    padding: isMobile ? '24px 20px' : '32px 40px',
    marginBottom: '32px', border: '1px solid rgb(51,65,85)'
  };
  const grid2 = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' };
  const sectionLabel = {
    fontSize: '10px', letterSpacing: '0.2em', color: T.dim,
    textTransform: 'uppercase', fontWeight: 700
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, rgb(15,23,42) 0%, rgb(30,41,59) 50%, rgb(15,23,42) 100%)', color: 'white', padding: isMobile ? '16px' : '32px', fontFamily: 'Georgia, Times New Roman, serif' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle style={{ width: '32px', height: '32px', color: T.red, flexShrink: 0 }} />
              <h1 style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '0.02em', margin: 0, color: T.bright }}>Reconstruction Tax Calculator</h1>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.15em', color: T.bright }}>YAVARDI</div>
              <div style={{ fontSize: '12px', color: T.dim }}>Technology Governance for Legal Operations</div>
            </div>
          </div>
          <p style={{ fontSize: isMobile ? '15px' : '17px', color: T.body, margin: 0 }}>Calculate the hidden tax your firm pays for missing digital proof of authority</p>
        </div>

        {/* Firm Profile Inputs */}
        <div style={card}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Georgia, serif', marginTop: 0, color: T.bright }}>Firm Profile</h2>
          <p style={{ fontSize: '13px', color: T.dim, marginBottom: '28px', marginTop: 0 }}>Enter your firm's actual numbers. All fields required to generate results.</p>
          <div style={{ ...grid2, marginBottom: '24px' }}>
            <div>
              <label style={lbl}>Number of Attorneys</label>
              <input style={inp} type="number" value={firmData.attorneys} onChange={e => setFirmData({ ...firmData, attorneys: e.target.value })} onKeyDown={blockNonNumeric} min="1" />
            </div>
            <div>
              <label style={lbl}>Blended Hourly Rate ($)</label>
              <input style={inp} type="number" value={firmData.blendedRate} onChange={e => setFirmData({ ...firmData, blendedRate: e.target.value })} onKeyDown={blockNonNumeric} min="1" />
            </div>
            <div>
              <label style={lbl}>Annual Matter Volume</label>
              <input style={inp} type="number" value={firmData.matterVolume} onChange={e => setFirmData({ ...firmData, matterVolume: e.target.value })} onKeyDown={blockNonNumeric} min="1" />
            </div>
            <div>
              <label style={lbl}>Target Billable Hours / Attorney</label>
              <input style={inp} type="number" value={firmData.billableHours} onChange={e => setFirmData({ ...firmData, billableHours: e.target.value })} onKeyDown={blockNonNumeric} min="1" />
            </div>
          </div>
          <div>
            <label style={lbl}>Realization Leakage Rate (%)</label>
            <input style={inp} type="number" value={firmData.leakageRate} onChange={e => setFirmData({ ...firmData, leakageRate: e.target.value })} onKeyDown={blockNonNumeric} min="0.1" max="100" step="0.1" />
            <p style={{ fontSize: '12px', color: T.dim, marginTop: '6px', marginBottom: 0 }}>Percentage of recorded billable value written down before invoicing</p>
          </div>
        </div>

        {/* Lead Gate */}
        {results && !leadSubmitted && (
          <div style={{ ...card, border: '1px solid rgba(59,130,246,0.4)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Georgia, serif', marginTop: 0, color: T.bright }}>Your Results Are Ready</h2>
            <p style={{ fontSize: '13px', color: T.dim, marginBottom: '28px', marginTop: 0 }}>Enter your contact information to view your firm's Reconstruction Tax exposure.</p>
            <div style={{ ...grid2, marginBottom: '24px' }}>
              <div>
                <label style={lbl}>First Name</label>
                <input style={inp} type="text" value={leadData.firstName} onChange={e => setLeadData({ ...leadData, firstName: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Last Name</label>
                <input style={inp} type="text" value={leadData.lastName} onChange={e => setLeadData({ ...leadData, lastName: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Work Email</label>
                <input style={inp} type="email" value={leadData.email} onChange={e => setLeadData({ ...leadData, email: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Firm Name</label>
                <input style={inp} type="text" value={leadData.firmName} onChange={e => setLeadData({ ...leadData, firmName: e.target.value })} />
              </div>
              <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
                <label style={lbl}>Phone Number</label>
                <input style={inp} type="tel" value={leadData.phone} onChange={e => setLeadData({ ...leadData, phone: e.target.value })} />
              </div>
            </div>
            {leadError && <p style={{ color: T.red, fontSize: '13px', marginBottom: '16px' }}>{leadError}</p>}
            <button onClick={handleLeadSubmit} disabled={leadSubmitting} style={{ width: '100%', background: leadSubmitting ? 'rgb(30,58,138)' : 'rgb(37,99,235)', color: 'white', border: 'none', borderRadius: '8px', padding: '16px 24px', fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 700, cursor: leadSubmitting ? 'default' : 'pointer' }}>
              {leadSubmitting ? 'Submitting...' : 'Show My Reconstruction Tax →'}
            </button>
            <p style={{ fontSize: '11px', color: T.dim, textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>Used only to follow up on your results. No spam.</p>
          </div>
        )}

        {/* Results */}
        {results && leadSubmitted && (
          <>
            {/* SECTION 1: Hero */}
            <div style={{ background: 'linear-gradient(135deg, rgba(127,29,29,0.78), rgba(100,10,10,0.88))', borderRadius: '12px', padding: isMobile ? '28px 20px' : '44px 52px', marginBottom: '24px', border: '2px solid rgba(239,68,68,0.6)' }}>
              <div style={{ ...sectionLabel, color: T.redSoft, marginBottom: '10px' }}>
                Estimated Defensive Write-Downs from Missing Authority Records
              </div>
              <div style={{ fontSize: isMobile ? '14px' : '15px', color: 'rgb(248,200,200)', marginBottom: '32px', lineHeight: 1.7, fontWeight: 500 }}>
                At {leadData.firmName}, approximately 25% of pre-invoice write-downs are defensive — value conceded not because work was unjustified, but because authorization could not be proven.
              </div>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ ...sectionLabel, color: T.redSoft, marginBottom: '8px' }}>Annual Addressable Exposure</div>
                <div style={{ fontSize: isMobile ? '52px' : '76px', fontWeight: 700, color: T.red, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{fmt(results.addrR)}</div>
                <div style={{ fontSize: '14px', color: 'rgb(220,160,160)', marginTop: '10px' }}>in annual write-downs tied to missing proof of authority</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '18px 24px', display: 'inline-block', marginBottom: '24px' }}>
                <div style={{ ...sectionLabel, color: T.redSoft, marginBottom: '6px' }}>Monthly</div>
                <div style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 700, color: T.red, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{fmt(results.addrR / 12)}</div>
                <div style={{ fontSize: '12px', color: 'rgb(180,120,120)', marginTop: '4px' }}>in defensible write-downs per month</div>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(200,140,140,0.5)', lineHeight: 1.5, fontStyle: 'italic' }}>
                Based on analysis of Thomson Reuters Institute, Clio Legal Trends Report, Altman Weil, and ABA research on law firm realization loss and billing failure causation.
              </div>
            </div>

            {/* SECTION 2: Where This Tax Originates */}
            <div style={card}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Georgia, serif', marginTop: 0, marginBottom: '6px', color: T.bright }}>Where This Tax Originates</h2>
              <p style={{ fontSize: '14px', color: T.dim, marginTop: 0, marginBottom: '28px', lineHeight: 1.6 }}>
                The Reconstruction Tax has two components. Together they define your firm's full exposure.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>

                {/* Realization Leakage */}
                <div style={{ background: 'rgba(22,30,48,0.9)', border: '1px solid rgb(55,68,90)', borderLeft: '3px solid rgba(239,68,68,0.6)', borderRadius: '10px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ ...sectionLabel, marginBottom: '12px' }}>Realization Leakage</div>
                  <div style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: 700, color: T.bright, fontFamily: 'Georgia, serif', marginBottom: '2px' }}>{fmt(results.realizationLeak)}</div>
                  <div style={{ fontSize: '12px', color: T.dim, marginBottom: '18px' }}>written down annually before invoicing</div>
                  <p style={{ fontSize: '13px', color: T.body, lineHeight: 1.7, marginTop: 0, marginBottom: '14px' }}>
                    During billing review, partners write down recorded time when authorization cannot be proven. The work was done. The authorization existed. The digital record was never captured.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {[
                      'Partners second-guess past decisions without records',
                      'Clients challenge scope — firm has no documentation',
                      'Discounts applied to avoid disputes, not because work was wrong'
                    ].map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '4px', height: '4px', background: T.dim, borderRadius: '50%', flexShrink: 0, marginTop: '7px' }} />
                        <div style={{ fontSize: '12px', color: T.dim }}>{t}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '14px 16px' }}>
                    <div style={{ ...sectionLabel, color: T.redSoft, marginBottom: '6px' }}>Defensible Portion</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: T.red, fontFamily: 'Georgia, serif' }}>{fmt(results.addrR)}</div>
                    <div style={{ fontSize: '11px', color: T.dim, marginTop: '4px' }}>25% of realization leakage tied to missing proof of authority</div>
                  </div>
                </div>

                {/* Capacity Leakage */}
                <div style={{ background: 'rgba(22,30,48,0.9)', border: '1px solid rgb(55,68,90)', borderLeft: '3px solid rgba(239,68,68,0.6)', borderRadius: '10px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ ...sectionLabel, marginBottom: '12px' }}>Capacity Leakage</div>
                  <div style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: 700, color: T.bright, fontFamily: 'Georgia, serif', marginBottom: '2px' }}>{fmt(results.capacityLeak)}</div>
                  <div style={{ fontSize: '12px', color: T.dim, marginBottom: '18px' }}>in senior attorney time burned on reconstruction</div>
                  <p style={{ fontSize: '13px', color: T.body, lineHeight: 1.7, marginTop: 0, marginBottom: '14px' }}>
                    After disputes surface, senior attorney time is consumed reconstructing what happened — searching emails, reviewing calendars, explaining old decisions. That time produces no revenue.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {[
                      'Email and calendar archaeology after disputes',
                      'Partner time explaining decisions made months ago',
                      'Reconstruction work that never becomes billable'
                    ].map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '4px', height: '4px', background: T.dim, borderRadius: '50%', flexShrink: 0, marginTop: '7px' }} />
                        <div style={{ fontSize: '12px', color: T.dim }}>{t}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '14px 16px' }}>
                    <div style={{ ...sectionLabel, color: T.redSoft, marginBottom: '6px' }}>Authority-Driven Portion</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: T.red, fontFamily: 'Georgia, serif' }}>{fmt(results.addrC)}</div>
                    <div style={{ fontSize: '11px', color: T.dim, marginTop: '4px' }}>30% of capacity leakage driven by missing authority records</div>
                  </div>
                </div>
              </div>

              {/* Tax Multipliers */}
              <div style={{ marginTop: '28px', background: 'rgba(50,12,12,0.5)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', padding: '20px 24px' }}>
                <div style={{ ...sectionLabel, color: T.redSoft, marginBottom: '14px' }}>Tax Multipliers — Not Included in This Estimate</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px 32px' }}>
                  {TAX_MULTIPLIERS.map((t, i) => (
                    <div key={i} style={{ fontSize: '12px', color: T.dim }}>• {t}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: Total */}
            <div style={{ background: 'rgba(12,18,28,0.9)', borderRadius: '12px', padding: isMobile ? '24px 20px' : '36px 44px', marginBottom: '32px', border: '1px solid rgb(35,45,60)' }}>
              <div style={{ ...sectionLabel, marginBottom: '24px' }}>Total Reconstruction Tax — Combined Annual Exposure</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px' }}>
                <div>
                  <div style={{ ...sectionLabel, marginBottom: '8px' }}>Annual Total</div>
                  <div style={{ fontSize: isMobile ? '40px' : '56px', fontWeight: 700, color: T.bright, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{fmt(results.total)}</div>
                  <div style={{ fontSize: '12px', color: T.dim, marginTop: '8px' }}>Realization Leakage + Capacity Leakage</div>
                </div>
                <div>
                  <div style={{ ...sectionLabel, marginBottom: '8px' }}>Monthly Total</div>
                  <div style={{ fontSize: isMobile ? '40px' : '56px', fontWeight: 700, color: T.bright, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{fmt(results.monthly)}</div>
                  <div style={{ fontSize: '12px', color: T.dim, marginTop: '8px' }}>Accruing every 30 days without intervention</div>
                </div>
              </div>
            </div>

            {/* SECTION 4: CTA */}
            <div style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.22), rgba(30,64,175,0.22))', borderRadius: '12px', padding: isMobile ? '24px 20px' : '36px 44px', border: '2px solid rgba(59,130,246,0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <Calendar style={{ width: '36px', height: '36px', color: 'rgb(147,197,253)', flexShrink: 0 }} />
                <div>
                  <h2 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, fontFamily: 'Georgia, serif', margin: 0, color: T.bright }}>Governance Discovery Call</h2>
                  <p style={{ color: T.dim, marginTop: '4px', marginBottom: 0, fontSize: '14px' }}>A deep-dive session to identify your authority gap exposure</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: T.body, marginBottom: '28px', lineHeight: 1.7 }}>
                Your firm has an estimated <strong style={{ color: T.red, fontWeight: 700 }}>{fmt(results.addrR)}</strong> in annual write-downs tied directly to missing proof of authority. This call maps the specific authority failure points driving that exposure and what it takes to close them.
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', background: 'rgb(37,99,235)', color: 'white', borderRadius: '8px', padding: '18px 24px', fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 700, textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
                Schedule Your Discovery Call →
              </a>
            </div>

            <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '11px', color: T.dim }}>
              © {new Date().getFullYear()} Yavardi. All rights reserved.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
