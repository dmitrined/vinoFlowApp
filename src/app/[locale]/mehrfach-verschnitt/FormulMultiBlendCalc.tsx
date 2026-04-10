/**
 * НАЗНАЧЕНИЕ: Сложный купаж (Множественный ассамбляж) в стиле Tech SaaS
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion, @/lib/calculations
 * ОСОБЕННОСТИ: Динамическое добавление/удаление партий, i18n, расчет средневзвешенного.
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
  Tooltip
} from "@heroui/react";
import {
  Layers,
  Beaker,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Zap,
  Droplets,
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { calcMultiBlended } from '@/lib/calculations';
import FormulMultiCalc from './FormulMultiCalc';
import { useHistoryAutoSave } from '@/hooks/useHistoryAutoSave';
import SaveFeedback from '@/components/ui/SaveFeedback';

interface WineEntry {
  liter: string;
  sugar: string;
  alcohol: string;
}

const FormulMultiBlendCalc: React.FC = () => {
  const t = useTranslations('Calculators.mehrfach');
  const commonT = useTranslations('Calculators');

  const [showFormula, setShowFormula] = useState(false);
  const [wines, setWines] = useState<WineEntry[]>(
    Array(3).fill(null).map(() => ({ liter: '', sugar: '', alcohol: '' }))
  );

  const handleInputChange = (index: number, field: keyof WineEntry, value: string) => {
    const newWines = [...wines];
    newWines[index][field] = value;
    setWines(newWines);
  };

  const addWine = () => {
    setWines([...wines, { liter: '', sugar: '', alcohol: '' }]);
  };

  const removeWine = (index: number) => {
    if (wines.length > 1) {
      setWines(wines.filter((_, i) => i !== index));
    }
  };

  // Расчет результатов "на лету"
  const results = useMemo(() => {
    const entriesSugar = wines.map(w => ({
      liter: parseFloat(w.liter.replace(',', '.')) || 0,
      parameter: parseFloat(w.sugar.replace(',', '.')) || 0
    }));

    const entriesAlc = wines.map(w => ({
      liter: parseFloat(w.liter.replace(',', '.')) || 0,
      parameter: parseFloat(w.alcohol.replace(',', '.')) || 0
    }));

    const totalLiters = entriesSugar.reduce((acc, curr) => acc + curr.liter, 0);

    return {
      totalLiters,
      avgSugar: calcMultiBlended(entriesSugar),
      avgAlcohol: calcMultiBlended(entriesAlc)
    };
  }, [wines]);

  // Авто-сохранение в историю через хук
  const { showFeedback } = useHistoryAutoSave(
    [
        results.avgSugar > 0 ? {
            type: 'mehrfach',
            result: results.avgSugar.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            unit: 'g/l SR'
        } : null,
        results.avgAlcohol > 0 ? {
            type: 'mehrfach',
            result: results.avgAlcohol.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            unit: 'g/l Alc'
        } : null
    ],
    results.totalLiters > 0,
    3000
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <Card className="bento-card border-none shadow-none mb-8">
          <CardHeader className="flex gap-5 p-8 sm:p-10">
            <div className="p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20">
              <Layers size={32} />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-3xl font-black tracking-tight text-tech-gradient uppercase italic">
                {t('title')}
              </h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60">
                {t('subtitle')}
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-8 sm:p-10 space-y-10 pt-0">
            
            {/* Итоговые блоки в Bento-сетке */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none bg-zinc-950 text-white rounded-[2rem] shadow-none overflow-hidden relative h-32" shadow="none">
                    <CardBody className="p-6 flex flex-col justify-center relative z-10">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">{t('total-vol')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter transition-all">
                                {results.totalLiters.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-sm font-black text-brand-500 uppercase italic">L</span>
                        </div>
                    </CardBody>
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <Droplets size={80} />
                    </div>
                </Card>

                <Card className="border-none bg-zinc-100 dark:bg-zinc-800/50 rounded-[2rem] shadow-none overflow-hidden relative h-32" shadow="none">
                    <CardBody className="p-6 flex flex-col justify-center relative z-10">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 uppercase italic">{t('avg-sugar')}</span>
                        <div className="flex items-baseline gap-2 text-zinc-800 dark:text-white">
                            <span className="text-4xl font-black tracking-tighter">
                                {results.avgSugar.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-sm font-black text-brand-600 uppercase italic">g/l</span>
                        </div>
                    </CardBody>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Zap size={60} className="text-brand-500" />
                    </div>
                </Card>

                <Card className="border-none bg-zinc-100 dark:bg-zinc-800/50 rounded-[2rem] shadow-none overflow-hidden relative h-32" shadow="none">
                    <CardBody className="p-6 flex flex-col justify-center relative z-10">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 uppercase italic">{t('avg-alcohol')}</span>
                        <div className="flex items-baseline gap-2 text-zinc-800 dark:text-white">
                            <span className="text-4xl font-black tracking-tighter">
                                {results.avgAlcohol.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-sm font-black text-brand-600 uppercase italic">g/l</span>
                        </div>
                    </CardBody>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Beaker size={60} className="text-brand-500" />
                    </div>
                </Card>
            </div>

            <Divider className="bg-zinc-100 dark:bg-zinc-800" />

            {/* Динамический список вин */}
            <div className="space-y-4">
              <LayoutGroup>
                <AnimatePresence>
                  {wines.map((wine, index) => (
                    <motion.div
                      layout
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-transparent hover:border-brand-500/20 transition-all shadow-sm"
                    >
                      <div className="md:col-span-1 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-zinc-400 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-inner">
                          {index + 1}
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <Input
                          label={t('input-vol')}
                          placeholder="0,00"
                          variant="flat"
                          radius="lg"
                          size="lg"
                          value={wine.liter}
                          onValueChange={(v) => handleInputChange(index, 'liter', v)}
                          inputMode="decimal"
                          classNames={{
                              inputWrapper: "bg-white dark:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500",
                              label: "font-black uppercase text-[10px] tracking-widest text-zinc-400 mb-1"
                          }}
                          endContent={<span className="text-zinc-300 font-black text-[9px]">VOL (L)</span>}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Input
                          label={t('input-sugar')}
                          placeholder="0,00"
                          variant="flat"
                          radius="lg"
                          size="lg"
                          value={wine.sugar}
                          onValueChange={(v) => handleInputChange(index, 'sugar', v)}
                          inputMode="decimal"
                          classNames={{
                              inputWrapper: "bg-white dark:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500",
                              label: "font-black uppercase text-[10px] tracking-widest text-zinc-400 mb-1"
                          }}
                          endContent={<span className="text-zinc-300 font-black text-[9px]">SR (g/l)</span>}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Input
                          label={t('input-alcohol')}
                          placeholder="0,00"
                          variant="flat"
                          radius="lg"
                          size="lg"
                          value={wine.alcohol}
                          onValueChange={(v) => handleInputChange(index, 'alcohol', v)}
                          inputMode="decimal"
                          classNames={{
                              inputWrapper: "bg-white dark:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500",
                              label: "font-black uppercase text-[10px] tracking-widest text-zinc-400 mb-1"
                          }}
                          endContent={<span className="text-zinc-300 font-black text-[9px]">ALC (g/l)</span>}
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center justify-end">
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          className="rounded-xl hover:bg-danger-50 opacity-20 group-hover:opacity-100 transition-opacity"
                          onPress={() => removeWine(index)}
                          isDisabled={wines.length <= 1}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </LayoutGroup>
            </div>

            <Button
              fullWidth
              variant="flat"
              className="bg-brand-500/10 text-brand-600 font-black uppercase tracking-[0.2em] text-xs h-16 rounded-[2rem] border-2 border-dashed border-brand-500/20 group hover:border-brand-500 transition-all"
              onPress={addWine}
              startContent={<Plus size={20} className="group-hover:rotate-90 transition-transform" />}
            >
              {t('add-wine')}
            </Button>
          </CardBody>

          <CardBody className="px-8 pb-8 pt-0 flex flex-col items-center">
            <Button
              variant="light"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
              className="font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-brand-600 w-full h-12 rounded-2xl"
            >
              {showFormula ? commonT('formula.hide') : t('formula-title')}
            </Button>
          </CardBody>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showFormula && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-5xl"
          >
            <FormulMultiCalc />
          </motion.div>
        )}
      </AnimatePresence>

      <SaveFeedback show={showFeedback} />
    </div>
  );
};

export default FormulMultiBlendCalc;
