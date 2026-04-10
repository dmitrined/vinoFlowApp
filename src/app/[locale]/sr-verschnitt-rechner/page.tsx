/**
 * НАЗНАЧЕНИЕ: Расчет купажа сахара (SR-Verschnitt)
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion, @/lib/calculations
 * ОСОБЕННОСТИ: Валидация диапазонов, i18n, Mobile-first
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider
} from "@heroui/react";
import {
  Calculator,
  Beaker,
  Target,
  Droplets,
  Eye,
  EyeOff
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { calcSRVerschnitt } from '@/lib/calculations';
import FormulSRCalc from './FormulSRCalc';
import { useHistoryStore } from '@/lib/store/useHistoryStore';

const SrCalc: React.FC = () => {
  const t = useTranslations('Calculators.sr-verschnitt');
  const commonT = useTranslations('Calculators');

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

  // Авто-сохранение в историю
  const { addRecord } = useHistoryStore();
  React.useEffect(() => {
    if (!results || results.liter_SR <= 0) return;
    const timer = setTimeout(() => {
        addRecord({
            type: 'sr-verschnitt',
            result: results.liter_SR.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            unit: 'L'
        });
    }, 2000);
    return () => clearTimeout(timer);
  }, [results, addRecord]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-none" radius="lg">
          <CardHeader className="flex flex-col gap-2 p-6 bg-wine-600 text-white relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <Calculator size={32} />
              <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase">{t('title')}</h1>
            </div>
          </CardHeader>

          <CardBody className="p-4 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label={t('input-sr-sugar')}
                placeholder="0,00"
                variant="bordered"
                color={errors.gl_SR ? "danger" : "default"}
                isInvalid={!!errors.gl_SR}
                errorMessage={errors.gl_SR}
                value={values.gl_SR}
                onValueChange={(v) => setValues({ ...values, gl_SR: v })}
                startContent={<Droplets className="text-wine-500" size={18} />}
                classNames={{ inputWrapper: "border-2 focus-within:!border-wine-600" }}
              />

              <Input
                label={t('input-wein-sugar')}
                placeholder="0,00"
                variant="bordered"
                color={errors.gl_Wein ? "danger" : "default"}
                isInvalid={!!errors.gl_Wein}
                errorMessage={errors.gl_Wein}
                value={values.gl_Wein}
                onValueChange={(v) => setValues({ ...values, gl_Wein: v })}
                startContent={<Beaker className="text-secondary-500" size={18} />}
                classNames={{ inputWrapper: "border-2 focus-within:!border-wine-600" }}
              />

              <Input
                label={t('input-wein-vol')}
                placeholder="0"
                variant="bordered"
                color="default"
                value={values.l_Wein}
                onValueChange={(v) => setValues({ ...values, l_Wein: v })}
                endContent={<span className="text-tiny font-bold text-default-400">L</span>}
                classNames={{ inputWrapper: "border-2 focus-within:!border-wine-600" }}
              />

              <Input
                label={t('input-ziel-sugar')}
                placeholder="0,00"
                variant="bordered"
                color={errors.ziel_gl ? "danger" : "default"}
                isInvalid={!!errors.ziel_gl}
                errorMessage={errors.ziel_gl}
                value={values.ziel_gl}
                onValueChange={(v) => setValues({ ...values, ziel_gl: v })}
                startContent={<Target className="text-success-500" size={18} />}
                classNames={{ inputWrapper: "border-2 focus-within:!border-wine-600" }}
              />
            </div>

            <Divider />

            {/* Блок результатов */}
            <div className="space-y-4">
              <div className={`p-6 rounded-2xl transition-all shadow-inner ${results ? 'bg-wine-50 dark:bg-wine-900/10 border-2 border-wine-500/30' : 'bg-default-50 border-2 border-dashed border-default-200 opacity-60'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-wine-600 tracking-[0.2em] mb-1">{t('result-add')}</p>
                    <p className={`text-3xl font-mono font-black ${results ? 'text-wine-700 dark:text-wine-400' : 'text-default-300'}`}>
                      {results ? results.liter_SR.toFixed(2) : "0.00"} <span className="text-lg font-sans">L</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${results ? 'bg-wine-600 text-white shadow-lg' : 'bg-default-200 text-default-400'}`}>
                    <Droplets />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl flex justify-between items-center shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('result-total')}</span>
                <span className="text-xl font-mono font-black">
                  {results ? results.gesamt_Liter.toFixed(2) : "0.00"} <span className="text-sm font-sans font-medium">L</span>
                </span>
              </div>
            </div>

            <Button
              fullWidth
              variant="flat"
              color="danger"
              className="font-black uppercase tracking-widest text-xs"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
            >
              {showFormula ? commonT('formula.hide') : commonT('formula.show')}
            </Button>
          </CardBody>
        </Card>
      </motion.div>

      {showFormula && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mt-8"
        >
          <FormulSRCalc />
        </motion.div>
      )}
    </div>
  );
};

export default SrCalc;