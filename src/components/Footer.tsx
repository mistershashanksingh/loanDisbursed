import { Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react';

const footerLinks = {
  Products: ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Contact'],
  Support: ['Help Center', 'EMI Calculator', 'Track Application', 'Report Fraud', 'Grievance'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Fair Practices'],
};

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-8 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white font-black text-xl tracking-tight">
                D<span className="glass-blue">ocket </span>D<span className="glass-blue">isbursed</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
              India's most trusted premium lending platform. RBI regulated. NBFC licensed.
            </p>
            
            <div className="flex gap-3">
              {[
                { Icon: Twitter, url: "https://twitter.com/docketdisbursed", color: "#1DA1F2" },
                { Icon: Linkedin, url: "https://linkedin.com/in/docketdisbursed", color: "#0077B5" },
                { Icon: Instagram, url: "https://instagram.com/docketdisbursed", color: '#E4405F' },
              ].map(({ Icon, url, color }, i) => ( // Destructured 'color' here
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex'
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = `${color}20`; 
                    el.style.borderColor = color;
                    el.style.boxShadow = `0 0 15px ${color}66`;
                    // Target the icon inside
                    const icon = el.querySelector('svg') as HTMLElement | null;
                    if (icon) icon.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = 'rgba(255,255,255,0.06)';
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.boxShadow = 'none';
                    // Reset the icon inside
                    const icon = el.querySelector('svg') as HTMLElement | null;
                    if (icon) icon.style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  <Icon
                    size={18}
                    className="transition-colors duration-300"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {category}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#7a97fd')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="p-4 flex items-center gap-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(122, 151, 253, 0.1)' }}>
              <Phone size={15} style={{ color: '#7a97fd' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Customer Care</p>
              <p className="text-sm font-semibold text-white">+91 12345 67890</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,255,135,0.1)' }}>
              <Mail size={15} style={{ color: '#00FF87' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Email Support</p>
              <p className="text-sm font-semibold text-white">docketdisbursed@gmail.com</p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2026 DocketDisbursed Financial Services Pvt. Ltd. | CIN: U74999MH2025PTC123456 | RBI Reg. No.: N-14.12345
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Lending responsibly since 2025
          </p>
        </div>
      </div>
    </footer>
  );
}