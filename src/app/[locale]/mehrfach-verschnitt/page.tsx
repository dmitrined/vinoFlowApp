/**
 * НАЗНАЧЕНИЕ: Сложный купаж (Множественный ассамбляж)
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion, @/lib/calculations
 * ОСОБЕННОСТИ: Динамическое добавление/удаление партий, i18n, расчет средневзвешенного
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
  Badge,
  Tooltip
} from "@heroui/react";
import {
  Calculator,
  Layers,
  Droplet,
  Percent,
  Beaker,
  Eye,
  EyeOff,
  Plus,
  Trash2
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { calcMultiBlended } from '@/lib/calculations';
import FormulMultiCalc from './FormulMultiCalc';

interface WineEntry {
  liter: string;
  sugar: string;
  alcohol: string;
}

const MultiWineCalc: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-background p-3 sm:p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-none" radius="lg">
          <CardHeader className="flex flex-col gap-2 p-6 bg-zinc-900 text-white relative overflow-hidden">
            <div className="flex items-center justify-between w-full relative z-10">
              <div className="flex items-center gap-3">
                <Layers size={32} className="text-zinc-400" />
                <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase">{t('title')}</h1>
              </div>
              <Badge color="danger" content={wines.length} size="lg" shape="circle" className="border-2 border-zinc-900">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Beaker size={20} />
                </div>
              </Badge>
            </div>
            <p className="text-zinc-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] relative z-10">
              {t('subtitle')}
            </p>
          </CardHeader>

          <CardBody className="p-4 sm:p-8 space-y-6">
            {/* Динамический список вин */}
            <div className="space-y-4">
              <AnimatePresence>
                {wines.map((wine, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group relative grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-default-50 dark:bg-zinc-900 border-2 border-transparent hover:border-wine-500/20 transition-all shadow-sm"
                  >
                    <div className="sm:col-span-1 flex items-center justify-center">
                      <span className="text-xl font-black text-default-300 group-hover:text-wine-600 transition-colors">
                        {index + 1}
                      </span>
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        label={t('input-vol')}
                        placeholder="0,00"
                        size="sm"
                        variant="underlined"
                        value={wine.liter}
                        onValueChange={(v) => handleInputChange(index, 'liter', v)}
                        endContent={<span className="text-[10px] font-bold text-default-400">L</span>}
                        classNames={{ label: "font-black text-[10px] uppercase", input: "font-mono font-bold" }}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        label={t('input-sugar')}
                        placeholder="0,00"
                        size="sm"
                        variant="underlined"
                        color="warning"
                        value={wine.sugar}
                        onValueChange={(v) => handleInputChange(index, 'sugar', v)}
                        endContent={<span className="text-[10px] font-bold text-default-400">g/l</span>}
                        classNames={{ label: "font-black text-[10px] uppercase text-orange-600", input: "font-mono font-bold" }}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        label={t('input-alcohol')}
                        placeholder="0,00"
                        size="sm"
                        variant="underlined"
                        color="secondary"
                        value={wine.alcohol}
                        onValueChange={(v) => handleInputChange(index, 'alcohol', v)}
                        endContent={<span className="text-[10px] font-bold text-default-400">g/l</span>}
                        classNames={{ label: "font-black text-[10px] uppercase text-purple-600", input: "font-mono font-bold" }}
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-end">
                      {wines.length > 1 && (
                        <Tooltip content="Entfernen" color="danger">
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            size="sm"
                            onPress={() => removeWine(index)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button
              fullWidth
              variant="bordered"
              color="danger"
              className="border-2 border-wine-200 dark:border-wine-900/50 font-black uppercase text-xs tracking-widest h-12"
              onPress={addWine}
              startContent={<Plus size={18} />}
            >
              {t('add-wine')}
            </Button>

            <Divider className="my-4" />

            {/* Секция итогов */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-zinc-900 text-white shadow-xl border-t-4 border-zinc-600">
                <p className="text-[10px] font-black uppercase text-zinc-500 mb-1 tracking-[0.2em]">{t('total-vol')}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-black">{results.totalLiters.toFixed(2)}</span>
                  <span className="text-sm font-bold text-zinc-600 lowercase">l</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-orange-50 dark:bg-orange-950/20 shadow-xl border-t-4 border-orange-500/50">
                <p className="text-[10px] font-black uppercase text-orange-600 mb-1 tracking-[0.2em] italic">{t('avg-sugar')}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-black text-orange-700 dark:text-orange-400">{results.avgSugar.toFixed(2)}</span>
                  <span className="text-xs font-black text-orange-400 uppercase">g/l</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-purple-50 dark:bg-purple-950/20 shadow-xl border-t-4 border-purple-500/50">
                <p className="text-[10px] font-black uppercase text-purple-600 mb-1 tracking-[0.2em] italic">{t('avg-alcohol')}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-black text-purple-700 dark:text-purple-400">{results.avgAlcohol.toFixed(2)}</span>
                  <span className="text-xs font-black text-purple-400 uppercase">g/l</span>
                </div>
              </div>
            </div>

            <Button
              fullWidth
              variant="flat"
              color="danger"
              className="font-black uppercase tracking-widest text-xs h-12"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={20} /> : <Eye size={20} />}
            >
              {showFormula ? commonT('formula.hide') : t('formula-title')}
            </Button>
          </CardBody>
        </Card>
      </motion.div>

      {showFormula && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mt-8"
        >
          <FormulMultiCalc />
        </motion.div>
      )}
    </div>
  );
};

export default MultiWineCalc;