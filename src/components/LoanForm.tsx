import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan'];
const loanPurposes = ['Debt Consolidation', 'Home Renovation', 'Medical Emergency', 'Wedding', 'Travel', 'Education', 'Business Expansion', 'Other'];
const tenureOptions = ['6 Months', '12 Months', '18 Months', '24 Months', '36 Months', '48 Months', '60 Months'];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  panCard: string;
  loanType: string;
  loanAmount: string;
  purpose: string;
  tenure: string;
  monthlyIncome: string;
  employmentType: string;
}

const initial: FormState = {
  fullName: '', email: '', phone: '', panCard: '',
  loanType: '', loanAmount: '', purpose: '',
  tenure: '', monthlyIncome: '', employmentType: '',
};

export default function LoanForm() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setForm(initial); // Clear the form
      } else {
        alert('Failed to submit application: ' + data.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gradient-border glass-card-strong p-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0,255,135,0.1)' }}>
              <CheckCircle size={40} style={{ color: '#00FF87' }} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Application Submitted!</h2>
            <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your loan application has been received. Our team will reach out within <span className="glass-blue font-semibold">4 hours</span> with a decision.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Application ID', value: '#LC' + Math.floor(Math.random() * 900000 + 100000) },
                { label: 'Status', value: 'Under Review' },
                { label: 'ETA', value: '4 Hours' },
              ].map(({ label, value }) => (
                <div key={label} className="glass-card py-4 px-3 text-center">
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                  <p className="text-sm font-bold glass-blue">{value}</p>
                </div>
              ))}
            </div>
            <button className="btn-secondary px-8 py-3 text-sm" onClick={() => setSubmitted(false)}>
              Submit Another Application
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0077ff' }}>
            Apply Now
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Start Your Application
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Complete this form in under 3 minutes. Zero paperwork required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="gradient-border glass-card-strong p-8 mb-4">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Personal Information
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label="Full Name" value={form.fullName} onChange={(v) => update('fullName', v)} placeholder="As per Aadhaar" required />
              <InputField label="Email Address" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="you@example.com" required />
              <InputField label="Phone Number" type="tel" value={form.phone} onChange={(v) => update('phone', v)} placeholder="+91 98765 43210" required />
              <InputField label="PAN Card" value={form.panCard} onChange={(v) => update('panCard', v.toUpperCase())} placeholder="ABCDE1234F" required />
            </div>
          </div>

          <div className="gradient-border glass-card-strong p-8 mb-4">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Loan Details
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <SelectField label="Loan Type" value={form.loanType} onChange={(v) => update('loanType', v)} options={loanTypes} placeholder="Select Loan Type" />
              <InputField label="Loan Amount (₹)" type="number" value={form.loanAmount} onChange={(v) => update('loanAmount', v)} placeholder="e.g. 500000" required />
              <SelectField label="Loan Purpose" value={form.purpose} onChange={(v) => update('purpose', v)} options={loanPurposes} placeholder="Select Purpose" />
              <SelectField label="Preferred Tenure" value={form.tenure} onChange={(v) => update('tenure', v)} options={tenureOptions} placeholder="Select Tenure" />
            </div>
          </div>

          <div className="gradient-border glass-card-strong p-8 mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Employment Details
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <SelectField
                label="Employment Type"
                value={form.employmentType}
                onChange={(v) => update('employmentType', v)}
                options={['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer']}
                placeholder="Select Type"
              />
              <InputField label="Monthly Income (₹)" type="number" value={form.monthlyIncome} onChange={(v) => update('monthlyIncome', v)} placeholder="e.g. 75000" required />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              By submitting, you agree to our Terms of Service and Privacy Policy
            </p>
            <button
              type="submit"
              className="btn-primary px-8 py-4 text-base flex items-center gap-2 min-w-48 justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>Submit Application <Send size={15} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function InputField({
  label, type = 'text', value, onChange, placeholder, required,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="glass-input w-full px-4 py-3 text-sm"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 text-sm pr-10"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }}>▾</span>
      </div>
    </div>
  );
}