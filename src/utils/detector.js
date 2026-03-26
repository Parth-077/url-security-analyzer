// URL Security Analyzer - Core Detection Logic

/**
 * Calculates entropy of a string (Shannon Entropy)
 * Higher entropy (approach 4+) often indicates random/generated strings (DGA)
 */
function calculateEntropy(str) {
  const characters = str.split('');
  const frequencies = characters.reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  const len = characters.length;
  return Object.values(frequencies).reduce((entropy, freq) => {
    const p = freq / len;
    return entropy - p * Math.log2(p);
  }, 0);
}

const REDIRECTORS = ['bit.ly', 't.co', 'tinyurl.com', 'is.gd', 'goo.gl', 'buff.ly', 'ow.ly'];
const HIGH_RISK_TLDS = [
  '.xyz', '.top', '.win', '.bid', '.gdn', '.loan', '.loan', '.download', 
  '.faith', '.repo', '.ga', '.cf', '.ml', '.tk', '.rocks', '.guru', '.space'
];

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'account', 'secure', 'update', 'banking', 
  'wallet', 'crypto', 'bonus', 'claim', 'award', 'goverment', 'aadhaar', 
  'pension', 'pib', 'nic-govt', 'my-gov'
];

const OFFICIAL_DOMAINS = [
  'gov.in', 'nic.in', 'india.gov.in', 'presidentofindia.nic.in', 'mod.gov.in', 
  'mha.gov.in', 'pib.gov.in', 'meity.gov.in', 'cashe.pib.gov.in' // Common false positives or trusted subdomains
];

export async function analyzeURL(urlInput) {
  try {
    let url = urlInput.trim();
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;

    let score = 0; // 0-100 (100 = Extremely Malicious)
    let indicators = [];

    // 1. TLD Analysis
    const tld = domain.substring(domain.lastIndexOf('.'));
    if (HIGH_RISK_TLDS.some(h => tld === h)) {
      score += 25;
      indicators.push({ text: `Untrustworthy TLD (${tld})`, risk: 'High' });
    }

    // 2. Official Domain Check (Indian Government Context)
    const isOfficial = OFFICIAL_DOMAINS.some(d => domain.endsWith(d));
    if (isOfficial) {
      score -= 50; // Reduce score for trusted sites
      indicators.push({ text: 'Trusted Domain', risk: 'Low' });
    } else if (SUSPICIOUS_KEYWORDS.some(k => domain.includes(k))) {
      // 3. Keyword Analysis (Especially if mimicking govt keywords but not on gov.in)
      score += 35;
      indicators.push({ text: `Suspicious Keywords in Domain`, risk: 'Medium' });
    }

    // 4. Entropy Analysis (DGA Check)
    const entropy = calculateEntropy(domain);
    if (entropy > 3.8) {
      score += 20;
      indicators.push({ text: 'High Entropy (Potential DGA/Machine-generated)', risk: 'Medium' });
    }

    // 5. Length Check
    if (domain.length > 50) {
      score += 15;
      indicators.push({ text: 'Abnormally Long Hostname', risk: 'Low' });
    }

    // 6. Subdomain Count
    const subdomains = domain.split('.').length;
    if (subdomains > 4) {
      score += 15;
      indicators.push({ text: 'Excessive Subdomains (URL Squatting/Obfuscation)', risk: 'Medium' });
    }

    // 7. Path Analysis
    if (SUSPICIOUS_KEYWORDS.some(k => path.toLowerCase().includes(k))) {
      score += 10;
      indicators.push({ text: 'Security-related Keywords in Path', risk: 'Low' });
    }

    // 8. IP Address Check
    const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain);
    if (isIP) {
      score += 40;
      indicators.push({ text: 'Direct IP Usage (Standard Phishing Indicator)', risk: 'High' });
    }

    // 9. Character Homographs (Simple check)
    const hasSpecialChars = /[^\w\.-]/.test(domain);
    if (hasSpecialChars) {
      score += 45;
      indicators.push({ text: 'IDN/Special Characters (Homograph Attack)', risk: 'High' });
    }

    // 10. Hyphen Count
    const hyphenCount = (domain.match(/-/g) || []).length;
    if (hyphenCount > 3) {
      score += 20;
      indicators.push({ text: 'Excessive Hyphens (Obfuscated Domain)', risk: 'Medium' });
    }

    // 11. Redirection Services
    if (REDIRECTORS.some(r => domain.includes(r))) {
      score += 30;
      indicators.push({ text: 'URL Redirection Service (Obscures Destination)', risk: 'Medium' });
    }

    // 12. Authority Impersonation
    if (!isOfficial && (/gov-india|india-gov|rashtra-pati|my-pib|govt-portal/).test(domain)) {
      score += 50;
      indicators.push({ text: 'Authority Impersonation Risk', risk: 'High' });
    }

    // Normalize score
    score = Math.min(100, Math.max(0, score));

    return {
      domain,
      score,
      riskLevel: score < 30 ? 'Safe' : score < 65 ? 'Suspicious' : 'Dangerous',
      indicators,
      lastChecked: new Date().toISOString(),
      metadata: {
        entropy: entropy.toFixed(2),
        subdomains,
        tl: tld
      }
    };

  } catch (error) {
    throw new Error('Invalid URL format');
  }
}
