import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Sliders, Trash2 } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const MODELS = [
  { id: 'aether-llama-3-70b', name: 'Aether-Llama 3 (70B)', desc: 'General knowledge & creative writing', persona: 'creative' },
  { id: 'aether-gemini-1.5-pro', name: 'Aether-Gemini 1.5 Pro', desc: 'Complex reasoning & coding assistance', persona: 'analytical' },
  { id: 'aether-core-ultra', name: 'Aether-Core Ultra', desc: 'Fast, concise answers for simple tasks', persona: 'concise' }
];

export const Playground: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [systemPrompt, setSystemPrompt] = useState('You are AetherAI, a helpful, intelligent, and advanced AI assistant. Keep responses clear, professional, and insightful.');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.9);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: "Hello! I am AetherAI, running on the Aether-Llama 3 model. Feel free to ask me anything or tweak my generation parameters in the sidebar." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getMockAIResponse = (userMsg: string, modelId: string) => {
    const model = MODELS.find(m => m.id === modelId);
    const lowMsg = userMsg.toLowerCase();
    
    // Coding related
    if (lowMsg.includes('code') || lowMsg.includes('program') || lowMsg.includes('react') || lowMsg.includes('javascript')) {
      if (model?.persona === 'analytical') {
        return "```tsx\nimport React from 'react';\n\nexport const CustomComponent: React.FC = () => {\n  return (\n    <div className=\"glass-panel\" style={{ padding: '20px' }}>\n      <h3 style={{ color: 'var(--primary)' }}>Hello AetherAI!</h3>\n    </div>\n  );\n};\n```\nHere is a complete clean React TSX functional component. Note how we utilize glassmorphism styling variables in compliance with the premium Aether Design tokens. Let me know if you need helper hooks!";
      } else {
        return "Sure, here's a quick code snippet for a premium hover state:\n```css\n.glow-hover:hover {\n  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);\n  transform: translateY(-2px);\n}\n```\nApply this class to your buttons or card elements to instantly increase visual feedback!";
      }
    }
    
    // Math/Logic related
    if (lowMsg.includes('explain') || lowMsg.includes('why') || lowMsg.includes('what')) {
      if (model?.persona === 'analytical') {
        return "Analyzing this query logically:\n1. **Core Premise**: The parameter values (such as temperature = " + temperature + ") dictate the probability distribution of predicted tokens.\n2. **Mechanism**: Higher temperature results in a flatter probability curves (increased creativity/entropy).\n3. **Application**: With a Top-P threshold of " + topP + ", we restrict sampling to the top cumulative percentage, stabilizing coherence.\nLet me know if you want to run a detailed validation matrix!";
      } else if (model?.persona === 'creative') {
        return "Imagine a vast matrix of ideas floating in high-dimensional hyperspace. When you lower the temperature to " + temperature + ", you focus the AI's mind, tracing the most logical path. When you raise it, the model breaks free, wandering through rare clusters of words to craft poetic, unpredictable responses. Max tokens is set to " + maxTokens + ", giving us plenty of room to explore.";
      } else {
        return "Based on your request, here is the short breakdown:\n- Temperature dictates randomness. Current value: " + temperature + ".\n- Top-P limits choices. Current value: " + topP + ".\n- System configurations: Operational.";
      }
    }

    // Default conversational responses
    if (model?.persona === 'creative') {
      return "That's a fascinating perspective! Under this model configuration, I would synthesize this into a creative layout. By adjusting the system parameters, we can generate unique copywriting variations. What specific angle would you like to explore next?";
    } else if (model?.persona === 'analytical') {
      return "Under current constraints (Model: " + model.name + ", Temp: " + temperature + "), the analytical prediction yields a 94.6% confidence interval that optimization lies in standardizing interfaces. I recommend inspecting model fine-tuning settings for specific task automation.";
    } else {
      return "Aether-Core system operational. The query has been processed. Let me know if you require any specific API credentials or quota expansions.";
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate streaming after a short delay
    setTimeout(() => {
      const fullResponse = getMockAIResponse(userMessage.content, selectedModel);
      
      const assistantMessageId = Date.now() + 1;
      
      // Let's type it out character by character or word by word
      let currentLength = 0;
      const responseWords = fullResponse.split(' ');
      
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);
      
      const typingInterval = setInterval(() => {
        if (currentLength < responseWords.length) {
          const partialContent = responseWords.slice(0, currentLength + 1).join(' ');
          setMessages(prev => 
            prev.map(m => m.id === assistantMessageId ? { ...m, content: partialContent } : m)
          );
          currentLength += Math.ceil(Math.random() * 2 + 1); // add 1-3 words at a time
        } else {
          // Set full and finish
          setMessages(prev => 
            prev.map(m => m.id === assistantMessageId ? { ...m, content: fullResponse } : m)
          );
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 35);
    }, 600);
  };

  const handleClear = () => {
    setMessages([
      { id: Date.now(), role: 'assistant', content: "Playground thread reset. Let's start a new conversation." }
    ]);
  };

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '20px',
        height: 'calc(100vh - 120px)',
        alignItems: 'stretch',
        animation: 'fadeIn 0.4s ease-out'
      }}
      className="playground-container"
    >
      {/* Main Chat Area */}
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          padding: 0
        }}
      >
        {/* Chat Header */}
        <div 
          style={{
            padding: '15px 20px',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.01)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Interactive Playground Terminal</span>
          </div>
          <button 
            onClick={handleClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-light)',
              background: 'rgba(255,255,255,0.02)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--danger)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
          >
            <Trash2 size={13} style={{ color: 'var(--danger)' }} />
            Clear chat
          </button>
        </div>

        {/* Messages list */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div 
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                {!isUser && (
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#fff',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    AI
                  </div>
                )}
                
                <div 
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: isUser ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid',
                    borderColor: isUser ? 'transparent' : 'var(--border-medium)',
                    color: '#fff',
                    fontSize: '14px',
                    boxShadow: isUser ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {/* Basic Code block detection and highlight */}
                  {m.content.includes('```') ? (
                    <div>
                      {m.content.split('```').map((block, idx) => {
                        if (idx % 2 === 1) {
                          // code block
                          const codeLines = block.split('\n');
                          const code = codeLines.slice(1).join('\n');
                          return (
                            <pre 
                              key={idx}
                              style={{
                                background: '#08080f',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-medium)',
                                overflowX: 'auto',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                color: 'var(--secondary)',
                                margin: '10px 0'
                              }}
                            >
                              <code>{code}</code>
                            </pre>
                          );
                        }
                        return <span key={idx}>{block}</span>;
                      })}
                    </div>
                  ) : (
                    m.content
                  )}
                </div>

                {isUser && (
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#fff',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    ME
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#fff',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}
              >
                AI
              </div>
              <div 
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary)', borderRadius: '50%', animation: 'pulseGlow 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary)', borderRadius: '50%', animation: 'pulseGlow 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary)', borderRadius: '50%', animation: 'pulseGlow 1s infinite 0.4s' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input panel */}
        <div 
          style={{
            padding: '15px 20px',
            borderTop: '1px solid var(--border-medium)',
            background: 'rgba(255, 255, 255, 0.01)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <input 
            type="text" 
            placeholder="Type your message to test model responses..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-medium)',
              background: '#07070c'
            }}
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: inputValue.trim() && !isTyping ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: inputValue.trim() && !isTyping ? '#fff' : 'var(--text-muted)',
              cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: inputValue.trim() && !isTyping ? 'transparent' : 'var(--border-light)',
              boxShadow: inputValue.trim() && !isTyping ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Model Parameter Configurations panel */}
      <div 
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <Sliders size={16} color="var(--secondary)" />
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Hyperparameters</h3>
        </div>

        {/* Model Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Model Selection</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{ padding: '8px 12px' }}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {MODELS.find(m => m.id === selectedModel)?.desc}
          </span>
        </div>

        {/* System Prompt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>System Prompt</label>
          <textarea 
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            style={{ 
              resize: 'none', 
              fontSize: '12px', 
              padding: '10px',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.4'
            }}
          />
        </div>

        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Temperature */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Temperature</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>{temperature.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{
                accentColor: 'var(--primary)',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Max Tokens */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Max Tokens</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--secondary)', fontWeight: '600' }}>{maxTokens}</span>
            </div>
            <input 
              type="range" 
              min="256" 
              max="4096" 
              step="128"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              style={{
                accentColor: 'var(--secondary)',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Top P */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Top P</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: '600' }}>{topP.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              style={{
                accentColor: 'var(--accent)',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* Warning notification */}
        <div 
          style={{
            padding: '10px 12px',
            background: 'rgba(245, 158, 11, 0.03)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: '6px',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
            marginTop: 'auto'
          }}
        >
          <AlertCircle size={14} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Higher temperature values generate more creative but potentially less factually accurate text.
          </span>
        </div>
      </div>
    </div>
  );
};
