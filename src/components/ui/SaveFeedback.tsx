'use client';

import React from 'react';
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SaveFeedbackProps {
    show: boolean;
}

const SaveFeedback: React.FC<SaveFeedbackProps> = ({ show }) => {
    const t = useTranslations('Calculators');

    return (
        <AnimatePresence>
            {show && (
                <m.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="fixed bottom-24 right-8 z-[100] flex items-center gap-3 px-6 py-3 bg-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-2xl shadow-brand-500/20"
                >
                    <div className="p-1 bg-brand-500 rounded-full text-white">
                        <CheckCircle2 size={18} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">
                        {t('saved')}
                    </span>
                </m.div>
            )}
        </AnimatePresence>
    );
};

export default SaveFeedback;
