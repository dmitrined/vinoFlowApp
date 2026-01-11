/**
 * НАЗНАЧЕНИЕ: Редактор Süßreserve (SR) - расчеты "на" и "в".
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion, @/lib/calculations
 * ОСОБЕННОСТИ: i18n, Mobile-first, анимации Framer Motion
 */

'use client';

import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Tooltip
} from "@heroui/react";
import {
  Calculator,
  Percent,
  Droplets,
  Eye,
  EyeOff,
  Info,
  ArrowRightLeft
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { calcSR_Auf, calcSR_In } from "@/lib/calculations";
import FormulPercentSRCalc from "./FormulPercentSRCalc";

const PercentSRCalc = () => {
  const t = useTranslations('Calculators.sr-rechner');
  const commonT = useTranslations('Calculators');

  const [percentSR, setPercentSR] = useState("");
  const [literWein, setLiterWein] = useState("");
  const [showFormula, setShowFormula] = useState(false);

  // Парсинг (заменяем запятую на точку для расчетов)
  const P = parseFloat(percentSR.replace(",", "."));
  const L = parseFloat(literWein.replace(",", "."));

  const areInputsValid = !isNaN(P) && !isNaN(L) && P >= 0 && L >= 0 && P < 100;

  const resultAuf = useMemo(() => (areInputsValid ? calcSR_Auf(P, L) : 0), [P, L, areInputsValid]);
  const resultIn = useMemo(() => (areInputsValid ? calcSR_In(P, L) : 0), [P, L, areInputsValid]);

  const ResultCard = ({ label, value, description, color }: any) => {
    const [isLabelVisible, setIsLabelVisible] = useState(false);

    return (
      <Card
        isPressable
        onPress={() => setIsLabelVisible(!isLabelVisible)}
        shadow="sm"
        className="border-none bg-default-50 dark:bg-zinc-800/50 hover:bg-default-100 transition-colors"
      >
        <CardBody className="flex flex-row justify-between items-center p-3 sm:p-4">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-[10px] sm:text-xs text-default-500 font-black uppercase tracking-widest">
                {label}
              </p>
              <Tooltip content={description} placement="top">
                <Info size={14} className="text-default-400 hidden sm:block" />
              </Tooltip>
            </div>
            <p className={`text-xl sm:text-2xl font-black ${color === 'primary' ? 'text-wine-600' : 'text-secondary-600'}`}>
              {value > 0 ? value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
              <span className="text-sm font-medium ml-1">L</span>
            </p>
            {isLabelVisible && (
              <p className="text-[10px] text-default-400 mt-1 sm:hidden animate-in fade-in slide-in-from-top-1">
                {description}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-full ${color === 'primary' ? 'bg-wine-500/10' : 'bg-secondary-500/10'}`}>
            <ArrowRightLeft className={color === 'primary' ? 'text-wine-600' : 'text-secondary-600'} size={18} />
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6 md:p-8 flex flex-col items-center">

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl mb-4 sm:mb-6 border-none" radius="lg">
          <CardHeader className="flex flex-col gap-1 p-6 sm:p-8 text-center bg-wine-600/10">
            <div className="bg-wine-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white mb-2 mx-auto shadow-lg shadow-wine-600/30">
              <Calculator size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-default-500 text-[12px] sm:text-small max-w-xs sm:max-w-none mx-auto leading-tight font-medium">
              {t('subtitle')}
            </p>
          </CardHeader>

          <Divider />

          <CardBody className="p-5 sm:p-10 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5 sm:gap-6">
              <Input
                label={t('input-sr')}
                placeholder="0,0"
                labelPlacement="outside"
                startContent={<Percent size={18} className="text-default-400 shrink-0" />}
                value={percentSR}
                onValueChange={setPercentSR}
                type="text"
                inputMode="decimal"
                variant="bordered"
                size="lg"
                color={P >= 100 ? "danger" : "default"}
                isInvalid={P >= 100}
                errorMessage={P >= 100 && t('sr-max')}
                classNames={{
                  label: "font-black text-default-700 text-[11px] uppercase tracking-widest",
                  input: "text-lg font-mono font-bold",
                  inputWrapper: "h-14 border-2 focus-within:!border-wine-600"
                }}
              />

              <Input
                label={t('input-liter')}
                placeholder="0"
                labelPlacement="outside"
                startContent={<Droplets size={18} className="text-default-400 shrink-0" />}
                value={literWein}
                onValueChange={setLiterWein}
                type="text"
                inputMode="decimal"
                variant="bordered"
                size="lg"
                color="default"
                endContent={<span className="text-default-400 font-bold text-sm">L</span>}
                classNames={{
                  label: "font-black text-default-700 text-[11px] uppercase tracking-widest",
                  input: "text-lg font-mono font-bold",
                  inputWrapper: "h-14 border-2 focus-within:!border-wine-600"
                }}
              />
            </div>

            <div className="space-y-3 sm:space-y-4 pt-2">
              <h3 className="text-[11px] uppercase font-black tracking-[0.2em] text-default-400 flex items-center gap-2 px-1">
                {commonT('results')}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
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

            <Divider />

            <div className="flex justify-center pb-2">
              <Button
                variant="light"
                color="danger"
                onPress={() => setShowFormula(!showFormula)}
                startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
                className="font-black uppercase text-xs tracking-widest w-full sm:w-auto"
              >
                {showFormula ? commonT('formula.hide') : commonT('formula.show')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {showFormula && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl origin-top"
        >
          <FormulPercentSRCalc />
        </motion.div>
      )}
    </div>
  );
};

export default PercentSRCalc;