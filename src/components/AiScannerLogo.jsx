import React from 'react';

const AiScannerLogo = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Neon Cyan/Blue Gradient */}
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#4facfe" />
        </linearGradient>
        
        {/* Glow Filter for the Scanner Laser */}
        <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Document Base (Dark filled with Neon Border) */}
      <rect 
        x="25" y="15" 
        width="50" height="70" 
        rx="8" 
        stroke="url(#neonGradient)" 
        strokeWidth="5" 
        fill="#0f172a" 
      />

      {/* Document Text Lines */}
      <line x1="38" y1="32" x2="62" y2="32" stroke="#4facfe" strokeWidth="4" strokeLinecap="round" />
      <line x1="38" y1="45" x2="62" y2="45" stroke="#4facfe" strokeWidth="4" strokeLinecap="round" />
      <line x1="38" y1="58" x2="52" y2="58" stroke="#4facfe" strokeWidth="4" strokeLinecap="round" />

      {/* Glowing AI Scanner Laser Line */}
      <line 
        x1="12" y1="45" 
        x2="88" y2="45" 
        stroke="#00f2fe" 
        strokeWidth="3.5" 
        filter="url(#laserGlow)" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default AiScannerLogo;