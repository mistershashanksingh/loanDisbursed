import { useRef, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import BackgroundBlobs from './components/BackgroundBlobs';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CreditScoreSection from './components/CreditScoreSection';
import EMICalculator from './components/EMICalculator';
import EligibilityCalculator from './components/EligibilityCalculator';
import LoanForm from './components/LoanForm';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';

type Section = 'home' | 'creditscore' | 'emi' | 'eligibility' | 'apply';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const homeRef = useRef<HTMLDivElement>(null);
  const creditScoreRef = useRef<HTMLDivElement>(null);
  const emiRef = useRef<HTMLDivElement>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  const scrollTo = (section: Section) => {
    setActiveSection(section);
    const map: Record<Section, React.RefObject<HTMLDivElement>> = {
      home: homeRef,
      creditscore: creditScoreRef,
      emi: emiRef,
      eligibility: eligibilityRef,
      apply: applyRef,
    };
    map[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-black">
        <BackgroundBlobs />
        <div className="relative z-10">
          <Navigation activeSection={activeSection} onNavigate={(s) => scrollTo(s as Section)} />
          <div ref={homeRef}>
            <Hero onGetStarted={() => scrollTo('apply')} onCalculate={() => scrollTo('emi')} />
          </div>
          <div ref={creditScoreRef}>
            <CreditScoreSection />
          </div>
          <div ref={applyRef}>
            <LoanForm />
          </div>
          <div ref={emiRef}>
            <EMICalculator />
          </div>
          <div ref={eligibilityRef}>
            <EligibilityCalculator />
          </div>
          <StatsSection />
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
