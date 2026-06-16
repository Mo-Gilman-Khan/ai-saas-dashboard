import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Cpu, 
  Activity, 
  Layers, 
  DollarSign, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<any>;
  color: string;
  chartData: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon, 
  color, 
  chartData 
}) => {
  return (
    <div 
      className="glass-panel"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>{title}</span>
        <div 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: `rgba(${color}, 0.1)`,
            border: `1px solid rgba(${color}, 0.25)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: `rgb(${color})`
          }}
        >
          <Icon size={16} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-heading)', color: '#fff' }}>{value}</span>
        <span 
          style={{
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            color: isPositive ? 'var(--success)' : 'var(--danger)'
          }}
        >
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </div>

      {/* Mini Trend Line (Sparkline SVG) */}
      <div style={{ height: '40px', width: '100%', marginTop: '5px' }}>
        <svg viewBox="0 0 100 40" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(${color})`} stopOpacity="0.3" />
              <stop offset="100%" stopColor={`rgb(${color})`} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={`M ${chartData.map((val, idx) => `${(idx / (chartData.length - 1)) * 100} ${40 - (val / 100) * 35}`).join(' L ')}`}
            fill="none"
            stroke={`rgb(${color})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M 0 40 L ${chartData.map((val, idx) => `${(idx / (chartData.length - 1)) * 100} ${40 - (val / 100) * 35}`).join(' L ')} L 100 40 Z`}
            fill={`url(#grad-${title.replace(/\s+/g, '')})`}
          />
        </svg>
      </div>
    </div>
  );
};

export const Overview: React.FC = () => {
  // Main Usage Chart State (for hover tooltip)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const mainChartData = [
    { label: '06/10', val: 120, cost: 2.4 },
    { label: '06/11', val: 180, cost: 3.6 },
    { label: '06/12', val: 150, cost: 3.0 },
    { label: '06/13', val: 240, cost: 4.8 },
    { label: '06/14', val: 320, cost: 6.4 },
    { label: '06/15', val: 280, cost: 5.6 },
    { label: '06/16', val: 410, cost: 8.2 },
  ];

  const chartHeight = 180;
  const chartWidth = 500;
  
  // Calculate SVG Coordinates for Area Chart
  const points = mainChartData.map((d, i) => {
    const x = (i / (mainChartData.length - 1)) * chartWidth;
    // scale max val (450) to chart height
    const y = chartHeight - (d.val / 450) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const areaD = `M 0 ${chartHeight} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartWidth} ${chartHeight} Z`;

  const recentActivities = [
    { id: 1, type: 'API', desc: 'inference.chat.completion called by key: "Prod-API-Key"', time: '2 mins ago', model: 'aether-llama-3-70b' },
    { id: 2, type: 'FINETUNE', desc: 'Job aether-llama-v2 finished (Epoch 5/5)', time: '12 mins ago', model: 'aether-llama-v2' },
    { id: 3, type: 'KEY', desc: 'New API Key "Dev-Sandbox" was generated', time: '1 hour ago', model: 'N/A' },
    { id: 4, type: 'BILLING', desc: 'Automatic payment processed successfully', time: '5 hours ago', model: 'N/A' },
    { id: 5, type: 'API', desc: 'inference.embeddings.create called by key: "Embed-Indexer"', time: '6 hours ago', model: 'aether-embed-v1' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Metric Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}
      >
        <MetricCard
          title="Tokens Consumed"
          value="1,482,904"
          change="+18.2%"
          isPositive={true}
          icon={Layers}
          color="139, 92, 246" // Purple primary
          chartData={[30, 45, 35, 60, 80, 70, 95]}
        />
        <MetricCard
          title="Avg Latency"
          value="142 ms"
          change="-8.4%"
          isPositive={true} // Lower latency is positive
          icon={Activity}
          color="6, 182, 212" // Cyan secondary
          chartData={[75, 65, 80, 50, 45, 55, 40]}
        />
        <MetricCard
          title="Active Models"
          value="6 / 8"
          change="+1 new"
          isPositive={true}
          icon={Cpu}
          color="236, 72, 153" // Pink accent
          chartData={[50, 50, 60, 60, 60, 80, 80]}
        />
        <MetricCard
          title="Accumulated Cost"
          value="$156.40"
          change="+12.5%"
          isPositive={false}
          icon={DollarSign}
          color="16, 185, 129" // Green success
          chartData={[20, 25, 40, 55, 70, 85, 95]}
        />
      </div>

      {/* Charts Panel */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          alignItems: 'stretch'
        }}
        className="charts-container"
      >
        {/* Token Usage Line Chart */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Token Usage Over Time</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Daily token expenditure with breakdown metrics</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-primary">
                <TrendingUp size={12} />
                +34% vs last week
              </span>
            </div>
          </div>

          {/* Interactive SVG Area Chart */}
          <div 
            style={{ 
              position: 'relative', 
              height: '200px', 
              width: '100%', 
              marginTop: '10px'
            }}
          >
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              width="100%" 
              height="100%" 
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Area Gradient */}
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
                {/* Line Grid Pattern */}
                <pattern id="grid" width="100" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 0 30 L 100 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />

              {/* Y Axis Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((val, idx) => (
                <line 
                  key={idx}
                  x1={0} 
                  y1={chartHeight * (1 - val)} 
                  x2={chartWidth} 
                  y2={chartHeight * (1 - val)} 
                  stroke="rgba(255,255,255,0.04)" 
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area path */}
              <path d={areaD} fill="url(#chartGlow)" />

              {/* Line path */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
                }}
              />

              {/* Interactive Hover Vertical Bar */}
              {hoveredIndex !== null && (
                <line
                  x1={points[hoveredIndex].x}
                  y1={0}
                  x2={points[hoveredIndex].x}
                  y2={chartHeight}
                  stroke="rgba(139, 92, 246, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              {/* Nodes and Hover Triggers */}
              {points.map((p, idx) => (
                <g key={idx}>
                  {/* Circle Node */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIndex === idx ? 6 : 4}
                    fill={hoveredIndex === idx ? '#fff' : 'var(--bg-dark)'}
                    stroke="var(--primary)"
                    strokeWidth={hoveredIndex === idx ? 3 : 2}
                    style={{ transition: 'all 0.1s ease' }}
                  />
                  {/* Invisible Hover Area */}
                  <rect
                    x={idx === 0 ? 0 : p.x - (chartWidth / (points.length - 1)) / 2}
                    y={0}
                    width={chartWidth / (points.length - 1)}
                    height={chartHeight}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              ))}
            </svg>
            
            {/* Dynamic HTML Tooltip inside React */}
            {hoveredIndex !== null && (
              <div 
                style={{
                  position: 'absolute',
                  left: `${(points[hoveredIndex].x / chartWidth) * 92}%`,
                  top: `${Math.max(10, (points[hoveredIndex].y / chartHeight) * 100 - 55)}%`,
                  background: 'rgba(10, 10, 18, 0.95)',
                  border: '1px solid var(--primary)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  boxShadow: 'var(--shadow-md)',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: '100px',
                  zIndex: 10,
                  transform: 'translateX(-40%)',
                  animation: 'fadeIn 0.1s forwards'
                }}
              >
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'bold' }}>{points[hoveredIndex].label}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{points[hoveredIndex].val}k tokens</span>
                <span style={{ fontSize: '11px', color: 'var(--success)' }}>Cost: ${points[hoveredIndex].cost.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* X Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px', marginTop: '5px' }}>
            {mainChartData.map((d, i) => (
              <span key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
                {d.label}
              </span>
            ))}
          </div>
        </div>

        {/* Model Distribution Donut Chart */}
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
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Model Split</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Resource allocation per model family</p>
          </div>

          {/* SVG Donut */}
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* background circle */}
              <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="14" />
              {/* Llama - 45% (dasharray: 45 * 2 * pi * r / 100 = 127.2. Total circumference: 282.7) */}
              <circle cx="60" cy="60" r="45" fill="none" stroke="var(--primary)" strokeWidth="14" 
                strokeDasharray="127.2 282.7" 
                strokeDashoffset="0" 
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              {/* Gemini - 35% (dasharray: 98.9) */}
              <circle cx="60" cy="60" r="45" fill="none" stroke="var(--secondary)" strokeWidth="14" 
                strokeDasharray="98.9 282.7" 
                strokeDashoffset="-127.2" 
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              {/* Custom - 20% (dasharray: 56.5) */}
              <circle cx="60" cy="60" r="45" fill="none" stroke="var(--accent)" strokeWidth="14" 
                strokeDasharray="56.5 282.7" 
                strokeDashoffset="-226.1" 
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>3</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Families</span>
            </div>
          </div>

          {/* Labels & Percentages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Aether-Llama</span>
              </div>
              <span style={{ fontWeight: '600', color: '#fff' }}>45%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Aether-Gemini</span>
              </div>
              <span style={{ fontWeight: '600', color: '#fff' }}>35%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Aether-Core</span>
              </div>
              <span style={{ fontWeight: '600', color: '#fff' }}>20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div 
        className="glass-panel"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Recent Activity Feed</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Live system log of workspace execution processes</p>
          </div>
          <button 
            style={{ 
              fontSize: '13px', 
              color: 'var(--primary)', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View audit logs
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Activity List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {recentActivities.map((act) => (
            <div 
              key={act.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 140px 100px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-light)',
                fontSize: '13px',
                alignItems: 'center',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.015)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* Type Badge */}
              <div>
                <span 
                  className="badge" 
                  style={{
                    backgroundColor: 
                      act.type === 'API' ? 'var(--primary-glow)' : 
                      act.type === 'FINETUNE' ? 'var(--secondary-glow)' : 
                      act.type === 'KEY' ? 'var(--accent-glow)' : 'var(--success-glow)',
                    color: 
                      act.type === 'API' ? 'var(--primary)' : 
                      act.type === 'FINETUNE' ? 'var(--secondary)' : 
                      act.type === 'KEY' ? 'var(--accent)' : 'var(--success)',
                    border: '1px solid transparent',
                    borderColor: 
                      act.type === 'API' ? 'rgba(139, 92, 246, 0.2)' : 
                      act.type === 'FINETUNE' ? 'rgba(6, 182, 212, 0.2)' : 
                      act.type === 'KEY' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  }}
                >
                  {act.type}
                </span>
              </div>
              {/* Description */}
              <div style={{ color: '#fff', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '15px' }}>
                {act.desc}
              </div>
              {/* Model info */}
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                {act.model}
              </div>
              {/* Time */}
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'right' }}>
                {act.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
