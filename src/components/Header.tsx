import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  ShieldAlert, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const getTitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'System Overview';
      case 'playground':
        return 'Model Playground';
      case 'finetuning':
        return 'Model Fine-Tuning';
      case 'apikeys':
        return 'API Keys Credentials';
      case 'billing':
        return 'Billing & Quota Settings';
      case 'settings':
        return 'Workspace Settings';
      default:
        return 'Dashboard';
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Fine-tuning Complete',
      desc: 'Model aether-llama-v2 finished training.',
      type: 'success',
      time: '12m ago'
    },
    {
      id: 2,
      title: 'Quota Warning',
      desc: 'Token consumption is at 74.2% of limit.',
      type: 'warning',
      time: '2h ago'
    },
    {
      id: 3,
      title: 'New API Key Created',
      desc: 'API Key "Prod Server 1" was generated.',
      type: 'info',
      time: '1d ago'
    }
  ];

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border-medium)',
        background: 'rgba(9, 9, 14, 0.4)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Title / Tab Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h1 
          style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #ffffff, var(--text-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.01em'
          }}
        >
          {getTitle()}
        </h1>
        
        {/* Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span 
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--success)',
              boxShadow: '0 0 8px var(--success)'
            }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* API Latency indicator */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-light)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}
        >
          <Sparkles size={12} style={{ color: 'var(--primary)' }} />
          <span>Avg Latency:</span>
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>142ms</span>
        </div>

        {/* Search bar */}
        <div 
          style={{
            position: 'relative',
            width: '200px',
            display: 'none', // Hide on mobile/tablet if screen size gets small
          }}
          className="search-container"
        >
          <Search 
            size={14} 
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input 
            type="text" 
            placeholder="Search dashboard..."
            style={{
              padding: '6px 10px 6px 30px',
              fontSize: '12px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-light)'
            }}
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              color: showNotifications ? '#fff' : 'var(--text-secondary)',
              padding: '8px',
              borderRadius: '8px',
              background: showNotifications ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: showNotifications ? 'var(--border-medium)' : 'transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Bell size={18} />
            {/* Notification unread badge */}
            <span 
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '6px',
                height: '6px',
                background: 'var(--accent)',
                borderRadius: '50%',
                boxShadow: '0 0 6px var(--accent)'
              }}
            />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 99
                }}
                onClick={() => setShowNotifications(false)}
              />
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '45px',
                  width: '320px',
                  background: 'rgba(12, 12, 20, 0.95)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  overflow: 'hidden',
                  animation: 'fadeIn var(--transition-fast) forwards'
                }}
              >
                <div 
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>Notifications</span>
                  <button 
                    onClick={() => {}}
                    style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '500' }}
                  >
                    Mark all read
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ marginTop: '2px' }}>
                        {n.type === 'success' && <CheckCircle2 size={16} color="var(--success)" />}
                        {n.type === 'warning' && <ShieldAlert size={16} color="var(--warning)" />}
                        {n.type === 'info' && <Info size={16} color="var(--primary)" />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{n.title}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{n.desc}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Workspace select */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-light)',
            borderRadius: '6px',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
        >
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#fff' }}>Production Workspace</span>
          <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>
    </header>
  );
};
