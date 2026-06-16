import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { Playground } from './pages/Playground';
import { FineTuning } from './pages/FineTuning';
import { APIKeys } from './pages/APIKeys';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';

function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActivePage = () => {
    switch (currentTab) {
      case 'overview':
        return <Overview />;
      case 'playground':
        return <Playground />;
      case 'finetuning':
        return <FineTuning />;
      case 'apikeys':
        return <APIKeys />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-primary)',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Workspace Frame */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // prevents flex item overflow
          height: '100vh',
          position: 'relative'
        }}
      >
        {/* Global Toolbar Header */}
        <Header currentTab={currentTab} />

        {/* Scrollable Viewport Container */}
        <main 
          style={{
            flex: 1,
            padding: '30px',
            overflowY: 'auto',
            background: 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03), transparent 50%), radial-gradient(circle at 10% 80%, rgba(6, 182, 212, 0.03), transparent 50%)'
          }}
        >
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export default App;
