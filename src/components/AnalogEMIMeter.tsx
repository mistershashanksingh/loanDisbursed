import { useEffect, useState } from 'react';

interface CreditScorePieChartProps {
  score: number;
  animate?: boolean;
}

export default function CreditScorePieChart({ score, animate = true }: CreditScorePieChartProps) {
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

  const getScoreColor = (s: number) => {
    if (s >= 750) return '#00FF87';
    if (s >= 700) return '#7a97fd';
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

  // Calculate pie chart segments
  const normalizedScore = Math.max(0, Math.min(100, ((displayScore - 300) / 600) * 100));
  const scorePercentage = normalizedScore;
  const remainingPercentage = 100 - scorePercentage;

  // SVG circle calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const scoreStrokeDasharray = `${(scorePercentage / 100) * circumference} ${circumference}`;
  const remainingStrokeDasharray = `${(remainingPercentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="w-full transform -rotate-90">
          <defs>
            <filter id="pieGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: scoreColor, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: scoreColor, stopOpacity: 0.7 }} />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="16"
          />

          {/* Remaining percentage (background) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="16"
            strokeDasharray={remainingStrokeDasharray}
            strokeDashoffset="0"
            strokeLinecap="round"
          />

          {/* Score percentage (foreground) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="16"
            strokeDasharray={scoreStrokeDasharray}
            strokeDashoffset="0"
            strokeLinecap="round"
            filter="url(#pieGlow)"
            style={{
              transition: animate ? 'stroke-dasharray 2s ease-out' : 'none',
            }}
          />

          {/* Center dot */}
          <circle cx="100" cy="100" r="4" fill={scoreColor} filter="url(#pieGlow)" />
        </svg>

        {/* Score display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p
            className="text-4xl lg:text-5xl font-black transition-all duration-500"
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

        {/* Percentage indicator */}
        <div className="absolute top-4 right-4">
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ 
              background: `${scoreColor}20`, 
              color: scoreColor,
              border: `1px solid ${scoreColor}40`
            }}
          >
            {Math.round(scorePercentage)}%
          </div>
        </div>
      </div>

      {/* Score range indicators */}
      <div className="flex justify-between px-4 mt-4">
        <div className="text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: '#FF6B6B' }} />
          <p className="text-xs font-bold" style={{ color: '#FF6B6B' }}>300</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Poor</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: '#FFB800' }} />
          <p className="text-xs font-bold" style={{ color: '#FFB800' }}>650</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Fair</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: '#7a97fd' }} />
          <p className="text-xs font-bold" style={{ color: '#7a97fd' }}>700</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Good</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: '#00FF87' }} />
          <p className="text-xs font-bold" style={{ color: '#00FF87' }}>900</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Excellent</p>
        </div>
      </div>
    </div>
  );
}