import React, { useState, useEffect } from 'react';
import { Play, Cpu, Upload, Loader2, CheckCircle2, Flame } from 'lucide-react';

interface FineTuneJob {
  id: string;
  name: string;
  baseModel: string;
  dataset: string;
  epochs: number;
  learningRate: string;
  progress: number;
  status: 'queued' | 'training' | 'completed' | 'failed';
  lossHistory: number[];
  createdAt: string;
}

export const FineTuning: React.FC = () => {
  const [jobName, setJobName] = useState('');
  const [baseModel, setBaseModel] = useState('aether-llama-3-8b');
  const [datasetName, setDatasetName] = useState('');
  const [epochs, setEpochs] = useState(5);
  const [learningRate, setLearningRate] = useState('2e-5');
  const [batchSize, setBatchSize] = useState('16');
  
  const [jobs, setJobs] = useState<FineTuneJob[]>(() => {
    const saved = localStorage.getItem('aether_finetune_jobs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'FT-98402',
        name: 'customer-support-agent',
        baseModel: 'Aether-Llama 3 (8B)',
        dataset: 'support_dialogue_v3.json',
        epochs: 5,
        learningRate: '2e-5',
        progress: 100,
        status: 'completed',
        lossHistory: [1.2, 0.95, 0.72, 0.54, 0.38],
        createdAt: '2026-06-15 14:32'
      },
      {
        id: 'FT-98115',
        name: 'medical-terminology-helper',
        baseModel: 'Aether-Llama 3 (70B)',
        dataset: 'clinical_notes_20k.json',
        epochs: 3,
        learningRate: '5e-5',
        progress: 100,
        status: 'completed',
        lossHistory: [1.8, 1.34, 0.89],
        createdAt: '2026-06-14 09:15'
      }
    ];
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    jobs.length > 0 ? jobs[0].id : null
  );

  // Save jobs to localstorage
  useEffect(() => {
    localStorage.setItem('aether_finetune_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Simulate active job training loop
  useEffect(() => {
    const activeJobs = jobs.filter(j => j.status === 'queued' || j.status === 'training');
    if (activeJobs.length === 0) return;

    const timer = setInterval(() => {
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.status === 'queued') {
            return { ...job, status: 'training', progress: 1 };
          }
          if (job.status === 'training') {
            const nextProgress = job.progress + Math.ceil(Math.random() * 8 + 4);
            if (nextProgress >= 100) {
              // Complete job
              const finalLoss = 0.2 + Math.random() * 0.2;
              const lossSteps = Array.from({ length: job.epochs }, (_, i) => {
                const step = i + 1;
                const baseLoss = 1.5;
                const drop = (baseLoss - finalLoss) * (step / job.epochs);
                return parseFloat((baseLoss - drop + (Math.random() * 0.1 - 0.05)).toFixed(2));
              });
              return { 
                ...job, 
                progress: 100, 
                status: 'completed',
                lossHistory: lossSteps
              };
            } else {
              // Update progress and intermediate loss curve
              const currentEpochFloat = (nextProgress / 100) * job.epochs;
              const currentEpochInt = Math.ceil(currentEpochFloat);
              const interimLossHistory = Array.from({ length: currentEpochInt }, (_, i) => {
                const baseLoss = 1.6;
                const decay = 0.35;
                return parseFloat((baseLoss * Math.exp(-decay * i) + (Math.random() * 0.1 - 0.05)).toFixed(2));
              });
              return { 
                ...job, 
                progress: nextProgress,
                lossHistory: interimLossHistory
              };
            }
          }
          return job;
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, [jobs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName.trim() || !datasetName.trim()) return;

    const modelLabel = 
      baseModel === 'aether-llama-3-8b' ? 'Aether-Llama 3 (8B)' : 
      baseModel === 'aether-llama-3-70b' ? 'Aether-Llama 3 (70B)' : 'Aether-Embed (v1)';

    const newJob: FineTuneJob = {
      id: `FT-${Math.floor(10000 + Math.random() * 90000)}`,
      name: jobName.toLowerCase().replace(/\s+/g, '-'),
      baseModel: modelLabel,
      dataset: datasetName,
      epochs,
      learningRate,
      progress: 0,
      status: 'queued',
      lossHistory: [1.6],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setJobs(prev => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    setJobName('');
    setDatasetName('');
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // SVG dimensions for Loss Curve
  const svgWidth = 400;
  const svgHeight = 160;

  // Function to build SVG path for loss curve
  const getLossCurvePath = (history: number[] | undefined) => {
    if (!history || history.length === 0) return '';
    const maxLoss = 2.0; // scale limit
    const pts = history.map((loss, idx) => {
      const x = (idx / (history.length - 1 || 1)) * (svgWidth - 20) + 10;
      const y = svgHeight - (loss / maxLoss) * (svgHeight - 30) - 15;
      return { x, y };
    });

    if (pts.length === 1) {
      return `M ${pts[0].x} ${pts[0].y} L ${pts[0].x + 1} ${pts[0].y}`;
    }
    
    return `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  };

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '20px',
        alignItems: 'stretch',
        animation: 'fadeIn 0.4s ease-out'
      }}
      className="finetuning-container"
    >
      {/* Parameters submission form */}
      <form 
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <Cpu size={16} color="var(--primary)" />
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Configure Fine-Tuning</h3>
        </div>

        {/* Job Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Job Identifier</label>
          <input 
            type="text" 
            placeholder="e.g. sentiment-classifier" 
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            required
          />
        </div>

        {/* Base Model */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Base Foundation Model</label>
          <select 
            value={baseModel} 
            onChange={(e) => setBaseModel(e.target.value)}
          >
            <option value="aether-llama-3-8b">Aether-Llama 3 (8B)</option>
            <option value="aether-llama-3-70b">Aether-Llama 3 (70B)</option>
            <option value="aether-embed-v1">Aether-Embed (v1)</option>
          </select>
        </div>

        {/* Training Dataset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Dataset File (.jsonl)</label>
          <div style={{ position: 'relative' }}>
            <Upload 
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
              placeholder="e.g. train_dataset.json" 
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              style={{ paddingLeft: '30px' }}
              required
            />
          </div>
        </div>

        {/* Epochs & Learning rate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Epochs</label>
            <select 
              value={epochs} 
              onChange={(e) => setEpochs(parseInt(e.target.value))}
            >
              {[3, 5, 8, 10].map(ep => (
                <option key={ep} value={ep}>{ep}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Learning Rate</label>
            <select 
              value={learningRate} 
              onChange={(e) => setLearningRate(e.target.value)}
            >
              <option value="1e-5">1e-5</option>
              <option value="2e-5">2e-5</option>
              <option value="5e-5">5e-5</option>
            </select>
          </div>
        </div>

        {/* Batch Size */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Per Device Batch Size</label>
          <select 
            value={batchSize} 
            onChange={(e) => setBatchSize(e.target.value)}
          >
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="32">32</option>
          </select>
        </div>

        {/* Run Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '10px' }}
        >
          <Play size={14} fill="#fff" />
          Initialize Tuning
        </button>
      </form>

      {/* Main Monitoring Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Top Active Monitor */}
        {selectedJob && (
          <div 
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '30px'
            }}
          >
            {/* Status & Stats info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{selectedJob.id}</span>
                  <span 
                    className="badge"
                    style={{
                      backgroundColor: 
                        selectedJob.status === 'completed' ? 'var(--success-glow)' : 
                        selectedJob.status === 'training' ? 'var(--primary-glow)' : 
                        selectedJob.status === 'queued' ? 'var(--warning-glow)' : 'var(--danger-glow)',
                      color: 
                        selectedJob.status === 'completed' ? 'var(--success)' : 
                        selectedJob.status === 'training' ? 'var(--primary)' : 
                        selectedJob.status === 'queued' ? 'var(--warning)' : 'var(--danger)',
                    }}
                  >
                    {selectedJob.status.toUpperCase()}
                  </span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  {selectedJob.name}
                </h2>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Epoch Progress</span>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{selectedJob.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${selectedJob.progress}%`, 
                      background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
              </div>

              {/* Grid details */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  background: 'rgba(0,0,0,0.15)',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontSize: '12px'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Foundation Model:</span>
                  <div style={{ color: '#fff', fontWeight: '500', marginTop: '2px' }}>{selectedJob.baseModel}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Dataset:</span>
                  <div style={{ color: '#fff', fontWeight: '500', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedJob.dataset}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Learning Rate:</span>
                  <div style={{ color: '#fff', fontWeight: '500', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{selectedJob.learningRate}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Epochs Target:</span>
                  <div style={{ color: '#fff', fontWeight: '500', marginTop: '2px' }}>{selectedJob.epochs}</div>
                </div>
              </div>
            </div>

            {/* Live Training Loss Graph */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={14} color="var(--accent)" />
                  Loss Curve Convergence
                </span>
                {selectedJob.lossHistory.length > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                    Loss: {selectedJob.lossHistory[selectedJob.lossHistory.length - 1]}
                  </span>
                )}
              </div>

              <div 
                style={{ 
                  flex: 1, 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid var(--border-medium)', 
                  borderRadius: '8px', 
                  position: 'relative',
                  height: `${svgHeight}px`
                }}
              >
                {selectedJob.lossHistory.length > 0 ? (
                  <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                    {/* Y-axis helper lines */}
                    {[0.25, 0.5, 0.75].map((val, idx) => (
                      <line 
                        key={idx}
                        x1="10" 
                        y1={svgHeight * val} 
                        x2={svgWidth - 10} 
                        y2={svgHeight * val} 
                        stroke="rgba(255,255,255,0.03)" 
                        strokeDasharray="2 2"
                      />
                    ))}
                    {/* Path */}
                    <path
                      d={getLossCurvePath(selectedJob.lossHistory)}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: 'd 0.3s ease' }}
                    />
                    {/* Points */}
                    {selectedJob.lossHistory.map((loss, idx) => {
                      const x = (idx / (selectedJob.lossHistory.length - 1 || 1)) * (svgWidth - 20) + 10;
                      const y = svgHeight - (loss / 2.0) * (svgHeight - 30) - 15;
                      return (
                        <circle 
                          key={idx} 
                          cx={x} 
                          cy={y} 
                          r="3" 
                          fill="var(--accent)" 
                          stroke="rgba(236,72,153,0.3)" 
                          strokeWidth="3" 
                        />
                      );
                    })}
                  </svg>
                ) : (
                  <div className="flex-center" style={{ height: '100%', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Awaiting loss measurements...
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', padding: '0 5px' }}>
                <span>Epoch 0</span>
                <span>Epoch {selectedJob.epochs}</span>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List Queue Table */}
        <div 
          className="glass-panel"
          style={{
            padding: '20px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Fine-Tuning Queue</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Job ID</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Name</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Base Model</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Dataset</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Created At</th>
                  <th style={{ padding: '10px', fontWeight: '500' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const isSelected = selectedJobId === job.id;
                  return (
                    <tr 
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(139, 92, 246, 0.04)' : 'transparent',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)')}
                      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 10px', color: isSelected ? 'var(--primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {job.id}
                      </td>
                      <td style={{ padding: '12px 10px', color: '#fff', fontWeight: '600' }}>
                        {job.name}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                        {job.baseModel}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                        {job.dataset}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>
                        {job.createdAt}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {job.status === 'training' && <Loader2 size={12} className="spin" style={{ color: 'var(--primary)', animation: 'spin 2s linear infinite' }} />}
                          {job.status === 'completed' && <CheckCircle2 size={12} color="var(--success)" />}
                          {job.status === 'queued' && <Loader2 size={12} style={{ color: 'var(--warning)' }} />}
                          <span 
                            style={{
                              color: 
                                job.status === 'completed' ? 'var(--success)' : 
                                job.status === 'training' ? 'var(--primary)' : 'var(--warning)',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}
                          >
                            {job.status === 'training' ? `Training (${job.progress}%)` : job.status}
                          </span>
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
      
      {/* Dynamic Keyframes inject in styles block for spin */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};
