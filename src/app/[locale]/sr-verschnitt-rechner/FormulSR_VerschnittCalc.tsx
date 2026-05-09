/**
 * НАЗНАЧЕНИЕ: Расчет купажа сахара (SR-Verschnitt) в стиле Tech SaaS
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion, @/lib/calculations
 * ОСОБЕННОСТИ: Валидация диапазонов, i18n, Tech UI дизайн.
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
} from "@heroui/react";
import {
  Beaker,
  Target,
  Droplets,
  Eye,
  EyeOff,
  Cpu,
  Zap,
  Info
} from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { m, AnimatePresence } from "framer-motion";
import { calcSRVerschnitt } from '@/lib/calculations';
import FormulSRCalc from './FormulSRCalc';

const FormulSR_VerschnittCalc: React.FC = () => {
  const t = useTranslations('Calculators.sr-verschnitt');
  const commonT = useTranslations('Calculators');
  const locale = useLocale();

  const [showFormula, setShowFormula] = useState(false);
  const [values, setValues] = useState({
    gl_SR: "",
    gl_Wein: "",
    l_Wein: "",
    ziel_gl: "",
  });

  // Вспомогательная функция для парсинга чисел
  const parseInput = (val: string) => {
    const clean = val.replace(',', '.');
    return clean === "" ? NaN : parseFloat(clean);
  };

  // Валидация входных данных
  const errors = useMemo(() => {
    const s = parseInput(values.gl_SR);
    const w = parseInput(values.gl_Wein);
    const z = parseInput(values.ziel_gl);

    const errs: Record<string, string> = {};

    if (values.gl_SR && isNaN(s)) errs.gl_SR = commonT('errors.invalid-number');
    if (values.gl_Wein && isNaN(w)) errs.gl_Wein = commonT('errors.invalid-number');

    // Проверка: целевое значение должно быть между SR и базовым вином
    if (!isNaN(s) && !isNaN(w) && !isNaN(z)) {
      const isBetween = (z > w && z < s) || (z > s && z < w);
      if (!isBetween && z !== 0 && z !== w) {
        errs.ziel_gl = commonT('errors.range');
      }
    }
    return errs;
  }, [values, commonT]);

  // Расчет результата
  const results = useMemo(() => {
    const s = parseInput(values.gl_SR);
    const w = parseInput(values.gl_Wein);
    const l = parseInput(values.l_Wein);
    const z = parseInput(values.ziel_gl);

    const liter_SR = calcSRVerschnitt(s, w, l, z);
    if (liter_SR <= 0 && z !== w) return null;

    return {
      liter_SR: liter_SR,
      gesamt_Liter: l + liter_SR
    };
  }, [values]);


  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center py-12">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="bento-card border-none shadow-none mb-8">
          <CardHeader className="flex gap-3 sm:gap-5 p-4 sm:p-8">
            <div className="p-3 sm:p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20 shrink-0">
              <Cpu size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-tech-gradient uppercase italic leading-tight">
                {t('title')}
              </h1>
              <p className="text-[10px] sm:text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60">
                {t('subtitle')}
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-8 sm:p-10 space-y-10 pt-0">
            {/* Поля ввода */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label={t('input-sr-sugar')}
                placeholder="0,00"
                value={values.gl_SR}
                onValueChange={(v) => setValues({ ...values, gl_SR: v })}
                labelPlacement="outside"
                size="lg"
                radius="lg"
                variant="flat"
                isInvalid={!!errors.gl_SR}
                errorMessage={errors.gl_SR}
                startContent={<Droplets size={18} className="text-zinc-400" />}
                classNames={{
                  inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                  label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                }}
              />

              <Input
                label={t('input-wein-sugar')}
                placeholder="0,00"
                value={values.gl_Wein}
                onValueChange={(v) => setValues({ ...values, gl_Wein: v })}
                labelPlacement="outside"
                size="lg"
                radius="lg"
                variant="flat"
                isInvalid={!!errors.gl_Wein}
                errorMessage={errors.gl_Wein}
                startContent={<Beaker size={18} className="text-zinc-400" />}
                classNames={{
                  inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                  label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                }}
              />

              <Input
                label={t('input-wein-vol')}
                placeholder="0"
                value={values.l_Wein}
                onValueChange={(v) => setValues({ ...values, l_Wein: v })}
                labelPlacement="outside"
                size="lg"
                radius="lg"
                variant="flat"
                endContent={<span className="text-zinc-400 font-black text-[10px]">L</span>}
                classNames={{
                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                }}
              />

              <Input
                label={t('input-ziel-sugar')}
                placeholder="0,00"
                value={values.ziel_gl}
                onValueChange={(v) => setValues({ ...values, ziel_gl: v })}
                labelPlacement="outside"
                size="lg"
                radius="lg"
                variant="flat"
                isInvalid={!!errors.ziel_gl}
                errorMessage={errors.ziel_gl}
                startContent={<Target size={18} className="text-zinc-400" />}
                classNames={{
                    inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all border-dashed",
                    label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                }}
              />
            </div>

            {/* Блок результатов */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                    <Zap size={14} className="text-brand-500" />
                    <h3 className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
                        {commonT('results')}
                    </h3>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <Card className="relative bg-zinc-950 text-white border-none overflow-hidden h-44 flex items-center justify-center rounded-[2.5rem]" shadow="none">
                        <CardBody className="p-0 flex flex-col items-center justify-center relative z-10 px-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3 ml-[0.3em]">
                                {t('result-add')}
                            </span>
                            <div className="flex items-baseline gap-3">
                                <span className={`text-6xl font-black tracking-tighter transition-all ${results ? 'text-white' : 'text-zinc-800 animate-pulse'}`}>
                                    {results ? new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(results.liter_SR) : new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(0)}
                                </span>
                                <span className="text-xl font-black text-brand-500 uppercase italic">L</span>
                            </div>
                            
                            {results && (
                                <m.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20"
                                >
                                    <Info size={12} className="text-brand-500" />
                                    <span className="text-[9px] font-black text-brand-400 uppercase tracking-widest">
                                        Total: {new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(results.gesamt_Liter)} L
                                    </span>
                                </m.div>
                            )}
                        </CardBody>
                        <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                            <Droplets size={160} />
                        </div>
                    </Card>
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
            <FormulSRCalc />
          </m.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FormulSR_VerschnittCalc;
