import { useState, useMemo } from 'react';
import { TrendingDown, IndianRupee, Calendar, Percent } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
// 1. Updated Import Name!
import CreditScorePieChart from './CreditScorePieChart';

export default function EMICalculator() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [rate, setRate] = useState(10.49);

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const n = tenure;
    if (monthlyRate === 0) return { emi: amount / n, totalPayment: amount, totalInterest: 0 };
    const emiVal = (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const total = emiVal * n;
    return {
      emi: emiVal,
      totalPayment: total,
      totalInterest: total - amount,
    };
  }, [amount, tenure, rate]);

  const formatINR = (val: number) =>
    '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeader
            label="EMI Calculator"
            title="Know Your Monthly Commitment"
            subtitle="Adjust loan parameters to instantly see your equated monthly installment"
          />
        </div>

        <div className={`grid lg:grid-cols-2 gap-8 mt-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="gradient-border glass-card-strong p-8">
            <SliderField
              label="Loan Amount"
              icon={<IndianRupee size={14} />}
              value={amount}
              min={50000}
              max={5000000}
              step={10000}
              display={formatINR(amount)}
              onChange={setAmount}
              trackColor={`linear-gradient(90deg, #7a97fd ${((amount - 50000) / 4950000) * 100}%, rgba(255,255,255,0.15) ${((amount - 50000) / 4950000) * 100}%)`}
            />
            <SliderField
              label="Tenure"
              icon={<Calendar size={14} />}
              value={tenure}
              min={6}
              max={60}
              step={6}
              display={`${tenure} Months`}
              onChange={setTenure}
              trackColor={`linear-gradient(90deg, #7a97fd ${((tenure - 6) / 54) * 100}%, rgba(255,255,255,0.15) ${((tenure - 6) / 54) * 100}%)`}
            />
            <SliderField
              label="Interest Rate"
              icon={<Percent size={14} />}
              value={rate}
              min={8}
              max={24}
              step={0.1}
              display={`${rate.toFixed(2)}% p.a.`}
              onChange={setRate}
              trackColor={`linear-gradient(90deg, #7a97fd ${((rate - 8) / 16) * 100}%, rgba(255,255,255,0.15) ${((rate - 8) / 16) * 100}%)`}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="gradient-border glass-card-strong p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Monthly EMI</p>
                  <p
                    className="text-5xl font-black glow-text"
                    style={{
                      background: 'linear-gradient(135deg, #7a97fd, #3f59b8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {formatINR(emi)}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(0,229,255,0.1)' }}>
                  <TrendingDown size={20} style={{ color: '#7a97fd' }} />
                </div>
              </div>

              {/* 2. Updated Component Name and Prop Names! */}
              <CreditScorePieChart
                principal={amount}
                interest={totalInterest}
                animate={true}
              />

              <div className="space-y-3 mt-6">
                <BreakdownRow label="Principal Amount" value={formatINR(amount)} color="rgba(255,255,255,0.8)" />
                <BreakdownRow label="Total Interest" value={formatINR(totalInterest)} color="#FF6B6B" />
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <BreakdownRow label="Total Payment" value={formatINR(totalPayment)} color="#7a97fd" bold />
              </div>
            </div>

            <button className="btn-primary py-4 text-base font-bold w-full">
              Apply for This Loan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderField({
  label,
  icon,
  value,
  min,
  max,
  step,
  display,
  onChange,
  trackColor,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  trackColor: string;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span
          className="text-sm font-bold px-3 py-1 rounded-lg"
          style={{ background: 'rgba(0,229,255,0.1)', color: '#7a97fd' }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ background: trackColor }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{min.toLocaleString('en-IN')}</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{max.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold text-base' : 'font-semibold'}`} style={{ color }}>{value}</span>
    </div>
  );
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <p
        className="text-xs font-semibold tracking-widest uppercase mb-3"
        style={{ color: '#7a97fd' }}
      >
        {label}
      </p>
      <h2 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {subtitle}
      </p>
    </div>
  );
}