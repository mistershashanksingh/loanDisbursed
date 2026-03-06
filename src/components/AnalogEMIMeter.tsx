import { useEffect, useState } from 'react';

interface AnalogEMIMeterProps {
  principalAmount: number;
  interestAmount: number;
  monthlyEMI?: number; // Added prop for Monthly EMI
  animate?: boolean;
}

export default function AnalogEMIMeter({ 
  principalAmount, 
  interestAmount, 
  monthlyEMI = 0, // Default to 0 if not provided
  animate = true 
}: AnalogEMIMeterProps) {
  const [animatedPrincipal, setAnimatedPrincipal] = useState(animate ? 0 : principalAmount);
  const [animatedInterest, setAnimatedInterest] = useState(animate ? 0 : interestAmount);
  const [animatedEMI, setAnimatedEMI] = useState(animate ? 0 : monthlyEMI);

  // The final total amount used to calculate the absolute percentages for layout
  const finalTotalAmount = principalAmount + interestAmount;
  
  // The animated total that counts up during the animation
  const animatedTotal = animatedPrincipal + animatedInterest;

  // Calculate percentages based on the FINAL total so they grow accurately during animation
  const currentPPercent = finalTotalAmount > 0 ? (animatedPrincipal / finalTotalAmount) * 100 : 0;
  const currentIPercent = finalTotalAmount > 0 ? (animatedInterest / finalTotalAmount) * 100 : 0;

  useEffect(() => {
    if (!animate) return;

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const pInc = principalAmount / steps;
    const iInc = interestAmount / steps;
    const emiInc = monthlyEMI / steps; // Calculate increment for EMI
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setAnimatedPrincipal(principalAmount);
        setAnimatedInterest(interestAmount);
        setAnimatedEMI(monthlyEMI);
        clearInterval(timer);
      } else {
        setAnimatedPrincipal(pInc * step);
        setAnimatedInterest(iInc * step);
        setAnimatedEMI(emiInc * step);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [principalAmount, interestAmount, monthlyEMI, animate]);

  // --- SVG Math ---
  const cx = 150;
  const cy = 190;
  
  const arcRadius = 105;
  const arcLength = Math.PI * arcRadius;
  
  const pArcLength = (currentPPercent / 100) * arcLength;
  const iArcLength = (currentIPercent / 100) * arcLength;
  
  // Needle points exactly to the Principal percentage line
  // 0% points Left (0 deg rotation), 50% points Straight Up (90 deg rotation)
  const needleRotation = (currentPPercent / 100) * 180;

  // Helper to place percentage text perfectly inside the colored arcs
  const getCoordinatesForPercent = (percent: number, radiusOffset: number) => {
    const thetaDeg = 180 - (percent * 1.8); 
    const thetaRad = thetaDeg * (Math.PI / 180);
    return {
      x: cx + radiusOffset * Math.cos(thetaRad),
      y: cy - radiusOffset * Math.sin(thetaRad)
    };
  };

  const pTextPos = getCoordinatesForPercent(currentPPercent / 2, 70);
  const iTextPos = getCoordinatesForPercent(currentPPercent + (currentIPercent / 2), 70);

  const formatINR = (val: number) => '₹' + Math.round(val).toLocaleString('en-IN');

  // --- Generate Tick Marks ---
  const ticks = [];
  for (let i = 0; i <= 100; i += 2) {
    const isMajor = i % 10 === 0;
    // Map 0-100 to 180-360 degrees (SVG coordinates)
    const angle = 180 + (i * 1.8);
    const rad = (angle * Math.PI) / 180;
    
    const outerR = 135;
    const innerR = isMajor ? 122 : 128; // Major ticks are longer
    
    const x1 = cx + innerR * Math.cos(rad);
    const y1 = cy + innerR * Math.sin(rad); 
    const x2 = cx + outerR * Math.cos(rad);
    const y2 = cy + outerR * Math.sin(rad);

    // Color ticks based on exactly where the needle is splitting them
    const tickColor = i <= currentPPercent ? '#7a97fd' : '#FF6B6B';

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={tickColor}
        strokeWidth={isMajor ? 2.5 : 1.5}
        opacity={isMajor ? 1 : 0.6}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div 
      className="relative w-full mx-auto rounded-[2rem] p-6 shadow-2xl overflow-hidden border border-gray-800/60"
      style={{ background: 'radial-gradient(circle at 50% 10%, #2a2d35 0%, #111316 100%)' }}
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#ffffff_0%,transparent_60%)] mix-blend-overlay pointer-events-none"></div>

      {/* Animated Monthly EMI Header */}
      {monthlyEMI > 0 && (
        <div className="relative z-10 mb-2 text-left">
          <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide">Monthly EMI</p>
          <p 
            className="text-4xl font-extrabold text-[#00E5FF] tracking-tight"
            style={{ textShadow: '0 0 20px rgba(0, 140, 255, 0.4)' }}
          >
            {formatINR(animatedEMI)}
          </p>
        </div>
      )}

      <div className="relative w-full z-10 pt-2">
        <svg viewBox="0 0 300 280" className="w-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f0f0" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#888888" />
              <stop offset="70%" stopColor="#dddddd" />
              <stop offset="100%" stopColor="#444444" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
            </filter>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Thin Outer Glowing Track Boundary */}
          <path
            d={`M ${cx - 140} ${cy} A 140 140 0 0 1 ${cx + 140} ${cy}`}
            fill="none"
            stroke="rgba(0, 229, 255, 0.15)"
            strokeWidth="1"
            filter="url(#glow)"
          />

          {/* Speedometer Ticks */}
          {ticks}

          {/* Base Dark Thick Track */}
          <path
            d={`M ${cx - arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 1 ${cx + arcRadius} ${cy}`}
            fill="none"
            stroke="#1a1c23"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Principal Thick Track (Cyan) */}
          <path
            d={`M ${cx - arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 1 ${cx + arcRadius} ${cy}`}
            fill="none"
            stroke="#5c78dd"
            strokeWidth="18"
            strokeLinecap="butt"
            strokeDasharray={`${pArcLength} 1000`}
            filter="url(#glow)"
          />

          {/* Interest Thick Track (Red) */}
          <path
            d={`M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 0 ${cx - arcRadius} ${cy}`}
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="18"
            strokeLinecap="butt"
            strokeDasharray={`${iArcLength} 1000`}
            filter="url(#glow)"
          />

          {/* Outer Rounded End-Caps for the Thick Track */}
          {currentPPercent > 0 && <circle cx={cx - arcRadius} cy={cy} r="9" fill="#5c78dd" />}
          {currentIPercent > 0 && <circle cx={cx + arcRadius} cy={cy} r="9" fill="#FF6B6B" />}

          {/* Dynamic Percentages rendered INSIDE the meter arcs */}
          {currentPPercent > 5 && (
             <text 
               x={pTextPos.x} y={pTextPos.y} 
               fill="#7a97fd" fontSize="16" fontWeight="900" 
               textAnchor="middle" dominantBaseline="central"
             >
               {currentPPercent.toFixed(1)}%
             </text>
          )}

          {currentIPercent > 5 && (
             <text 
               x={iTextPos.x} y={iTextPos.y} 
               fill="#FF6B6B" fontSize="16" fontWeight="900" 
               textAnchor="middle" dominantBaseline="central"
             >
               {currentIPercent.toFixed(1)}%
             </text>
          )}

          {/* Dynamic Full Needle */}
          <g
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
            }}
            filter="url(#shadow)"
          >
            {/* Main Needle Body - Symmetrical & Pointed */}
            <polygon points={`${cx},${cy - 5} 35,${cy - 1.5} 35,${cy + 1.5} ${cx},${cy + 5}`} fill="url(#metalGrad)" />
            {/* Center Bright Highlight Line */}
            <polygon points={`${cx},${cy - 0.5} 35,${cy - 0.5} 35,${cy + 0.5} ${cx},${cy + 0.5}`} fill="#ffffff" opacity="0.9" />
          </g>

          {/* Center Hub Overlay */}
          <circle cx={cx} cy={cy} r="20" fill="url(#metalGrad)" filter="url(#shadow)" />
          <circle cx={cx} cy={cy} r="12" fill="#111316" />
          <circle cx={cx} cy={cy} r="5" fill="url(#metalGrad)" />

          {/* End Labels */}
          <text x={cx - 135} y={cy + 25} fill="#6b7280" fontSize="13" fontWeight="bold" textAnchor="middle">0%</text>
          <text x={cx + 135} y={cy + 25} fill="#6b7280" fontSize="13" fontWeight="bold" textAnchor="middle">100%</text>

          {/* Total Payment Status */}
          <text x={cx} y={cy + 30} fill="#888888" fontSize="12" textAnchor="middle" fontWeight="500">
            Total Payment
          </text>
          <text 
            x={cx} 
            y={cy + 65} 
            fill="#7a97fd" 
            fontSize="28" 
            fontWeight="900" 
            textAnchor="middle"
            style={{ textShadow: '0 0 15px rgba(0, 132, 255, 0.4)' }}
          >
            {formatINR(animatedTotal)}
          </text>
        </svg>
      </div>

      {/* Bottom Data Cards */}
      <div className="grid grid-cols-2 gap-4 mt-2 relative z-10">
        <div className="bg-[#24272c]/80 backdrop-blur-md rounded-2xl p-4 border border-gray-700/40 shadow-inner">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7a97fd] shadow-[0_0_8px_#7a97fd]" />
            <p className="text-xs font-semibold text-[#7a97fd]">Principal</p>
          </div>
          <p className="text-xl font-bold text-white text-center">
            {formatINR(animatedPrincipal)}
          </p>
          <p className="text-[10px] text-gray-400 text-center mt-1">
            {currentPPercent.toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-[#24272c]/80 backdrop-blur-md rounded-2xl p-4 border border-gray-700/40 shadow-inner">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] shadow-[0_0_8px_#FF6B6B]" />
            <p className="text-xs font-semibold text-[#FF6B6B]">Interest</p>
          </div>
          <p className="text-xl font-bold text-white text-center">
            {formatINR(animatedInterest)}
          </p>
          <p className="text-[10px] text-gray-400 text-center mt-1">
            {currentIPercent.toFixed(1)}% of total
          </p>
        </div>
      </div>
    </div>
  );
}