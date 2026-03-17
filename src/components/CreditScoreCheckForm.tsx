import { useState } from 'react';
import { X, User, Mail, Phone, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CreditScorePieChart from './CreditScorePieChart';

interface CreditScoreCheckFormProps {
  onClose: () => void;
  onScoreGenerated?: (score: number) => void;
}

export default function CreditScoreCheckForm({ onClose, onScoreGenerated }: CreditScoreCheckFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [panCard, setPanCard] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedScore, setGeneratedScore] = useState<number | null>(null);

  const validateInputs = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!panCard.trim() || panCard.length !== 10) {
      setError('PAN card must be exactly 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) return;

    setLoading(true);

    try {
      // Call real credit score API
      const response = await fetch('/api/credit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          panCard,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedScore(data.creditScore);
        setSuccess(true);
        onScoreGenerated?.(data.creditScore);
      } else {
        setError(data.message || 'Failed to fetch credit score. Please try again.');
      }
    } catch (error) {
      console.error('Credit score check error:', error);
      setError('Network error. Please check your connection and try again.');
    }

    setLoading(false);
  };

  if (success && generatedScore !== null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
        <div className="gradient-border glass-card-strong p-8 w-full max-w-md relative animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <X size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,255,135,0.1)' }}>
              <CheckCircle size={32} style={{ color: '#00FF87' }} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Credit Score Ready!</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Your credit score has been calculated based on your details
            </p>
          </div>

          <div className="mb-6">
            <CreditScorePieChart score={generatedScore} animate={true} />
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Your Details</p>
            <DetailRow label="Full Name" value={fullName} />
            <DetailRow label="Email" value={email} />
            <DetailRow label="Phone" value={phone} />
            <DetailRow label="PAN Card" value={panCard.slice(-4).padStart(10, '*')} />
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full py-3 text-base font-bold"
          >
            Continue to Apply
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="gradient-border glass-card-strong p-8 w-full max-w-md relative animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <X size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Check Your Credit Score</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Enter your details to get an instant credit score assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <div className="flex items-center gap-1.5">
                <User size={13} />
                <span>Full Name</span>
              </div>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
              className="glass-input w-full px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <div className="flex items-center gap-1.5">
                <Mail size={13} />
                <span>Email Address</span>
              </div>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="glass-input w-full px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <div className="flex items-center gap-1.5">
                <Phone size={13} />
                <span>Phone Number</span>
              </div>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              disabled={loading}
              className="glass-input w-full px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <div className="flex items-center gap-1.5">
                <CreditCard size={13} />
                <span>PAN Card (10 characters)</span>
              </div>
            </label>
            <input
              type="text"
              value={panCard}
              onChange={(e) => setPanCard(e.target.value.toUpperCase())}
              placeholder="AAAPA1234A"
              maxLength={10}
              required
              disabled={loading}
              className="glass-input w-full px-4 py-3 text-sm font-mono"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)' }}>
              <AlertCircle size={16} style={{ color: '#FF6B6B', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: '#FF6B6B' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base font-bold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Checking Score...
              </span>
            ) : (
              'Check Score Now'
            )}
          </button>
        </form>

        <p className="text-xs text-center mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Your information is secure and encrypted. We never share your data.
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
      <span className="text-xs font-semibold text-white">{value}</span>
    </div>
  );
}
