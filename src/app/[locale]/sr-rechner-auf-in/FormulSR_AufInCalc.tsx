/**
 * НАЗНАЧЕНИЕ: Редактор Süßreserve (SR) - расчеты "на" и "в" в стиле Tech SaaS
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion, @/lib/calculations
 * ОСОБЕННОСТИ: i18n, Mobile-first, Tech UI дизайн.
 */

'use client';

import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Tooltip
} from "@heroui/react";
import {
  Percent,
  Droplets,
  Eye,
  EyeOff,
  Info,
  ArrowRightLeft,
  Zap,
  Cpu
} from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { m, AnimatePresence } from "framer-motion";
import { calcSR_Auf, calcSR_In } from "@/lib/calculations";
import FormulPercentSRCalc from "./FormulPercentSRCalc";

interface ResultCardProps {
  label: string;
  value: number;
  description: string;
  color: 'primary' | 'secondary';
}

const FormulSR_AufInCalc = () => {
  const t = useTranslations('Calculators.sr-rechner');
  const commonT = useTranslations('Calculators');
  const locale = useLocale();

  const [percentSR, setPercentSR] = useState("");
  const [literWein, setLiterWein] = useState("");
  const [showFormula, setShowFormula] = useState(false);

  // Парсинг (заменяем запятую на точку для расчетов)
  const P = parseFloat(percentSR.replace(",", "."));
  const L = parseFloat(literWein.replace(",", "."));

  const areInputsValid = !isNaN(P) && !isNaN(L) && P >= 0 && L >= 0 && P < 100;

  const resultAuf = useMemo(() => (areInputsValid ? calcSR_Auf(P, L) : 0), [P, L, areInputsValid]);
  const resultIn = useMemo(() => (areInputsValid ? calcSR_In(P, L) : 0), [P, L, areInputsValid]);


  const ResultCard = ({ label, value, description, color }: ResultCardProps) => {
    return (
      <Card
        className="border-none glass-modern shadow-none group overflow-hidden"
      >
        <CardBody className="p-5 flex flex-row justify-between items-center">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                {label}
              </span>
              <Tooltip content={description} placement="top">
                <Info size={14} className="text-zinc-400 opacity-40 hover:opacity-100 cursor-help" />
              </Tooltip>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black tracking-tighter ${color === 'primary' ? 'text-brand-600 dark:text-brand-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {value > 0 ? new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) : new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(0)}
              </span>
              <span className="text-sm font-black text-zinc-500 uppercase italic">L</span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl transition-all group-hover:scale-110 ${color === 'primary' ? 'bg-brand-500/10 text-brand-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
            <ArrowRightLeft size={20} />
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center py-12">

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="bento-card border-none shadow-none mb-8">
          <CardHeader className="flex gap-5 p-8 sm:p-10">
            <div className="p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20">
              <Cpu size={32} />
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
            {/* Поля ввода */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label={t('input-sr')}
                placeholder="0,0"
                value={percentSR}
                onValueChange={setPercentSR}
                labelPlacement="outside"
                size="lg"
                radius="lg"
                variant="flat"
                inputMode="decimal"
                isInvalid={P >= 100}
                errorMessage={P >= 100 && t('sr-max')}
                startContent={<Percent size={18} className="text-zinc-400" />}
                classNames={{
                  inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                  label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                }}
              />

              <Input
                label={t('input-liter')}
                placeholder="0"
                value={literWein}
                onValueChange={setLiterWein}
                labelPlacement="outside"
                size="lg"
                radius="lg"
                variant="flat"
                inputMode="decimal"
                startContent={<Droplets size={18} className="text-zinc-400" />}
                endContent={<span className="text-zinc-400 font-black text-[10px]">L</span>}
                classNames={{
                  inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                  label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                }}
              />
            </div>

            {/* Результаты */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 px-1">
                <Zap size={14} className="text-brand-500" />
                <h3 className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
                  {commonT('results')}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <ResultCard
                  label={t('auf')}
                  value={resultAuf}
                  description={t('auf-desc')}
                  color="primary"
                />
                <ResultCard
                  label={t('in')}
                  value={resultIn}
                  description={t('in-desc')}
                  color="secondary"
                />
              </div>
            </div>
          </CardBody>

          <CardBody className="px-8 pb-8 pt-0 flex flex-col items-center">
            <Button
              variant="light"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
              className="font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-brand-600 w-full h-12 rounded-2xl"
            >
              {showFormula ? commonT('formula.hide') : commonT('formula.show')}
            </Button>
          </CardBody>
        </Card>
      </m.div>

      <AnimatePresence>
        {showFormula && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-2xl"
          >
            <FormulPercentSRCalc />
          </m.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FormulSR_AufInCalc;
