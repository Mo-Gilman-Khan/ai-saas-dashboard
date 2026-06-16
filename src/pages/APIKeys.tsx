import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Check, Eye, EyeOff, Trash2, ShieldCheck } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  scope: 'full' | 'write' | 'read';
  status: 'active' | 'revoked';
  createdAt: string;
}

export const APIKeys: React.FC = () => {
  const [keyName, setKeyName] = useState('');
  const [keyScope, setKeyScope] = useState<'full' | 'write' | 'read'>('full');
  
  const [keys, setKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('aether_api_keys');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: '1',
        name: 'Production Server Main',
        key: 'ae_live_f84b9e28d1c0459ea7d83b4c10ef9231',
        scope: 'full',
        status: 'active',
        createdAt: '2026-06-12 11:20'
      },
      {
        id: '2',
        name: 'Documentation Embed Search',
        key: 'ae_live_9a2b8e38f1c0459a9c7d83b4c10ef9895',
        scope: 'read',
        status: 'active',
        createdAt: '2026-06-14 16:45'
      }
    ];
  });

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('aether_api_keys', JSON.stringify(keys));
  }, [keys]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    // Generate random hex key
    const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKeyStr = `ae_live_${hex}`;

    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(2, 9),
      name: keyName,
      key: newKeyStr,
      scope: keyScope,
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setKeys(prev => [newKey, ...prev]);
    setKeyName('');
  };

  const handleCopy = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleToggleVisible = (id: string) => {
    if (visibleKeyIds.includes(id)) {
      setVisibleKeyIds(prev => prev.filter(k => k !== id));
    } else {
      setVisibleKeyIds(prev => [...prev, id]);
    }
  };

  const handleRevoke = (id: string) => {
    if (confirm("Are you sure you want to revoke this API key? Applications using this key will immediately receive authentication errors.")) {
      setKeys(prev => 
        prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k)
      );
    }
  };

  const formatKey = (apiKey: ApiKey) => {
    const isVisible = visibleKeyIds.includes(apiKey.id);
    if (isVisible) return apiKey.key;
    
    // Mask key except prefix and last 4 characters
    const prefix = 'ae_live_';
    const rawVal = apiKey.key.replace(prefix, '');
    const masked = '•'.repeat(16);
    const suffix = rawVal.substring(rawVal.length - 4);
    return `${prefix}${masked}${suffix}`;
  };

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px',
        animation: 'fadeIn 0.4s ease-out'
      }}
    >
      {/* Alert banner */}
      <div 
        style={{
          padding: '16px 20px',
          background: 'rgba(139, 92, 246, 0.03)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}
      >
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}
        >
          <ShieldCheck size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Secure Key Vault</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            All keys are encrypted at rest. Never share your API secret tokens publicly. We recommend rotating production keys every 90 days.
          </p>
        </div>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '20px',
          alignItems: 'stretch'
        }}
        className="keys-grid-container"
      >
        {/* Key Generator Form */}
        <form 
          onSubmit={handleGenerate}
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Key size={16} color="var(--secondary)" />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Create Credentials</h3>
          </div>

          {/* Key Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Key Description Name</label>
            <input 
              type="text" 
              placeholder="e.g. Analytics Exporter" 
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              required
            />
          </div>

          {/* Scope selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Access Scope Permissions</label>
            <select 
              value={keyScope}
              onChange={(e) => setKeyScope(e.target.value as any)}
            >
              <option value="full">Full Access (Admin)</option>
              <option value="write">Read / Write</option>
              <option value="read">Read-only</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            <Plus size={14} />
            Generate Secret Key
          </button>
        </form>

        {/* Keys manager list */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Active Workspace Keys</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Credentials authorizing integrations with the AetherAI gateway endpoint</p>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Name</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Secret Token</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Scope</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Created At</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '10px', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => {
                  const isCopied = copiedKeyId === k.id;
                  const isVisible = visibleKeyIds.includes(k.id);
                  const isRevoked = k.status === 'revoked';

                  return (
                    <tr 
                      key={k.id}
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        opacity: isRevoked ? 0.45 : 1,
                        transition: 'opacity var(--transition-fast)'
                      }}
                    >
                      <td style={{ padding: '12px 10px', color: '#fff', fontWeight: '600' }}>
                        {k.name}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <code 
                            style={{ 
                              color: isRevoked ? 'var(--text-muted)' : 'var(--secondary)', 
                              fontSize: '12px', 
                              backgroundColor: 'rgba(0,0,0,0.25)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              letterSpacing: '0.02em',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            {formatKey(k)}
                          </code>
                          {!isRevoked && (
                            <button
                              onClick={() => handleToggleVisible(k.id)}
                              style={{
                                color: 'var(--text-secondary)',
                                padding: '4px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title={isVisible ? "Hide API Key" : "Reveal API Key"}
                            >
                              {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: 
                              k.scope === 'full' ? 'rgba(236,72,153,0.08)' : 
                              k.scope === 'write' ? 'rgba(139,92,246,0.08)' : 'rgba(6,182,212,0.08)',
                            color: 
                              k.scope === 'full' ? 'var(--accent)' : 
                              k.scope === 'write' ? 'var(--primary)' : 'var(--secondary)',
                            textTransform: 'capitalize'
                          }}
                        >
                          {k.scope} Access
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>
                        {k.createdAt}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: isRevoked ? 'var(--danger-glow)' : 'var(--success-glow)',
                            color: isRevoked ? 'var(--danger)' : 'var(--success)',
                            textTransform: 'capitalize'
                          }}
                        >
                          {k.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {!isRevoked && (
                            <button
                              onClick={() => handleCopy(k.id, k.key)}
                              style={{
                                color: isCopied ? 'var(--success)' : 'var(--text-secondary)',
                                border: '1px solid var(--border-light)',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all var(--transition-fast)',
                                fontSize: '11px'
                              }}
                              onMouseEnter={(e) => !isCopied && (e.currentTarget.style.borderColor = 'var(--primary)')}
                              onMouseLeave={(e) => !isCopied && (e.currentTarget.style.borderColor = 'var(--border-light)')}
                            >
                              {isCopied ? <Check size={12} /> : <Copy size={12} />}
                              {isCopied ? 'Copied' : 'Copy'}
                            </button>
                          )}
                          {!isRevoked && (
                            <button
                              onClick={() => handleRevoke(k.id)}
                              style={{
                                color: 'var(--text-muted)',
                                border: '1px solid var(--border-light)',
                                padding: '6px',
                                borderRadius: '4px',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all var(--transition-fast)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--danger)';
                                e.currentTarget.style.borderColor = 'var(--danger)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.borderColor = 'var(--border-light)';
                              }}
                              title="Revoke Key"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
