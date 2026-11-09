import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { ArrowRight, Menu, Shield, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = api.getCurrentUser();

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09111F]/80 backdrop-blur-md border-b border-border-subtle/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Mark */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-accent-primary/10 border border-accent-primary/40 flex items-center justify-center shadow-[0_0_12px_rgba(56,214,197,0.2)] group-hover:border-accent-primary transition-all">
            <Shield className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-text-primary">
              Secu<span className="text-accent-primary">Track</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.2 ml-2 rounded bg-bg-elevated text-accent-secondary border border-border-default">
              v2.4 Core
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-secondary">
          <button
            onClick={() => handleNavClick('overview')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('capabilities')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => handleNavClick('risk-intelligence')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Risk Intelligence
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Security Workflow
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={() => {
                api.logout();
                navigate('/login');
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-status-critical border border-border-default rounded-lg hover:bg-bg-elevated transition-colors"
            >
              Sign Out ({currentUser.username})
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber transition-all hover:shadow-[0_0_20px_rgba(56,214,197,0.35)] cursor-pointer"
          >
            <span>{currentUser ? 'Open Dashboard' : 'Explore Platform'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-default bg-[#0C1628] px-4 pt-3 pb-5 space-y-3">
          <button
            onClick={() => handleNavClick('overview')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('capabilities')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Capabilities
          </button>
          <button
            onClick={() => handleNavClick('risk-intelligence')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Risk Intelligence
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Security Workflow
          </button>
          <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-center text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Sign In
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/app');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber"
            >
              Enter SecuTrack
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

