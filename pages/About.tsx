
import React from 'react';
import { PERSONA_DEFINITIONS } from '../constants';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 space-y-20 max-w-5xl">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">About the Council</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Sustainability is complex. We simplify it by simulating a multi-stakeholder 
          discussion, ensuring you see the big picture before committing resources.
        </p>
      </section>

      <section className="space-y-12">
        <h2 className="text-3xl font-bold font-heading text-center">The Experts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONA_DEFINITIONS.map((p) => (
            <div key={p.id} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[var(--primary)] mb-2">{p.title}</h3>
              <p className="text-sm text-gray-400">
                <span className="font-semibold block mb-1 text-gray-500 uppercase text-[10px]">What I care about:</span>
                {p.care}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--bg-card)] border border-[var(--border)] p-12 rounded-[40px] space-y-8">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-4">Methodology</h2>
            <p className="text-gray-400 leading-relaxed">
              When you submit a scenario, our system activates seven specialized AI agents 
              grounded in CSR frameworks. They analyze the proposal against Environmental, 
              Social, and Governance (ESG) criteria, debating trade-offs in real-time to 
              generate a balanced assessment.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-heading mb-4">Security & Privacy</h2>
            <p className="text-gray-400 leading-relaxed">
              The Sustainability Council does not collect or store passwords or sensitive personal data. 
              AI outputs are for decision-support only and must not replace expert, legal, or financial advice. 
              Scenarios are processed in real-time and not used for training models outside your session.
            </p>
          </div>

          <div className="pt-8 border-t border-[var(--border)]">
            <h3 className="text-xl font-bold font-heading mb-2">Responsible Use</h3>
            <p className="text-sm text-gray-500 italic">
              Recommendations are advisory. The final responsibility for project implementation 
              and legal compliance rests with the user and their organization.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
