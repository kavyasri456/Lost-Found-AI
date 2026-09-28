import React, { useState } from 'react';
import { Sparkles, Menu, X, PlusCircle, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'browse' | 'report' | 'ai-matches';
  setActiveTab: (tab: 'home' | 'browse' | 'report' | 'ai-matches') => void;
  onOpenReportModal?: (initialType?: 'lost' | 'found') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'browse' | 'report' | 'ai-matches') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single Brand element */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Lost & Found AI
              </span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                Campus Recovery Network
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1 -mb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('browse')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1 -mb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => handleNavClick('ai-matches')}
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'ai-matches'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1 -mb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>AI Matches</span>
            </button>
            <button
              onClick={() => handleNavClick('report')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'report'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1 -mb-1'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Report Item
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenReportModal) {
                  onOpenReportModal('lost');
                } else {
                  handleNavClick('report');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs active:translate-y-px whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Item</span>
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('browse')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'browse' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Browse All Items
          </button>
          <button
            onClick={() => handleNavClick('ai-matches')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
              activeTab === 'ai-matches' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              AI Matching Engine
            </span>
          </button>
          <button
            onClick={() => handleNavClick('report')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'report' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Report Lost or Found Item
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                handleNavClick('report');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <PlusCircle className="w-4 h-4" />
              Report an Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
