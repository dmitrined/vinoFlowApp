/**
 * НАЗНАЧЕНИЕ: Интерактивная инструкция по установке PWA
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion
 * ОСОБЕННОСТИ: Адаптивный выбор платформы (Desktop vs Mobile), раскрывающиеся инструкции
 */

'use client';

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Monitor, 
  Apple, 
  Info,
  Download
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type Platform = 'ios' | 'android' | 'windows' | 'mac';

export const PwaGuide = () => {
  const t = useTranslations('Pwa');
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const platforms: { id: Platform; icon: React.ReactNode; label: string; desktopOnly?: boolean; mobileOnly?: boolean }[] = [
    { id: 'ios', icon: <Apple size={24} />, label: t('platforms.ios'), mobileOnly: true },
    { id: 'android', icon: <Smartphone size={24} />, label: t('platforms.android'), mobileOnly: true },
    { id: 'windows', icon: <Monitor size={24} />, label: t('platforms.windows'), desktopOnly: true },
    { id: 'mac', icon: <Apple size={24} />, label: t('platforms.mac'), desktopOnly: true },
  ];

  const filteredPlatforms = platforms.filter(p => {
    if (isDesktop) return !p.mobileOnly;
    return !p.desktopOnly;
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-tech-gradient italic">
          {t('title')}
        </h2>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest opacity-60">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredPlatforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(selectedPlatform === p.id ? null : p.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all border-2 border-transparent ${
              selectedPlatform === p.id 
                ? "bg-brand-600 text-white shadow-xl shadow-brand-500/20 scale-[1.02]" 
                : "bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 hover:border-brand-500/30"
            }`}
          >
            <div className={`mb-3 p-3 rounded-2xl ${selectedPlatform === p.id ? 'bg-white/20' : 'bg-white dark:bg-zinc-800 shadow-sm'}`}>
              {p.icon}
            </div>
            <span className="font-black uppercase tracking-widest text-[10px]">{p.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedPlatform && (
          <m.div
            key={selectedPlatform}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-500/5 border border-brand-500/10 rounded-[2.5rem] p-8 mt-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-600 text-white rounded-lg">
                  <Download size={18} />
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs text-brand-600">
                  {t('instructions-title', { platform: t(`platforms.${selectedPlatform}`) })}
                </h3>
              </div>
              
              <div className="space-y-4">
                {t(`instructions.${selectedPlatform}`).split('\n').map((step, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="flex-none w-6 h-6 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-[10px] font-black group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold leading-relaxed">
                      {step.substring(step.indexOf(' ') + 1)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-brand-500/10 flex items-center gap-2 text-brand-600/60 italic">
                <Info size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">VinoFlow PWA Technology</span>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
