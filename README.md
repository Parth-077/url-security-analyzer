# 🛡️ URL Security Analyzer: Advanced Threat Oracle

**URL SECURITY ANALYZER** is a next-generation cyber-defense infrastructure designed for advanced threat detection. It employs heuristic analysis, shannon entropy calculations, and TLD reputation scoring to detect advanced phishing threats and URL-based obfuscation.

## 🚀 Key Features
- **Heuristic Threat Engine**: Analyzes URLs across 12+ threat vectors.
- **DGA Detection**: Shannon entropy calculation to detect machine-generated domains.
- **Sovereign Context**: Specialized detection for government-mimicry and unauthorized official keyword usage.
- **Premium Interface**: Glassmorphic, state-of-the-art UI with high-performance animations.
- **Offline Capable**: Core detection logic runs local to the edge for maximum privacy.

## 🛠️ Tech Stack
- **Reactor Engine**: Vite + React
- **Defensive Logic**: Vanilla JavaScript (Shannon Entropy + Heuristics)
- **Styling**: Vanilla CSS (Custom Glassmorphism)
- **Runtime**: WebAssembly (Wasmer Edge)

## 📦 Deployment to Wasmer

This project is pre-configured for **Wasmer Edge**.

### 1. Build the Artifacts
Ensure you have the production-ready static assets:
```bash
npm install
npm run build
```

### 2. Deploy to Wasmer Cloud
Use the Wasmer CLI to push the sentinel to the edge. The `wasmer.toml` is already configured for the `wasmer/static-server`.

```bash
wasmer deploy
```

## 🛡️ Security Disclaimer
**SECURE // PROTECTED**
This tool is intended for security evaluation purposes. All data remains local to the edge runtime.

---
© 2026 GLOBAL SECURITY SYSTEMS
