
import React, { useState } from 'react';
import { validateEmail, validateOTP, sanitizeInput } from '../utils/sanitization';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOTP(otp)) {
      setError('Enter a valid 6-digit code.');
      return;
    }
    onLogin(sanitizeInput(name), sanitizeInput(email));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-[var(--text)]">
            {step === 1 ? 'Join the Council' : 'Verify Account'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {step === 1 ? 'Enter your details to access session data.' : 'A dummy code was "sent" to your email.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 text-[var(--text)] focus:ring-2 focus:ring-primary outline-none"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 text-[var(--text)] focus:ring-2 focus:ring-primary outline-none"
                placeholder="jane@example.com"
              />
            </div>
            <button className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">6-Digit OTP</label>
              <input 
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 text-[var(--text)] text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-primary outline-none"
                placeholder="000000"
              />
            </div>
            <p className="text-[10px] text-gray-500 italic">
              Note: This is a demonstration flow. Any 6-digit number will work.
            </p>
            <button className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all">
              Verify & Log In
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-xs text-primary hover:underline"
            >
              Back to info
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
