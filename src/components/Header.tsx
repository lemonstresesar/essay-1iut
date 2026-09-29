import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';
import {
  FileText,
  Search,
  PlusCircle,
  ShieldCheck,
  Mail,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'deposer' | 'suivi' | 'admin';
  onNavigate: (view: 'home' | 'deposer' | 'suivi' | 'admin') => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  lang,
  onToggleLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'deposer' | 'suivi' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0f2544] text-white shadow-md border-b border-[#1b365d]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white shadow-md border border-white/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                {t(lang, 'brandTitle')}
              </span>
              <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[#182638] text-[#93c5fd] border border-[#2563eb]/40">
                {t(lang, 'brandSubtitle')}
              </span>
            </div>
            <span className="text-[11px] text-[#94a3b8] hidden sm:block leading-none mt-0.5">
              {t(lang, 'brandCountry')}
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#182638]/90 p-1.5 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => handleNav('home')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              currentView === 'home'
                ? 'bg-white text-[#0f2544] shadow-sm font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
            }`}
          >
            {t(lang, 'navHome')}
          </button>

          <button
            onClick={() => handleNav('deposer')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentView === 'deposer'
                ? 'bg-[#2563eb] text-white shadow-sm font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#93c5fd]" />
            <span>{t(lang, 'navSubmit')}</span>
          </button>

          <button
            onClick={() => handleNav('suivi')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentView === 'suivi'
                ? 'bg-white text-[#0f2544] shadow-sm font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t(lang, 'navTrack')}</span>
          </button>

          <button
            onClick={() => handleNav('admin')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentView === 'admin'
                ? 'bg-[#1e3a8a] text-white shadow-sm font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t(lang, 'navAdmin')}</span>
          </button>
        </nav>

        {/* Right Section: Email + Language Switcher + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Institutional Contact Mini Chip */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#182638] text-xs text-[#94a3b8] border border-white/5">
            <Mail className="w-3.5 h-3.5 text-[#2563eb]" />
            <span className="font-mono-matricule text-[11px] text-slate-300">
              {t(lang, 'contactEmail')}
            </span>
          </div>

          {/* Bilingual Switcher FR | EN */}
          <div className="flex items-center bg-[#182638] p-0.5 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => onToggleLang('FR')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                lang === 'FR'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('EN')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                lang === 'EN'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#182638] text-[#94a3b8] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d1c2e] border-t border-[#1b365d] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'home'
                ? 'bg-white text-[#0f2544]'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t(lang, 'navHome')}</span>
          </button>

          <button
            onClick={() => handleNav('deposer')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'deposer'
                ? 'bg-[#2563eb] text-white'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>{t(lang, 'navSubmit')}</span>
          </button>

          <button
            onClick={() => handleNav('suivi')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'suivi'
                ? 'bg-white text-[#0f2544]'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{t(lang, 'navTrack')}</span>
          </button>

          <button
            onClick={() => handleNav('admin')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'admin'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{t(lang, 'navAdmin')}</span>
          </button>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Guichet: Pavillon A, Campus Ndogbong</span>
            <span className="font-mono-matricule">+237 233 40 24 82</span>
          </div>
        </div>
      )}
    </header>
  );
};
