import { useEffect, useState } from 'react';

interface EMIDonutChartProps {
  principal?: number;
  interest?: number;
  processingFee?: number;
  animate?: boolean;
}

export default function CreditScorePieChart({ 
  principal = 0, 
  interest = 0, 
  processingFee = 0, 
  animate = true 
}: EMIDonutChartProps) {
  // 1. Crash-proof the numbers (defaults to 0 if undefined)
  const safePrincipal = principal || 0;
  const safeInterest = interest || 0;
  const safeFee = processingFee || 0;
  const total = safePrincipal + safeInterest + safeFee;
  
  // States for animation
  const [displayTotal, setDisplayTotal] = useState(animate ? 0 : total);
  const [progress, setProgress] = useState(animate ? 0 : 1);

  useEffect(() => {
    if (!animate || total === 0) {
      setDisplayTotal(total);
      setProgress(1);
      return;
    }

    const duration = 2000; // 2 seconds animation
    const frames = 60;
    const stepTime = duration / frames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const p = currentFrame / frames;
      
      // Cubic ease-out animation
      const easeOutProgress = 1 - Math.pow(1 - p, 3);

      if (currentFrame >= frames) {
        setDisplayTotal(total);
        setProgress(1);
        clearInterval(timer);
      } else {
        setDisplayTotal(Math.floor(total * easeOutProgress));
        setProgress(easeOutProgress);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [total, animate]);

  // SVG circle calculations
  const radius = 70; 
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 32;

  // Segment lengths
  const principalLen = total > 0 ? (safePrincipal / total) * circumference * progress : 0;
  const interestLen = total > 0 ? (safeInterest / total) * circumference * progress : 0;
  const feeLen = total > 0 ? (safeFee / total) * circumference * progress : 0;

  // Segment offsets
  const principalOffset = 0;
  const interestOffset = -principalLen;
  const feeOffset = -(principalLen + interestLen);

  const colors = {
    principal: '#0066FF', // Blue
    interest: '#FFCC00',  // Yellow
    fee: '#FF007F'        // Pink
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full transform -rotate-90 drop-shadow-lg">
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {principalLen > 0 && (
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke={colors.principal}
              strokeWidth={strokeWidth}
              strokeDasharray={`${principalLen} ${circumference}`}
              strokeDashoffset={principalOffset}
              strokeLinecap="butt"
            />
          )}
          {interestLen > 0 && (
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke={colors.interest}
              strokeWidth={strokeWidth}
              strokeDasharray={`${interestLen} ${circumference}`}
              strokeDashoffset={interestOffset}
              strokeLinecap="butt"
            />
          )}
          {feeLen > 0 && (
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke={colors.fee}
              strokeWidth={strokeWidth}
              strokeDasharray={`${feeLen} ${circumference}`}
              strokeDashoffset={feeOffset}
              strokeLinecap="butt"
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="glass-card py-3 px-5 text-center flex flex-col items-center justify-center" 
               style={{ 
                 background: 'rgba(255,255,255,0.05)', 
                 backdropFilter: 'blur(10px)',
                 boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                 borderRadius: '12px',
                 border: '1px solid rgba(255,255,255,0.1)'
               }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              In Total
            </p>
            <p className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              ₹{(displayTotal || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-6 px-4">
        <div className="text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: colors.principal }} />
          <p className="text-xs font-bold text-white">₹{(safePrincipal || 0).toLocaleString('en-IN')}</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Principal</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: colors.interest }} />
          <p className="text-xs font-bold text-white">₹{(safeInterest || 0).toLocaleString('en-IN')}</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Interest</p>
        </div>
        {safeFee > 0 && (
          <div className="text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: colors.fee }} />
            <p className="text-xs font-bold text-white">₹{(safeFee || 0).toLocaleString('en-IN')}</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Fee</p>
          </div>
        )}
      </div>
    </div>
  );
}