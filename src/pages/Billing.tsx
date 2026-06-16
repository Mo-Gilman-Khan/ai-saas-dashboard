import React, { useState } from 'react';
import { CreditCard, Check, ShieldAlert, Sparkles, Download, Receipt } from 'lucide-react';

interface BillingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  color: string;
  popular?: boolean;
}

const TIER_CARDS: BillingTier[] = [
  {
    id: 'developer',
    name: 'Developer Sandbox',
    price: '$29',
    period: '/mo',
    desc: 'Perfect for prototyping and early-stage app building.',
    features: [
      '10M monthly model tokens',
      'Rate limit: 200 Requests / Min',
      'Access to Aether-Llama 3 (8B)',
      'Basic model fine-tuning',
      'Community chat support'
    ],
    color: '6, 182, 212', // Cyan
  },
  {
    id: 'scale',
    name: 'Production Scale',
    price: '$149',
    period: '/mo',
    desc: 'For high-traffic production workloads requiring premium uptime.',
    features: [
      '100M monthly model tokens',
      'Rate limit: 1,000 Requests / Min',
      'Access to all models including 70B',
      'Advanced concurrent fine-tuning',
      'Shared latency optimization profiles',
      '24/7 dedicated email support'
    ],
    color: '139, 92, 246', // Purple
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Matrix',
    price: 'Custom',
    period: '',
    desc: 'Bespoke deployments for massive scale and compliance.',
    features: [
      'Unlimited custom tokens',
      'Custom dedicated hardware nodes',
      'Guaranteed <100ms latency SLAs',
      'Unlimited fine-tuned models',
      'HIPAA & SOC-2 compliance vault',
      'Dedicated Slack / Phone support'
    ],
    color: '236, 72, 153' // Pink
  }
];

export const Billing: React.FC = () => {
  const [currentTier, setCurrentTier] = useState('developer');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<BillingTier | null>(null);
  
  const currentQuota = 74.2;
  const currentCost = 156.40;
  const quotaLimit = 250.00;

  const invoices = [
    { id: 'INV-2849', date: '2026-06-01', amount: '$128.40', status: 'paid' },
    { id: 'INV-2715', date: '2026-05-01', amount: '$94.10', status: 'paid' },
    { id: 'INV-2598', date: '2026-04-01', amount: '$29.00', status: 'paid' },
  ];

  const handleUpgradeClick = (tier: BillingTier) => {
    if (tier.id === currentTier) return;
    setCheckoutTarget(tier);
    setShowCheckoutModal(true);
  };

  const confirmUpgrade = () => {
    if (checkoutTarget) {
      setCurrentTier(checkoutTarget.id);
      setShowCheckoutModal(false);
      alert(`Successfully upgraded to the "${checkoutTarget.name}" plan!`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Quota limit progress */}
      <div 
        className="glass-panel quota-panel"
        style={{
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '30px',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Monthly Quota Progress</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>You are on the Developer Sandbox plan tier. Tokens accumulate monthly.</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
              ${currentCost.toFixed(2)}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>/ ${quotaLimit.toFixed(2)} monthly spending limit</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--text-muted)' }}>Active Rate Limit</span>
              <span style={{ color: '#fff', fontWeight: '500', marginTop: '2px' }}>200 requests/min</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--text-muted)' }}>Billing Cycle Renews</span>
              <span style={{ color: '#fff', fontWeight: '500', marginTop: '2px' }}>July 01, 2026</span>
            </div>
          </div>
        </div>

        {/* Circular SVG Quota Progress */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', width: '110px', height: '110px' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="8" 
                strokeDasharray="263.8"
                strokeDashoffset={263.8 - (263.8 * currentQuota) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{currentQuota}%</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '500' }}>Tokens Used</span>
            </div>
          </div>

          {currentQuota > 70 && (
            <div 
              style={{
                background: 'rgba(245, 158, 11, 0.03)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderRadius: '6px',
                padding: '10px 14px',
                maxWidth: '200px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}
            >
              <ShieldAlert size={14} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                High usage warning! You are nearing your monthly spending ceiling.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tiers Pricing Grid */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Upgrade Subscription</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Unlock higher API throughput, premium models, and dedicated node hosting.</p>
        
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}
          className="tiers-grid"
        >
          {TIER_CARDS.map((tier) => {
            const isCurrent = tier.id === currentTier;
            return (
              <div 
                key={tier.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderColor: isCurrent ? 'var(--primary)' : 'var(--border-medium)',
                  transform: tier.popular ? 'scale(1.02)' : 'none',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'var(--shadow-md)'
                }}
              >
                {/* Popular Pill badge */}
                {tier.popular && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={8} fill="#fff" />
                    RECOMMENDED
                  </div>
                )}

                {/* Header */}
                <div>
                  <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{tier.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px', gap: '2px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      {tier.price}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{tier.period}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
                    {tier.desc}
                  </p>
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px' }}>
                      <Check size={14} style={{ color: `rgb(${tier.color})`, flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button 
                  onClick={() => handleUpgradeClick(tier)}
                  disabled={isCurrent}
                  className="btn"
                  style={{
                    width: '100%',
                    marginTop: 'auto',
                    backgroundColor: isCurrent ? 'rgba(255,255,255,0.03)' : `rgb(${tier.color})`,
                    color: isCurrent ? 'var(--text-muted)' : '#fff',
                    border: isCurrent ? '1px solid var(--border-medium)' : 'none',
                    cursor: isCurrent ? 'default' : 'pointer',
                    boxShadow: isCurrent ? 'none' : `0 4px 12px rgba(${tier.color}, 0.25)`
                  }}
                >
                  {isCurrent ? 'Current Plan Active' : 'Subscribe / Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice list */}
      <div 
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Receipt size={16} color="var(--primary)" />
          Invoice & Payment Records
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px', fontWeight: '500' }}>Invoice ID</th>
                <th style={{ padding: '10px', fontWeight: '500' }}>Billing Date</th>
                <th style={{ padding: '10px', fontWeight: '500' }}>Amount Charged</th>
                <th style={{ padding: '10px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '10px', fontWeight: '500', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 10px', color: '#fff', fontFamily: 'var(--font-mono)' }}>{inv.id}</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{inv.date}</td>
                  <td style={{ padding: '12px 10px', color: '#fff', fontWeight: '600' }}>{inv.amount}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button 
                      style={{ 
                        color: 'var(--text-secondary)', 
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="Download Invoice PDF"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout simulator modal */}
      {showCheckoutModal && checkoutTarget && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowCheckoutModal(false)}
          />
          <div 
            className="glass-panel animate-fade-in"
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '420px',
              zIndex: 1000,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              border: '1px solid var(--border-hover)',
              boxShadow: 'var(--shadow-lg)',
              background: '#0d0d15'
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>Secure Checkout Portal</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Confirm your subscription transaction details below.</p>
            </div>

            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-medium)',
                borderRadius: '6px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>PLAN SELECTION</span>
                <div style={{ color: '#fff', fontWeight: '600', fontSize: '15px', marginTop: '2px' }}>{checkoutTarget.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--secondary)' }}>{checkoutTarget.price}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{checkoutTarget.period}</span>
              </div>
            </div>

            {/* Payment card form mock */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Credit Card Details</label>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid var(--border-medium)',
                    background: '#08080f',
                    borderRadius: '6px',
                    padding: '10px 14px'
                  }}
                >
                  <CreditCard size={16} color="var(--text-muted)" />
                  <input 
                    type="text" 
                    placeholder="•••• •••• •••• 4242" 
                    style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '13px', width: '100%' }}
                    readOnly
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Expiration</label>
                  <input type="text" placeholder="MM/YY" value="12/28" style={{ fontSize: '12px' }} readOnly />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CVC</label>
                  <input type="text" placeholder="123" value="•••" style={{ fontSize: '12px' }} readOnly />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmUpgrade}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
