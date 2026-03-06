import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, User, Briefcase, CreditCard } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const employmentTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer'];
const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function EligibilityCalculator() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [income, setIncome] = useState(75000);
  const [age, setAge] = useState(28);
  const [employment, setEmployment] = useState('Salaried');
  const [city, setCity] = useState('Mumbai');
  const [cibilScore, setCibilScore] = useState(720);
  const [existingEmi, setExistingEmi] = useState(0);

  const result = useMemo(() => {
    const foir = 0.5;
    const availableIncome = income - existingEmi;
    const maxEmi = availableIncome * foir;
    const rate = cibilScore >= 750 ? 10.49 : cibilScore >= 700 ? 12.5 : 14.99;
    const monthlyRate = rate / 12 / 100;
    const n = employment === 'Salaried' ? 60 : 48;
    const maxLoan = (maxEmi * (Math.pow(1 + monthlyRate, n) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, n));

    const eligible = age >= 21 && age <= 58 && income >= 25000 && cibilScore >= 650;
    const scoreLabel = cibilScore >= 750 ? 'Excellent' : cibilScore >= 700 ? 'Good' : cibilScore >= 650 ? 'Fair' : 'Poor';
    const scoreColor = cibilScore >= 750 ? '#00FF87' : cibilScore >= 700 ? '#7a97fd' : cibilScore >= 650 ? '#FFB800' : '#FF6B6B';

    return { eligible, maxLoan: Math.max(0, maxLoan), rate, maxEmi, scoreLabel, scoreColor };
  }, [income, age, employment, city, cibilScore, existingEmi]);

  const formatINR = (val: number) => '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const criteria = [
    { label: 'Age (21–58 years)', passed: age >= 21 && age <= 58 },
    { label: 'Min Income ₹25,000/mo', passed: income >= 25000 },
    { label: 'CIBIL Score ≥ 650', passed: cibilScore >= 650 },
    { label: 'Employment Valid', passed: true },
  ];

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#00FF87' }}>
            Eligibility Check
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Are You Eligible?
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Fill in your details to instantly check your loan eligibility and maximum loan amount
          </p>
        </div>

        <div className={`grid lg:grid-cols-5 gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="lg:col-span-3 gradient-border glass-card-strong p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <FormGroup label="Monthly Income" icon={<User size={14} />}>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="glass-input w-full px-4 py-3 text-sm"
                  placeholder="e.g. 75000"
                />
              </FormGroup>

              <FormGroup label="Age (years)" icon={<User size={14} />}>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="glass-input w-full px-4 py-3 text-sm"
                  placeholder="e.g. 28"
                />
              </FormGroup>

              <FormGroup label="Employment Type" icon={<Briefcase size={14} />}>
                <div className="relative">
                  <select
                    value={employment}
                    onChange={(e) => setEmployment(e.target.value)}
                    className="w-full px-4 py-3 text-sm pr-10"
                  >
                    {employmentTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }}>▾</span>
                </div>
              </FormGroup>

              <FormGroup label="City" icon={<Briefcase size={14} />}>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 text-sm pr-10"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }}>▾</span>
                </div>
              </FormGroup>

              <FormGroup label={`CIBIL Score: ${cibilScore}`} icon={<CreditCard size={14} />}>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={10}
                  value={cibilScore}
                  onChange={(e) => setCibilScore(Number(e.target.value))}
                  className="w-full mt-2"
                  style={{
                    background: `linear-gradient(90deg, ${result.scoreColor} ${((cibilScore - 300) / 600) * 100}%, rgba(255,255,255,0.15) ${((cibilScore - 300) / 600) * 100}%)`,
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>300</span>
                  <span className="text-xs font-semibold" style={{ color: result.scoreColor }}>{result.scoreLabel}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>900</span>
                </div>
              </FormGroup>

              <FormGroup label="Existing EMI/mo" icon={<CreditCard size={14} />}>
                <input
                  type="number"
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(Number(e.target.value))}
                  className="glass-input w-full px-4 py-3 text-sm"
                  placeholder="e.g. 5000"
                />
              </FormGroup>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div
              className="gradient-border glass-card-strong p-8"
              style={{ borderColor: result.eligible ? 'rgba(0,255,135,0.2)' : 'rgba(255,107,107,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                {result.eligible ? (
                  <CheckCircle size={28} style={{ color: '#00FF87' }} />
                ) : (
                  <XCircle size={28} style={{ color: '#FF6B6B' }} />
                )}
                <div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Eligibility Status</p>
                  <p className="text-lg font-bold" style={{ color: result.eligible ? '#00FF87' : '#FF6B6B' }}>
                    {result.eligible ? 'Eligible' : 'Not Eligible'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <EligRow label="Max Loan Amount" value={formatINR(result.maxLoan)} highlight />
                <EligRow label="Applicable Rate" value={`${result.rate}% p.a.`} />
                <EligRow label="Max EMI Capacity" value={formatINR(result.maxEmi)} />
                <EligRow label="CIBIL Rating" value={result.scoreLabel} color={result.scoreColor} />
              </div>

              <div className="space-y-2">
                {criteria.map(({ label, passed }) => (
                  <div key={label} className="flex items-center gap-2">
                    {passed ? (
                      <CheckCircle size={14} style={{ color: '#00FF87', flexShrink: 0 }} />
                    ) : (
                      <XCircle size={14} style={{ color: '#FF6B6B', flexShrink: 0 }} />
                    )}
                    <span className="text-xs" style={{ color: passed ? 'rgba(255,255,255,0.6)' : 'rgba(255,107,107,0.8)' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary py-4 text-base font-bold w-full" disabled={!result.eligible} style={{ opacity: result.eligible ? 1 : 0.5 }}>
              {result.eligible ? 'Proceed to Apply' : 'Check Requirements'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {icon}
        <label className="text-xs font-medium">{label}</label>
      </div>
      {children}
    </div>
  );
}

function EligRow({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  const valueColor = color ?? (highlight ? '#7a97fd' : 'rgba(255,255,255,0.8)');
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span className="text-sm font-bold" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}
