
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import { Theme, User } from './types';
import Home from './pages/Home';
import About from './pages/About';
import Council from './pages/Council';
import Logo from './components/Logo';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || Theme.DARK;
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === Theme.DARK ? Theme.LIGHT : Theme.DARK);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email, loggedIn: true };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg)]/80 backdrop-blur-lg border-b border-[var(--border)] z-50 px-6">
          <div className="container mx-auto h-full flex items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-1 font-medium">
              <NavLink 
                to="/" 
                className={({ isActive }) => `px-4 py-2 rounded-full transition-all ${isActive ? 'bg-[var(--primary)] text-white' : 'hover:bg-primary/10'}`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/council" 
                className={({ isActive }) => `px-4 py-2 rounded-full transition-all ${isActive ? 'bg-[var(--primary)] text-white' : 'hover:bg-primary/10'}`}
              >
                Council
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `px-4 py-2 rounded-full transition-all ${isActive ? 'bg-[var(--primary)] text-white' : 'hover:bg-primary/10'}`}
              >
                About
              </NavLink>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[var(--border)] transition-colors text-xl"
                aria-label="Toggle Theme"
              >
                {theme === Theme.DARK ? '☀️' : '🌙'}
              </button>

              {user ? (
                <div className="group relative">
                  <button className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center hover:ring-4 ring-primary/20 transition-all">
                    {getInitials(user.name)}
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                    <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route 
              path="/council" 
              element={<Council user={user} onShowLogin={() => setIsLoginOpen(true)} />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-[var(--bg-card)] border-t border-[var(--border)] py-12 px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="col-span-2 space-y-4">
                <Logo size="lg" />
                <p className="text-gray-400 max-w-sm">
                  The Sustainability Council is an innovative CSR decision-support tool helping organizations 
                  visualize and act on sustainability challenges with expert precision.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li><Link to="/council" className="hover:text-primary">Council Session</Link></li>
                  <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-primary">Responsible AI</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-[var(--border)] text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Sustainability Council. Powered by Gemini. All rights reserved.
            </div>
          </div>
        </footer>

        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onLogin={handleLogin} 
        />
      </div>
    </Router>
  );
};

export default App;
