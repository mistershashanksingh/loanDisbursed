import { useEffect, useState } from 'react';

interface CreditScoreMeterProps {
  score: number;
  animate?: boolean;
}

export default function CreditScoreMeter({ score, animate = true }: CreditScoreMeterProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 300 : score);

  useEffect(() => {
    if (!animate) return;

    const duration = 2000;
    const steps = 60;
    const increment = (score - 300) / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      if (current >= steps) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(300 + increment * current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animate]);

  const normalizedScore = ((displayScore - 300) / 600) * 100;
  const rotation = (normalizedScore / 100) * 180 - 90;

  const getScoreColor = (s: number) => {
    if (s >= 750) return '#00FF87';
    if (s >= 700) return '#00E5FF';
    if (s >= 650) return '#FFB800';
    return '#FF6B6B';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 750) return 'Excellent';
    if (s >= 700) return 'Good';
    if (s >= 650) return 'Fair';
    return 'Poor';
  };

  const scoreColor = getScoreColor(displayScore);
  const scoreLabel = getScoreLabel(displayScore);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg viewBox="0 0 200 120" className="w-full">
        <defs>
          <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 0.3 }} />
            <stop offset="33%" style={{ stopColor: '#FFB800', stopOpacity: 0.3 }} />
            <stop offset="66%" style={{ stopColor: '#00E5FF', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#00FF87', stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#meterGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (normalizedScore / 100) * 251.2}
          style={{
            transition: animate ? 'stroke-dashoffset 2s ease-out' : 'none',
          }}
        />

        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (tick / 100) * 180 - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 72 * Math.cos(rad);
          const y1 = 100 + 72 * Math.sin(rad);
          const x2 = 100 + 80 * Math.cos(rad);
          const y2 = 100 + 80 * Math.sin(rad);
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '100px 100px',
            transition: animate ? 'transform 2s ease-out' : 'none',
          }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke={scoreColor}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <circle cx="100" cy="100" r="6" fill={scoreColor} filter="url(#glow)" />
        </g>

        <circle cx="100" cy="100" r="3" fill="rgba(255,255,255,0.9)" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '45%' }}>
        <p
          className="text-5xl font-black transition-all duration-500"
          style={{ color: scoreColor, textShadow: `0 0 20px ${scoreColor}40` }}
        >
          {displayScore}
        </p>
        <p className="text-sm font-semibold mt-1" style={{ color: scoreColor }}>
          {scoreLabel}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          CIBIL Score
        </p>
      </div>

      <div className="flex justify-between px-4 mt-2">
        <div className="text-center">
          <p className="text-xs font-bold" style={{ color: '#FF6B6B' }}>300</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Poor</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold" style={{ color: '#00FF87' }}>900</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Excellent</p>
        </div>
      </div>
    </div>
  );
}
