import { TrendingUp, Users, Award, Clock } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const stats = [
  { icon: Users, value: '2.4M+', label: 'Happy Customers', color: '#7a97fd' },
  { icon: TrendingUp, value: '₹18,000Cr+', label: 'Loans Disbursed', color: '#00FF87' },
  { icon: Award, value: '4.9/5', label: 'Customer Rating', color: '#FFB800' },
  { icon: Clock, value: '4 Hours', label: 'Avg Disbursal Time', color: '#7a97fd' },
];

const features = [
  { title: 'Zero Paperwork', desc: 'Fully digital KYC powered by DigiLocker and e-NACH mandate.' },
  { title: 'Competitive Rates', desc: 'Interest starting at 10.49% p.a. — among the lowest in the industry.' },
  { title: 'Flexible Tenure', desc: 'Choose repayment period from 6 to 60 months, entirely your call.' },
  { title: 'No Prepayment Penalty', desc: 'Close your loan early without any hidden charges or penalties.' },
  { title: 'Transparent Pricing', desc: 'Zero processing fee. No hidden charges. What you see is what you pay.' },
  { title: 'Dedicated Support', desc: '24/7 customer support via chat, call, or email — always available.' },
];

export default function StatsSection() {
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <>
      <section className="py-20 px-6" ref={statsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, value, label, color }, i) => (
              <div
                key={label}
                className={`glass-card stat-card p-6 text-center transition-all duration-700 ${
                  statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `rgba(${color === '#7a97fd' ? '0,229,255' : color === '#00FF87' ? '0,255,135' : '255,184,0'},0.1)` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-2xl lg:text-3xl font-black text-white">{value}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xs font-semibold tracking-widest camelcase mb-3" style={{ color: '#87a1fd' }}>
              Why Loan Disbursed
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              Built for the Discerning
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ title, desc }, i) => (
              <div
                key={title}
                className={`glass-card stat-card p-6 gradient-border transition-all duration-700 ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(0,229,255,0.1)' }}>
                  <span className="text-xs font-black neon-blue">0{i + 1}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
