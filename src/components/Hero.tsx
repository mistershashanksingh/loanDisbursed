import { ArrowRight, Shield, Clock, Star } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onCalculate: () => void;
}

const badges = [
  { icon: Shield, text: 'RBI Regulated' },
  { icon: Clock, text: 'Instant Approval' },
  { icon: Star, text: '4.9/5 Rating' },
];

export default function Hero({ onGetStarted, onCalculate }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(0, 140, 255, 0.2)',
                border: '1px solid rgba(0, 140, 255, 0.2)',
                color: '#5B7EFF',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Premium Lending Platform
            </div>

            <h1
              className="text-5xl lg:text-7xl font-black leading-none tracking-tight mb-6"
              style={{ lineHeight: '1.05' }}
            >
              Finance That
              <br />
              <span
                className="glow-text"
                style={{
                  background: 'linear-gradient(135deg, #7a97fd 0%, #5B7EFF  100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Works For You
              </span>
            </h1>

            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '480px' }}>
              Unlock instant personal loans up to ₹50 Lakhs at the industry's lowest interest rates. Zero paperwork. 100% digital. Credited in 4 hours.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {badges.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Icon size={13} style={{ color: '#7a97fd' }} />
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                className="btn-primary px-8 py-4 text-base flex items-center gap-2"
                onClick={onGetStarted}
              >
                Apply Now <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary px-8 py-4 text-base"
                onClick={onCalculate}
              >
                Calculate EMI
              </button>
            </div>
          </div>

          <div
            className="opacity-0 animate-fade-in-up animation-delay-300"
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="gradient-border glass-card-strong p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0, 153, 255, 0.06) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Your Loan Overview</p>
              <p className="text-4xl font-black text-white mb-1">₹12,50,000</p>
              <p className="text-sm mb-6" style={{ color: '#48ffaa' }}>Pre-approved limit available</p>

              <div className="space-y-4">
                <LoanInfoRow label="Interest Rate" value="10.49% p.a." highlight />
                <LoanInfoRow label="Tenure" value="Up to 60 months" />
                <LoanInfoRow label="Processing Fee" value="Zero" highlight />
                <LoanInfoRow label="Disbursal Time" value="4 hours" />
              </div>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Profile Strength</span>
                  <span className="text-xs font-semibold glass-blue">92%</span>
                </div>
                <div className="progress-track h-1.5">
                  <div className="progress-fill h-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                { value: '₹50L+', label: 'Max Loan' },
                { value: '4 Hrs', label: 'Disbursal' },
                { value: '10.49%', label: 'Min Rate' },
              ].map(({ value, label }) => (
                <div key={label} className="glass-card stat-card text-center py-4 px-2">
                  <p className="text-xl font-black glass-blue">{value}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoanInfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: highlight ? '#7a97fd' : 'rgba(255,255,255,0.85)' }}>{value}</span>
    </div>
  );
}
