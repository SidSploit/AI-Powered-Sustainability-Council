
import React, { useState, useEffect } from 'react';
import { 
  runCouncilDebate, 
  getRisksAndOpportunities, 
  getImprovementPlan, 
  getSimpleExplanation, 
  getOnePageReport, 
  getScenarioCoach 
} from '../services/geminiService';
import { 
  CouncilOutput, 
  RisksAndOpportunitiesOutput, 
  ImprovementOutput, 
  SimpleExplanationOutput, 
  ScenarioType, 
  User,
  CSRMetric
} from '../types';
import { PRESET_SCENARIOS } from '../constants';
import FinishSessionOverlay from '../components/Council/FinishSessionOverlay';
import AssistantWidget from '../components/AssistantWidget';

interface CouncilProps {
  user: User | null;
  onShowLogin: () => void;
}

const Council: React.FC<CouncilProps> = ({ user, onShowLogin }) => {
  const [scenario, setScenario] = useState('');
  const [type, setType] = useState(ScenarioType.OTHER);
  const [isDebating, setIsDebating] = useState(false);
  const [results, setResults] = useState<CouncilOutput | null>(null);
  const [risks, setRisks] = useState<RisksAndOpportunitiesOutput | null>(null);
  
  // Tool States
  const [improvements, setImprovements] = useState<ImprovementOutput | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [simpleExplanation, setSimpleExplanation] = useState<SimpleExplanationOutput | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [exportTab, setExportTab] = useState<'text' | 'slides'>('text');
  const [isRisksLoading, setIsRisksLoading] = useState(false);

  const [coachSuggestions, setCoachSuggestions] = useState<string[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'assessment' | 'risks' | 'tools' | 'report'>('assessment');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      onShowLogin();
    }
  }, [user, onShowLogin]);

  const handleRunDebate = async () => {
    if (!scenario.trim()) {
      setError('Please describe your scenario first.');
      return;
    }
    setError('');
    setIsDebating(true);
    setResults(null);
    setRisks(null);
    setImprovements(null);
    setSimpleExplanation(null);
    setReport(null);

    try {
      const output = await runCouncilDebate(scenario, type);
      setResults(output);
      // Automatically run Risks & Opportunities
      setIsRisksLoading(true);
      const riskData = await getRisksAndOpportunities(output);
      setRisks(riskData);
      setIsRisksLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "The council hit a roadblock. Please try again.";
      setError(message);
      console.error("Council error:", err);
    } finally {
      setIsDebating(false);
    }
  };

  const handlePreset = (p: typeof PRESET_SCENARIOS[0]) => {
    setScenario(p.scenario);
    setType(p.type);
    getScenarioCoach(p.scenario).then(setCoachSuggestions);
  };

  const handleImprove = async () => {
    if (!results || isImproving) return;
    setIsImproving(true);
    try {
      const data = await getImprovementPlan(results);
      setImprovements(data);
      setActiveTab('tools');
    } finally {
      setIsImproving(false);
    }
  };

  const handleSimpleExplain = async () => {
    if (!results || isExplaining) return;
    setIsExplaining(true);
    try {
      const data = await getSimpleExplanation(results);
      setSimpleExplanation(data);
      setActiveTab('tools');
    } finally {
      setIsImproving(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!results || isGeneratingReport) return;
    setIsGeneratingReport(true);
    try {
      const text = await getOnePageReport(results);
      setReport(text);
      setActiveTab('report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getDecisionLogText = () => {
    if (!results) return '';
    return `
SUSTAINABILITY COUNCIL DECISION LOG
SCENARIO: ${results.scenario_summary}
ASSUMPTIONS:
${results.assumptions.map(a => `• ${a}`).join('\n')}

CSR ASSESSMENT:
• Environmental: ${results.csr_assessment.environmental.rating} - ${results.csr_assessment.environmental.key_points.join(', ')}
• Social: ${results.csr_assessment.social.rating} - ${results.csr_assessment.social.key_points.join(', ')}
• Governance/Economic: ${results.csr_assessment.governance_economic.rating} - ${results.csr_assessment.governance_economic.key_points.join(', ')}

OPTIONS:
${results.options_and_recommendation.option_summaries.map(o => `${o.option_name}: ${o.description}`).join('\n')}

RECOMMENDED: ${results.options_and_recommendation.recommended_option.name}
REASONING: ${results.options_and_recommendation.recommended_option.reasoning}

TOP RISKS:
${risks?.risks.map(r => `• ${r.label} [${r.horizon}]: ${r.description}`).join('\n') || 'N/A'}

TOP OPPORTUNITIES:
${risks?.opportunities.map(o => `• ${o.label} [${o.horizon}]: ${o.description}`).join('\n') || 'N/A'}
    `.trim();
  };

  const getSlideOutlineText = () => {
    if (!results) return '';
    return `
SLIDE OUTLINE
Slide 1: ${results.scenario_summary.slice(0, 30)}... | Scenario & key assumptions
Slide 2: Stakeholder Perspectives | ${results.personas.slice(0, 3).map(p => p.title).join(', ')}
Slide 3: CSR Assessment | E:${results.csr_assessment.environmental.rating} S:${results.csr_assessment.social.rating} G/E:${results.csr_assessment.governance_economic.rating}
Slide 4: Options Analysis | ${results.options_and_recommendation.option_summaries.map(o => o.option_name).join(' vs ')}
Slide 5: Recommendation | Why ${results.options_and_recommendation.recommended_option.name}
Slide 6: Risks & Next Steps | ${risks?.risks.slice(0, 2).map(r => r.label).join(', ')}
    `.trim();
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Define handleFinish to toggle the completion overlay
  const handleFinish = () => {
    setIsFinishing(true);
  };

  const resetSession = () => {
    setResults(null);
    setScenario('');
    setType(ScenarioType.OTHER);
    setIsFinishing(false);
    setRisks(null);
    setImprovements(null);
    setSimpleExplanation(null);
    setReport(null);
    setCoachSuggestions([]);
    setActiveTab('assessment');
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h2 className="text-2xl font-bold mb-4">Login Required</h2>
      <p className="text-gray-400 max-w-md mb-8">Please log in to access the Sustainability Council and run your assessment.</p>
      <button onClick={onShowLogin} className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold">Login to Continue</button>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Side: Input */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">📝</span>
              Step 1: Scenario
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Scenario Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as ScenarioType)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 text-[var(--text)] outline-none focus:ring-2 focus:ring-primary">
                  {Object.values(ScenarioType).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                <textarea value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="Describe your project site, scale, and stakeholders..." className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 text-[var(--text)] h-48 outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              {coachSuggestions.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <h4 className="text-[10px] font-bold text-primary uppercase mb-2">Coach Suggestions:</h4>
                  <ul className="text-xs space-y-1 text-gray-400">
                    {coachSuggestions.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button onClick={handleRunDebate} disabled={isDebating} className={`w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl shadow-lg transition-all ${isDebating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}>
                {isDebating ? 'Step 2: Convening Council...' : 'Run Council Debate'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase px-2">Presets</h3>
            <div className="grid gap-3">
              {PRESET_SCENARIOS.map((p, i) => (
                <button key={i} onClick={() => handlePreset(p)} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl text-left hover:bg-primary/5 transition-all group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{p.title}</span>
                    {p.featured && <span className="bg-primary/20 text-primary text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Demo</span>}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{p.scenario}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Results & Step 4 Tools */}
        <div className="lg:col-span-8">
          {!results && !isDebating && (
            <div className="h-full flex flex-col items-center justify-center bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-3xl p-12 text-center text-gray-500">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl mb-6">🏛️</div>
              <h3 className="text-xl font-bold font-heading mb-2">Step 3: Council Insights</h3>
              <p className="max-w-sm">Launch a session to receive expert multi-persona analysis and CSR assessment.</p>
            </div>
          )}

          {isDebating && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
               <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
               <h3 className="text-2xl font-bold font-heading mb-4">The Council is Convening...</h3>
               <p className="text-gray-400 animate-pulse">Debating trade-offs across 7 domains.</p>
            </div>
          )}

          {results && (
            <div className="space-y-8 animate-fadeIn">
              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {(['assessment', 'risks', 'tools', 'report'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-card)] text-gray-400 border border-[var(--border)] hover:border-primary'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Main Content Areas */}
              {activeTab === 'assessment' && (
                <div className="space-y-8">
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold font-heading mb-4">Council Summary</h2>
                    <p className="text-gray-400 mb-6">{results.scenario_summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {results.assumptions.map((a, i) => (
                        <span key={i} className="bg-[var(--bg)] px-3 py-1 rounded-full text-xs text-gray-500 border border-[var(--border)]">• {a}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {results.personas.map((p, i) => (
                      <div key={p.id} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                        <h4 className="font-bold text-primary mb-2">{p.title}</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {p.primary_concerns.map(c => <span key={c} className="text-[8px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{c}</span>)}
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed italic">"{p.statement}"</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-3xl">
                    <h3 className="text-xl font-bold font-heading mb-6">CSR Assessment</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {(Object.entries(results.csr_assessment) as [string, CSRMetric][]).map(([key, data]) => (
                        <div key={key} className="bg-[var(--bg)] p-6 rounded-2xl border border-[var(--border)]">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold uppercase text-gray-500">{key.replace('_', ' ')}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${data.rating === 'High' ? 'bg-green-500/20 text-green-500' : data.rating === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                              {data.rating}
                            </span>
                          </div>
                          <ul className="space-y-2 text-[11px] text-gray-400">
                            {data.key_points.map((p, i) => <li key={i}>• {p}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--primary)] text-white p-8 rounded-3xl shadow-xl shadow-green-500/10">
                    <h3 className="text-xl font-bold font-heading mb-2">Recommended Option</h3>
                    <h4 className="text-2xl font-bold mb-4">{results.options_and_recommendation.recommended_option.name}</h4>
                    <p className="opacity-90 leading-relaxed">{results.options_and_recommendation.recommended_option.reasoning}</p>
                  </div>
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="space-y-6">
                  {isRisksLoading ? (
                    <div className="p-12 text-center animate-pulse">Evaluating risks & opportunities...</div>
                  ) : risks ? (
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <h3 className="text-xl font-bold font-heading text-red-500 flex items-center gap-2">⚠️ Key Risks</h3>
                          {risks.risks.map((r, i) => (
                            <div key={i} className="bg-[var(--bg-card)] border border-red-500/10 p-5 rounded-2xl">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-sm">{r.label}</h4>
                                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${r.horizon === 'short-term' ? 'bg-red-500/10 text-red-500' : r.horizon === 'medium-term' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {r.horizon}
                                  </span>
                               </div>
                               <p className="text-xs text-gray-400">{r.description}</p>
                            </div>
                          ))}
                       </div>
                       <div className="space-y-6">
                          <h3 className="text-xl font-bold font-heading text-green-500 flex items-center gap-2">🌱 Key Opportunities</h3>
                          {risks.opportunities.map((o, i) => (
                            <div key={i} className="bg-[var(--bg-card)] border border-green-500/10 p-5 rounded-2xl">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-sm">{o.label}</h4>
                                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${o.horizon === 'short-term' ? 'bg-red-500/10 text-red-500' : o.horizon === 'medium-term' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {o.horizon}
                                  </span>
                               </div>
                               <p className="text-xs text-gray-400">{o.description}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Step 4 Tools Grid */}
              <div className="pt-8 border-t border-[var(--border)] space-y-8">
                <div>
                  <h3 className="text-lg font-bold font-heading mb-4 text-[var(--text)]">Step 4: Refine, explain, document, and export</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <button onClick={handleImprove} disabled={isImproving} className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl hover:border-primary transition-all text-xs font-bold group">
                      {isImproving ? <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> : <span className="text-xl group-hover:scale-110 transition-transform">⭐</span>}
                      Improve
                    </button>
                    <button onClick={handleSimpleExplain} disabled={isExplaining} className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl hover:border-primary transition-all text-xs font-bold group">
                      {isExplaining ? <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> : <span className="text-xl group-hover:scale-110 transition-transform">💬</span>}
                      Explain
                    </button>
                    <button onClick={handleGenerateReport} disabled={isGeneratingReport} className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl hover:border-primary transition-all text-xs font-bold group">
                      {isGeneratingReport ? <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> : <span className="text-xl group-hover:scale-110 transition-transform">📄</span>}
                      Report
                    </button>
                    <button onClick={() => { setActiveTab('tools'); setExportTab('text'); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl hover:border-primary transition-all text-xs font-bold group">
                      <span className="text-xl group-hover:scale-110 transition-transform">📋</span>
                      Decision Log
                    </button>
                    <button onClick={() => setActiveTab('risks')} className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl hover:border-primary transition-all text-xs font-bold group">
                      <span className="text-xl group-hover:scale-110 transition-transform">⚠️</span>
                      Risks
                    </button>
                    <button onClick={handleFinish} className="flex flex-col items-center justify-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl hover:bg-green-500/20 transition-all text-xs font-bold group text-green-500">
                      <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
                      Finish
                    </button>
                  </div>
                </div>

                {activeTab === 'tools' && (
                  <div className="space-y-6 animate-fadeIn">
                    {improvements && (
                      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl">
                        <h4 className="font-bold mb-4 text-primary">Improvement Suggestions</h4>
                        <p className="text-sm text-gray-400 mb-6 italic">{improvements.intro}</p>
                        <div className="space-y-4">
                          {improvements.suggestions.map((s, i) => (
                            <div key={i} className="bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)]">
                              <p className="text-sm font-medium mb-2">{s.text}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {s.dimensions.map(d => <span key={d} className="bg-primary/10 text-primary text-[8px] font-bold px-2 py-0.5 rounded uppercase">{d}</span>)}
                              </div>
                              {s.trade_offs && <p className="text-[10px] text-gray-500 italic">Trade-off: {s.trade_offs}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {simpleExplanation && (
                      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-6">
                           <h4 className="font-bold text-primary">Simple Explanation</h4>
                           <button onClick={() => handleCopyText(simpleExplanation.explanation)} className="text-xs text-primary hover:underline">Copy text</button>
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{simpleExplanation.explanation}</p>
                          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                            <h5 className="text-[10px] font-bold text-primary uppercase mb-2">Stakeholder Highlight:</h5>
                            <p className="text-xs text-gray-500 leading-relaxed italic">{simpleExplanation.role_based_summary}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-primary">Export Decision Log</h4>
                        <div className="flex gap-2">
                           <button onClick={() => setExportTab('text')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${exportTab === 'text' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>Text Log</button>
                           <button onClick={() => setExportTab('slides')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${exportTab === 'slides' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>Slide Outline</button>
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg)] p-6 rounded-2xl border border-[var(--border)] font-mono text-xs text-gray-400 relative">
                        <pre className="whitespace-pre-wrap leading-relaxed h-64 overflow-y-auto">
                          {exportTab === 'text' ? getDecisionLogText() : getSlideOutlineText()}
                        </pre>
                        <button 
                          onClick={() => handleCopyText(exportTab === 'text' ? getDecisionLogText() : getSlideOutlineText())}
                          className="absolute top-4 right-4 bg-primary text-white p-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
                        >
                          📋 Copy
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-4 italic">Saves teams hours preparing governance documents and stakeholder presentations.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'report' && report && (
                  <div className="bg-white text-black p-10 rounded-lg shadow-2xl font-serif max-w-4xl mx-auto animate-fadeIn relative overflow-hidden">
                    <button onClick={() => handleCopyText(report)} className="absolute top-6 right-6 text-xs bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">Copy Full Report</button>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">{report}</pre>
                    <div className="mt-12 pt-8 border-t border-gray-200 text-[10px] text-gray-400 flex justify-between uppercase tracking-widest">
                       <span>Official Analysis</span>
                       <span>Date: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 text-[9px] text-gray-300 italic">Ready for board packs, funding proposals, or stakeholder updates.</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isFinishing && (
        <FinishSessionOverlay onNew={resetSession} onBack={() => setIsFinishing(false)} />
      )}

      <AssistantWidget context={results || undefined} />
    </div>
  );
};

export default Council;
