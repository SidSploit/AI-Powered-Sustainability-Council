
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Multi-Expert Perspectives",
      desc: "Simulate a panel of 7 distinct experts from Climate Scientists to Budget Officers.",
      icon: "👥"
    },
    {
      title: "CSR Assessment",
      desc: "Get structured Environmental, Social, and Governance ratings with detailed key points.",
      icon: "📊"
    },
    {
      title: "Decision Support Tools",
      desc: "Improvement plans, slide outlines, and one-page reports at the click of a button.",
      icon: "🛠️"
    }
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className={`relative h-[80vh] min-h-[600px] flex items-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1920")',
              filter: 'brightness(0.4)' 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight">
              Grow a <span className="text-[var(--primary)]">Greener</span> Future with Data
            </h1>
            <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
              Sustainability Council is an AI-powered CSR panel that evaluates your projects 
              through multi-expert lenses to ensure every decision is resilient and ethical.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/council" 
                className="bg-[var(--primary)] text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-green-500/20"
              >
                Start Council Session
              </Link>
              <Link 
                to="/about" 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            {/* Visual Decorative Elements */}
            <div className="relative animate-pulse duration-[4s]">
               <div className="absolute top-0 -left-10 w-64 h-64 bg-[var(--primary)] rounded-full opacity-20 blur-[80px]"></div>
               <div className="absolute bottom-0 -right-10 w-64 h-64 bg-[var(--accent)] rounded-full opacity-20 blur-[80px]"></div>
               <div className="relative z-10 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
                 <div className="grid grid-cols-2 gap-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                   ))}
                 </div>
                 <div className="mt-6 h-8 bg-[var(--primary)] rounded-xl w-3/4 opacity-50"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Sustainability Council?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Our platform combines deep domain expertise with rapid AI processing to deliver boardroom-ready sustainability insights.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass-panel p-10 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-2xl font-bold font-heading mb-4">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Audience */}
      <section className="container mx-auto px-6 py-20 bg-[var(--bg-card)] rounded-[40px] border border-[var(--border)]">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">Built for CSR Leaders</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">🏙️</div>
                <div>
                  <h4 className="font-bold">City Municipalities</h4>
                  <p className="text-gray-400 text-sm">Analyze urban infrastructure projects for community impact and climate resilience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">🏢</div>
                <div>
                  <h4 className="font-bold">Corporate ESG Teams</h4>
                  <p className="text-gray-400 text-sm">Speed up project pre-analysis and generate documentation for stakeholder reporting.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">🎓</div>
                <div>
                  <h4 className="font-bold">University Campuses</h4>
                  <p className="text-gray-400 text-sm">Evaluate sustainability retrofits and renewable transitions across diverse campus needs.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[var(--bg)] p-8 rounded-3xl border border-[var(--border)] shadow-inner">
             <h3 className="text-xl font-bold font-heading mb-6">Business Value</h3>
             <ul className="space-y-4">
               <li className="flex items-start gap-3">
                 <span className="text-primary mt-1">✓</span>
                 <p className="text-sm">Reduces time and cost to compare sustainability options from weeks to seconds.</p>
               </li>
               <li className="flex items-start gap-3">
                 <span className="text-primary mt-1">✓</span>
                 <p className="text-sm">Helps avoid poor or stranded investments by surfacing ESG risks early.</p>
               </li>
               <li className="flex items-start gap-3">
                 <span className="text-primary mt-1">✓</span>
                 <p className="text-sm">Speeds up creation of CSR/ESG documentation for governance and funding.</p>
               </li>
             </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-[var(--primary)] to-green-700 p-16 rounded-[40px] text-white shadow-2xl">
          <h2 className="text-4xl font-bold font-heading mb-6">Ready to make better decisions?</h2>
          <p className="mb-10 text-lg opacity-90">Join hundreds of organizations using AI to drive their sustainability goals.</p>
          <Link 
            to="/council" 
            className="bg-white text-[var(--primary)] px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform"
          >
            Start Your First Session
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
