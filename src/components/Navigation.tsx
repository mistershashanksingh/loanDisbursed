import { useState } from 'react';
import {Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'creditscore', label: 'Credit Score' },
  { id: 'apply', label: 'Apply Now' },
  { id: 'emi', label: 'EMI Calculator' },
  { id: 'eligibility', label: 'Eligibility' },
];

export default function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/src/assets/icond.png" 
              alt="DocketDisbursed Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl object-contain"
            />
            <span className="text-white font-black text-lg sm:text-xl tracking-tight ml-2">
              D<span className="glass-blue">ocket</span>D<span className="glass-blue">isbursed</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: activeSection === link.id ? '#5B7EFF' : 'rgba(255,255,255,0.6)',
                  background: activeSection === link.id ? 'rgba(0,229,255,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary px-5 py-2 text-sm flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-secondary px-5 py-2 text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary px-5 py-2 text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white hamburger-button relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className={`hamburger ${mobileOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        <div className={`mobile-menu md:hidden overflow-hidden ${mobileOpen ? 'mobile-menu-open' : ''}`}>
          <div className="px-6 pb-4 flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                className="text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mobile-menu-item"
                style={{
                  color: activeSection === link.id ? '#5B7EFF' : 'rgba(255,255,255,0.6)',
                  background: activeSection === link.id ? 'rgba(0,229,255,0.08)' : 'transparent',
                  animationDelay: mobileOpen ? `${i * 0.05}s` : '0s',
                }}
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2 mobile-menu-item" style={{ animationDelay: mobileOpen ? `${navLinks.length * 0.05}s` : '0s' }}>
              {user ? (
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="btn-secondary flex-1 px-4 py-2 text-sm flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}
                    className="btn-secondary flex-1 px-4 py-2 text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}
                    className="btn-primary flex-1 px-4 py-2 text-sm"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
