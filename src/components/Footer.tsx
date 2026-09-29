import React from 'react';
import { Compass, ShieldCheck, Heart, RotateCcw } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'browse' | 'report' | 'ai-matches') => void;
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onResetData }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Lost & Found AI
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              A student-first campus platform dedicated to reuniting university members with their lost belongings
              through intelligent text matching and verified safe exchange hubs.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Security & Student Life Approved Safety Protocol</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Browse Campus Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-matches')}
                  className="hover:text-blue-600 transition-colors"
                >
                  AI Matching Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-blue-600 transition-colors"
                >
                  File Lost or Found Report
                </button>
              </li>
              <li>
                <a
                  href="/training_dataset.json"
                  download="lost_and_found_training.json"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Download Agent Dataset</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">JSON</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Handover Stations & Reset */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Campus Handover Hubs
            </h4>
            <p className="text-xs text-slate-600 leading-snug">
              Official pickup desks located at Main Library Level 1, Student Union Welcome Desk, and Campus Rec Front Counter.
            </p>
            <div className="pt-2">
              <button
                onClick={onResetData}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
                title="Restore default campus sample items"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Sample Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Lost & Found AI · University Student Belongings Recovery
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by intelligent NLP heuristics & campus coordinate correlation
          </div>
        </div>
      </div>
    </footer>
  );
};
