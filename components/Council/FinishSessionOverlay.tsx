
import React, { useEffect, useState } from 'react';

interface FinishSessionOverlayProps {
  onNew: () => void;
  onBack: () => void;
}

const FinishSessionOverlay: React.FC<FinishSessionOverlayProps> = ({ onNew, onBack }) => {
  const [showTrees, setShowTrees] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTrees(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="relative h-48 w-full mb-8 overflow-hidden bg-gray-900 rounded-2xl border border-white/10 shadow-inner">
          {/* City Outline */}
          <div className="absolute bottom-0 w-full h-12 bg-gray-800 opacity-50 flex items-end justify-around px-4">
             <div className="w-8 h-16 bg-gray-700"></div>
             <div className="w-12 h-24 bg-gray-700"></div>
             <div className="w-10 h-20 bg-gray-700"></div>
             <div className="w-14 h-28 bg-gray-700"></div>
          </div>
          
          {/* Animated Trees */}
          {showTrees && (
            <div className="absolute inset-0 flex items-end justify-center gap-4 px-8 pb-1">
              {[1,2,3,4,5,6].map((i) => (
                <div 
                  key={i}
                  className="w-4 bg-[var(--primary)] tree-animate rounded-t-full"
                  style={{ 
                    height: `${20 + Math.random() * 60}%`, 
                    animationDelay: `${i * 0.2}s` 
                  }}
                >
                  <div className="absolute -top-4 -left-1 w-6 h-6 bg-[var(--accent)] rounded-full opacity-40 blur-sm"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-white font-heading mb-4">🎉 Session Complete</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">
          You explored this decision from multiple sustainability angles. 
          Each better-informed choice grows a greener future.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onNew}
            className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-green-500/20"
          >
            Start a New Scenario
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-white/5 text-white py-4 rounded-xl font-medium border border-white/10 hover:bg-white/10 transition-colors"
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishSessionOverlay;
