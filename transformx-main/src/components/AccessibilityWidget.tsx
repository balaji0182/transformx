import React, { useState, useEffect } from 'react';
import {
  Accessibility,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Globe,
  Keyboard,
  X,
  Type,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/translations';

interface AccessibilityWidgetProps {
  theme: 'gov-light' | 'gov-dark';
  onToggleTheme: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({
  theme,
  onToggleTheme,
  fontSize,
  onChangeFontSize,
  language,
  onChangeLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isDark = theme === 'gov-dark';
  const t = translations[language];

  // Listen for Ctrl+F2 keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'F2') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `TransformX Content Transformation Platform. Transform the communication, not the facts. Current language is ${
        language === 'TA' ? 'Tamil' : 'English'
      }. Use this platform to transform trusted documents into audience specific formats with verified source grounding.`;
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language === 'TA' ? 'ta-IN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <>
      {/* Floating Accessibility Trigger Button (Matches Reference Image) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 cursor-pointer"
          title="Accessibility Options (Ctrl+F2)"
          aria-label="Open Accessibility Menu (Ctrl+F2)"
        >
          <Accessibility className="w-6 h-6 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 text-[9px] font-mono font-bold bg-indigo-900 text-indigo-200 px-1 py-0.2 rounded-full border border-indigo-400/40">
            Ctrl+F2
          </span>
        </button>
      </div>

      {/* Accessibility Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white shadow-black/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility Options"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Accessibility className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {t.accessibilityMenu}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    UX4G &amp; WCAG 2.1 AA Compliant Controls
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* 1. Language Toggle */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  Language / மொழி
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onChangeLanguage('EN')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      language === 'EN'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>English</span>
                    {language === 'EN' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onChangeLanguage('TA')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      language === 'TA'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>தமிழ் (Tamil)</span>
                    {language === 'TA' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 2. Text Scaling */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-500" />
                  {t.textSize}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onChangeFontSize('normal')}
                    className={`py-2 px-2 rounded-lg border font-bold text-xs text-center transition-all ${
                      fontSize === 'normal'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Standard (A)
                  </button>
                  <button
                    onClick={() => onChangeFontSize('large')}
                    className={`py-2 px-2 rounded-lg border font-bold text-xs text-center transition-all ${
                      fontSize === 'large'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Large (A+)
                  </button>
                  <button
                    onClick={() => onChangeFontSize('xlarge')}
                    className={`py-2 px-2 rounded-lg border font-bold text-xs text-center transition-all ${
                      fontSize === 'xlarge'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    X-Large (A++)
                  </button>
                </div>
              </div>

              {/* 3. Theme & Contrast */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  Color Theme &amp; Contrast
                </label>
                <button
                  onClick={onToggleTheme}
                  className={`w-full py-2.5 px-3 rounded-lg border font-semibold flex items-center justify-between transition-all ${
                    isDark
                      ? 'bg-slate-800 text-amber-300 border-slate-700'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                    <span>{isDark ? 'Switch to Clean Light Theme' : 'Switch to Dark Mode'}</span>
                  </span>
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                    {isDark ? 'Dark Active' : 'Light Active'}
                  </span>
                </button>
              </div>

              {/* 4. Text to Speech Reader */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                  {t.screenReader}
                </label>
                <button
                  onClick={handleToggleSpeech}
                  className={`w-full py-2.5 px-3 rounded-lg border font-semibold flex items-center justify-between transition-all ${
                    isSpeaking
                      ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                      : isDark
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-500" />}
                    <span>{isSpeaking ? 'Stop Audio Narration' : 'Read Page Summary Aloud'}</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase font-bold opacity-75">
                    {isSpeaking ? 'Playing' : 'Audio Engine'}
                  </span>
                </button>
              </div>

              {/* 5. Keyboard Navigation Guide */}
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t.shortcuts}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                  <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">Ctrl+F2</kbd> Toggle Menu</div>
                  <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">1 - 6</kbd> Pipeline Steps</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Close Options
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
