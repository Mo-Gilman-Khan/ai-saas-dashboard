import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Webhook, Palette, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [orgName, setOrgName] = useState('AetherLabs Dev');
  const [billingEmail, setBillingEmail] = useState('billing@aetherai.com');
  const [webhookUrl, setWebhookUrl] = useState('https://api.aetherlabs.dev/v1/webhook');
  
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [keyRotation, setKeyRotation] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');
  
  const [activeTheme, setActiveTheme] = useState('purple');

  const themes = [
    { id: 'purple', name: 'Imperial Violet', h: 263, s: '90%', l: '62%' },
    { id: 'cyan', name: 'Cyberpunk Cyan', h: 187, s: '92%', l: '45%' },
    { id: 'emerald', name: 'Emerald Oasis', h: 150, s: '84%', l: '43%' },
    { id: 'pink', name: 'Vibrant Magenta', h: 327, s: '90%', l: '58%' }
  ];

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty('--primary-h', theme.h.toString());
      document.documentElement.style.setProperty('--primary-s', theme.s);
      document.documentElement.style.setProperty('--primary-l', theme.l);
    }
  };

  const handleSave = () => {
    alert("Settings saved successfully! Custom configurations persisted in workspace registry.");
  };

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        alignItems: 'stretch',
        animation: 'fadeIn 0.4s ease-out'
      }}
      className="settings-grid"
    >
      
      {/* Column 1: Organization Settings & Webhook */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Profile Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <SettingsIcon size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Organization Profile</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Organization Name</label>
              <input 
                type="text" 
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Primary Billing Contact</label>
              <input 
                type="email" 
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Region Instance</label>
              <select style={{ padding: '8px 12px' }} defaultValue="us-east">
                <option value="us-east">US East (N. Virginia)</option>
                <option value="eu-west">EU West (Frankfurt)</option>
                <option value="ap-south">AP South (Mumbai)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Webhooks config */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Webhook size={16} color="var(--secondary)" />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Webhooks Dispatcher</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Webhook Endpoint URL</label>
              <input 
                type="url" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/webhooks"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Secret Signing Signature</label>
              <input 
                type="text" 
                value="whsec_f84b9e28d1c0459ea7d83b4c10ef9231" 
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }} 
                readOnly 
              />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Webhooks trigger POST requests when training status completes, or quota thresholds are breached.
            </span>
          </div>
        </div>

      </div>

      {/* Column 2: Security & Theme Preset Configurations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Security policies */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Shield size={16} color="var(--accent)" />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Security Gateways</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* MFA toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>Require Multi-Factor Auth</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Secure team dashboard access logins</span>
              </div>
              <input 
                type="checkbox" 
                checked={mfaEnabled} 
                onChange={(e) => setMfaEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Rotation toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>Enforce 90-Day Key Rotation</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Automatically expire inactive keys</span>
              </div>
              <input 
                type="checkbox" 
                checked={keyRotation} 
                onChange={(e) => setKeyRotation(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* IP Whitelist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>IP Access Whitelist</label>
              <input 
                type="text" 
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="e.g. 192.168.1.1, 10.0.0.0/24"
              />
            </div>
          </div>
        </div>

        {/* Theme customization */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Palette size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Dashboard Color Accent</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Select your primary HSL accent to tint key states, glow borders, and gradients.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {themes.map((theme) => {
                const isActive = activeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isActive ? `hsl(${theme.h}, ${theme.s}, ${theme.l})` : 'var(--border-medium)',
                      background: isActive ? `hsla(${theme.h}, ${theme.s}, ${theme.l}, 0.08)` : 'rgba(255,255,255,0.01)',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div 
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: `hsl(${theme.h}, ${theme.s}, ${theme.l})`,
                        boxShadow: isActive ? `0 0 10px hsl(${theme.h}, ${theme.s}, ${theme.l})` : 'none'
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: isActive ? '600' : '400' }}>{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <button 
          onClick={handleSave}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', gap: '10px', fontSize: '14px' }}
        >
          <Save size={16} />
          Save Configurations
        </button>

      </div>

    </div>
  );
};
