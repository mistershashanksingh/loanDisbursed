import { useState } from 'react';
import { Shield, TrendingUp, Award, Zap } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CreditScoreMeter from './CreditScoreMeter';
import CreditScoreCheckForm from './CreditScoreCheckForm';

const benefits = [
  { icon: TrendingUp, label: 'Better Rates', desc: 'Higher scores unlock lower interest rates' },
  { icon: Award, label: 'Higher Limits', desc: 'Qualify for larger loan amounts' },
  { icon: Zap, label: 'Fast Approval', desc: 'Instant pre-approval decisions' },
];

export default function CreditScoreSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [showForm, setShowForm] = useState(false);
  const [checkedScore, setCheckedScore] = useState<number | null>(null);

  return (
    <>
      <section className="py-24 px-6" ref={ref}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#87a1fd' }}>
              Credit Score
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              Check Your Credit Score Instantly
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Get your instant CIBIL score assessment with just your basic details. No hidden charges, no impact on your credit profile.
            </p>
          </div>

          <div className={`grid lg:grid-cols-2 gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="gradient-border glass-card-strong p-8 lg:p-12">
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                {checkedScore ? (
                  <div className="w-full">
                    <CreditScoreMeter score={checkedScore} animate={false} />
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => { setCheckedScore(null); setShowForm(false); }}
                        className="btn-secondary px-6 py-3 text-sm"
                      >
                        Check Another Score
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(0,255,135,0.1)' }}>
                      <Shield size={32} style={{ color: '#00FF87' }} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">Check Your Score Now</h3>
                    <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Enter your details to get your instant CIBIL score. This won't impact your credit profile.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary px-8 py-4 text-base w-full"
                    >
                      Check Score Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="gradient-border glass-card-strong p-6 flex-1">
                <h3 className="text-xl font-black text-white mb-6">Why Check Your Score?</h3>
                <div className="space-y-4">
                  {benefits.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0, 132, 255, 0.1)' }}>
                        <Icon size={18} style={{ color: '#7a97fd' }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{label}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gradient-border glass-card-strong p-6">
                <h4 className="text-sm font-bold text-white mb-4">Understanding Your Score</h4>
                <div className="space-y-3">
                  <ScoreRange range="750+" color="#00FF87" label="Excellent" />
                  <ScoreRange range="700-749" color="#00E5FF" label="Good" />
                  <ScoreRange range="650-699" color="#FFB800" label="Fair" />
                  <ScoreRange range="Below 650" color="#FF6B6B" label="Poor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showForm && (
        <CreditScoreCheckForm
          onClose={() => setShowForm(false)}
          onScoreGenerated={(score) => setCheckedScore(score)}
        />
      )}
    </>
  );
}

function ScoreRange({ range, color, label }: { range: string; color: string; label: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}40` }} />
        <div>
          <p className="text-xs font-semibold text-white">{label}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{range}</p>
        </div>
      </div>
      <div className="text-xs font-semibold" style={{ color }}>
        {label === 'Excellent' && '10.49% APR'}
        {label === 'Good' && '12.5% APR'}
        {label === 'Fair' && '14.99% APR'}
        {label === 'Poor' && '18%+ APR'}
      </div>
    </div>
  );
}
