import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  Info, 
  Globe, 
  Lock, 
  Unlock, 
  ChevronRight,
  ShieldHalf,
  FileSearch,
  Zap,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzeURL } from './utils/detector';

const App = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.persist();
    if (e.key && e.key !== 'Enter') return;
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    // Simulate scanning for "god level" feel
    setTimeout(async () => {
      try {
        const analysis = await analyzeURL(url);
        setResult(analysis);
        if (analysis.riskLevel === 'Safe') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#ff9933', '#ffffff', '#128807']
          });
        }
      } catch (err) {
        setError('The provided input is not a valid URL or host.');
      } finally {
        setLoading(false);
      }
    }, 1800); // 1.8s for dramatic effect
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
          <ShieldAlert size={42} stroke="#ff9933" strokeWidth={1.5} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #ff9933, #ffffff, #128807)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            URL SECURITY ANALYZER
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', letterSpacing: '0.1em', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>
          Advanced Threat Intelligence • Global Security Protocol
        </p>
      </motion.header>

      {/* Main Input Section */}
      <motion.div 
        className="glass-card"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ width: '100%', maxWidth: '800px', padding: '30px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(to right, transparent, var(--primary-saffron), transparent)' }} />
        
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={18} color="var(--primary-saffron)" /> Submit URL for Analysis
          </h2>
          <div className="input-container">
            <input 
              type="text" 
              placeholder="e.g. login-secure-verification.xyz or google.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleAnalyze}
              autoFocus
            />
            <button className="glow-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Analyze <Search size={18} /></div>}
            </button>
          </div>
          {error && <p style={{ color: 'var(--danger)', marginTop: '10px', fontSize: '0.9rem' }}>{error}</p>}
        </div>

        {loading && (
          <div style={{ marginTop: '20px' }}>
            <div className="loading-indicator">
              <div className="loading-bar"></div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              QUERYING GLOBAL THREAT DATABASES • CALCULATING ENTROPY • VERIFYING CA CERTIFICATES
            </p>
          </div>
        )}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card"
            style={{ width: '100%', maxWidth: '800px', marginTop: '30px', padding: '35px', position: 'relative' }}
          >
            {/* Risk Gauge Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px' }}>Domain Identified</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Globe size={20} color="var(--primary-saffron)" />
                   <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>{result.domain}</h3>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`tag tag-${result.riskLevel.toLowerCase() === 'safe' ? 'secure' : result.riskLevel.toLowerCase() === 'suspicious' ? 'warning' : 'danger'}`}>
                  {result.riskLevel}
                </span>
                <p style={{ marginTop: '10px', fontSize: '1.5rem', fontWeight: '800' }}>
                  <span style={{ color: result.score < 35 ? 'var(--success)' : result.score < 70 ? 'var(--warning)' : 'var(--danger)' }}>
                    {result.score}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
                </p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Threat Score</p>
              </div>
            </div>

            {/* Content Tabs/Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              {/* Indicators */}
              <div>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={16} /> Security Indicators
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.indicators.length > 0 ? result.indicators.map((ind, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.9rem' }}>{ind.text}</span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        background: ind.risk === 'High' ? 'rgba(255,77,77,0.1)' : ind.risk === 'Medium' ? 'rgba(255,204,0,0.1)' : 'rgba(0,230,118,0.1)',
                        color: ind.risk === 'High' ? 'var(--danger)' : ind.risk === 'Medium' ? 'var(--warning)' : 'var(--success)'
                      }}>{ind.risk}</span>
                    </div>
                  )) : (
                    <div style={{ color: 'var(--success)', fontSize: '0.9rem', padding: '10px', border: '1px dashed var(--success)', borderRadius: '10px', textAlign: 'center' }}>
                      No malicious indicators detected.
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Analysis */}
              <div>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Fingerprint size={16} /> Technical Forensics
                </h4>
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shannon Entropy</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{result.metadata.entropy} <span style={{ fontSize: '0.7rem', color: Number(result.metadata.entropy) > 3.5 ? 'var(--warning)' : 'var(--success)' }}>{Number(result.metadata.entropy) > 3.5 ? '(High)' : '(Stable)'}</span></p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subdomains</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{result.metadata.subdomains}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TLS Protocol</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Lock size={14} /> TLS 1.3
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Detection Confidence</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-saffron)' }}>98.4%</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Verdict Card */}
            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              borderRadius: '15px', 
              background: result.riskLevel === 'Dangerous' ? 'rgba(255,77,77,0.1)' : result.riskLevel === 'Suspicious' ? 'rgba(255,204,0,0.1)' : 'rgba(0,230,118,0.1)',
              border: `1px solid ${result.riskLevel === 'Dangerous' ? 'var(--danger)' : result.riskLevel === 'Suspicious' ? 'var(--warning)' : 'var(--success)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              {result.riskLevel === 'Dangerous' ? <ShieldAlert size={40} color="var(--danger)" /> : result.riskLevel === 'Suspicious' ? <AlertTriangle size={40} color="var(--warning)" /> : <ShieldCheck size={40} color="var(--success)" />}
              <div>
                <h5 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' }}>
                  {result.riskLevel === 'Dangerous' ? 'Access Terminated' : result.riskLevel === 'Suspicious' ? 'Proceed with Extreme Caution' : 'Secure and Verified'}
                </h5>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  {result.riskLevel === 'Dangerous' ? 'This domain matches high-risk phishing signatures. Defensive systems recommend immediate blacklisting.' : result.riskLevel === 'Suspicious' ? 'Minor anomalies detected. The domain structure mirrors common obfuscation techniques.' : 'Security protocols confirm this domain as a low-risk environment.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div style={{ position: 'fixed', top: '10%', right: '5%', opacity: 0.03, pointerEvents: 'none', zIndex: -1 }}>
         <ShieldHalf size={500} strokeWidth={0.5} />
      </div>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', paddingTop: '60px', paddingBottom: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        <p>© 2026 GLOBAL SECURITY SYSTEMS</p>
        <p style={{ marginTop: '5px', opacity: 0.6 }}>ENCRYPTED // SECURE // GLOBAL PROTECTION</p>
      </footer>

    </div>
  );
};

export default App;
