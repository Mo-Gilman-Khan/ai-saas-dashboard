import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Cpu, 
  Key, 
  CreditCard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed
}) => {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'playground', name: 'Model Playground', icon: Terminal },
    { id: 'finetuning', name: 'Fine-Tuning', icon: Cpu },
    { id: 'apikeys', name: 'API Keys', icon: Key },
    { id: 'billing', name: 'Billing & Quota', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const sidebarWidth = collapsed ? '72px' : '260px';

  return (
    <aside 
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        transition: 'width var(--transition-normal)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border-medium)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Header Logo */}
      <div 
        style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0' : '0 20px',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--primary-glow-strong)'
            }}
          >
            <Zap size={18} color="#fff" />
          </div>
          {!collapsed && (
            <span 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '0.05em',
                background: 'linear-gradient(135deg, #fff 40%, var(--primary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              AetherAI
            </span>
          )}
        </div>

        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            style={{
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-light)'
            }}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav 
        style={{
          flex: 1,
          padding: '20px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? '0' : '14px',
                padding: '12px',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                position: 'relative'
              }}
              title={collapsed ? item.name : undefined}
            >
              {/* Active side indicator */}
              {isActive && (
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    height: '50%',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    background: 'linear-gradient(to bottom, var(--primary), var(--accent))',
                    boxShadow: '0 0 10px var(--primary)'
                  }}
                />
              )}
              
              <IconComponent 
                size={20} 
                style={{
                  transition: 'color var(--transition-fast)',
                  color: isActive ? 'var(--primary)' : 'inherit'
                }}
              />
              
              {!collapsed && (
                <span 
                  style={{
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '400',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div 
        style={{
          padding: '20px 10px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'stretch',
          gap: '15px'
        }}
      >
        {collapsed ? (
          <button 
            onClick={() => setCollapsed(false)}
            style={{
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03), rgba(6, 182, 212, 0.03))',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Token Usage</span>
              <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>74.2%</span>
            </div>
            <div 
              style={{
                height: '4px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  height: '100%',
                  width: '74.2%',
                  background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                  borderRadius: '2px'
                }}
              />
            </div>
          </div>
        )}

        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff'
              }}
            >
              JD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>John Doe</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>john@aetherai.com</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
