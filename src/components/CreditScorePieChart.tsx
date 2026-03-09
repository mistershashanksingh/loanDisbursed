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
  // 1. Crash-proof and round numbers to prevent long decimals breaking the UI
  const safePrincipal = Math.round(principal || 0);
  const safeInterest = Math.round(interest || 0);
  const safeFee = Math.round(processingFee || 0);
  const total = safePrincipal + safeInterest + safeFee;
  
  // We only need one animated state for the total amount to make it sequential
  const [displayTotal, setDisplayTotal] = useState(animate ? 0 : total);

  useEffect(() => {
    if (!animate || total === 0) {
      setDisplayTotal(total);
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
        clearInterval(timer);
      } else {
        setDisplayTotal(total * easeOutProgress);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [total, animate]);

  // SEQUENTIAL CALCULATION: Figure out how much of each segment to draw based on current displayTotal
  const currentPrincipal = Math.min(displayTotal, safePrincipal);
  const currentInterest = Math.max(0, Math.min(displayTotal - safePrincipal, safeInterest));
  const currentFee = Math.max(0, displayTotal - safePrincipal - safeInterest);

  // SVG circle calculations (adjusted radius and stroke to give text more room)
  const radius = 75; 
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 26;

  // Segment lengths based on the current animated step
  const principalLen = total > 0 ? (currentPrincipal / total) * circumference : 0;
  const interestLen = total > 0 ? (currentInterest / total) * circumference : 0;
  const feeLen = total > 0 ? (currentFee / total) * circumference : 0;

  // FIXED OFFSETS: This keeps the start points anchored so they fill exactly from where the previous one ends
  const principalOffset = 0;
  const interestOffset = total > 0 ? -((safePrincipal / total) * circumference) : 0;
  const feeOffset = total > 0 ? -(((safePrincipal + safeInterest) / total) * circumference) : 0;

  const colors = {
    principal: '#0066FF', // Blue
    interest: '#FFCC00',  // Yellow
    fee: '#FF007F'        // Pink
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full transform -rotate-90 drop-shadow-lg">
          {/* Background Track */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          
          {/* Segment 1: Principal (Blue) */}
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

          {/* Segment 2: Interest (Yellow) */}
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

          {/* Segment 3: Processing Fee (Pink) */}
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

        {/* Center Text Box */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="glass-card py-3 px-4 text-center flex flex-col items-center justify-center" 
               style={{ 
                 background: 'rgba(255,255,255,0.05)', 
                 backdropFilter: 'blur(10px)',
                 boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                 borderRadius: '12px',
                 border: '1px solid rgba(255,255,255,0.1)',
                 maxWidth: '85%' // Prevents horizontal overflow
               }}>
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              In Total
            </p>
            {/* Added whitespace-nowrap and slightly adjusted text sizes to keep it from breaking lines */}
            <p className="text-xl sm:text-2xl font-black text-white whitespace-nowrap" style={{ letterSpacing: '-0.02em' }}>
              ₹{Math.round(displayTotal || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* NEW STACKED LEGEND WITH CAPSULES */}
      <div className="flex flex-col gap-3 mt-8 w-full max-w-[250px] mx-auto">
        
        {/* Principal Legend Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-2 rounded-full" style={{ background: colors.principal }} />
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Principal</span>
          </div>
          <span className="text-sm font-bold text-white">₹{safePrincipal.toLocaleString('en-IN')}</span>
        </div>

        {/* Interest Legend Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-2 rounded-full" style={{ background: colors.interest }} />
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Interest</span>
          </div>
          <span className="text-sm font-bold text-white">₹{safeInterest.toLocaleString('en-IN')}</span>
        </div>

        {/* Fee Legend Row (Hidden if 0) */}
        {safeFee > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-2 rounded-full" style={{ background: colors.fee }} />
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Fee</span>
            </div>
            <span className="text-sm font-bold text-white">₹{safeFee.toLocaleString('en-IN')}</span>
          </div>
        )}

      </div>
    </div>
  );
}