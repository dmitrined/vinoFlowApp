/**
 * НАЗНАЧЕНИЕ: Конвертер спирта (г/л <-> % об.) в стиле Tech SaaS
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, @/lib/calculations
 * ОСОБЕННОСТИ: Двухсторонний расчет, i18n, Tech UI дизайн.
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  RefreshCcw,
  GlassWater,
  FlaskConical,
  Eye,
  EyeOff,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from "framer-motion";
import { convertGLToVol, convertVolToGL } from '@/lib/calculations';
import FormulAlcCalculation from './FormulAlcCalculation';
import { useHistoryAutoSave } from '@/hooks/useHistoryAutoSave';
import SaveFeedback from '@/components/ui/SaveFeedback';

const FormulAlcConverter = () => {
  const t = useTranslations('Calculators.alkohol');
  const commonT = useTranslations('Calculators');

  const [showFormula, setShowFormula] = useState(false);
  const [inputGL, setInputGL] = useState<string>('');
  const [inputVOL, setInputVOL] = useState<string>('');

  // Расчет: g/l -> % Vol.
  const resultVOL = useMemo(() => {
    const numGL = parseFloat(inputGL.replace(',', '.'));
    if (isNaN(numGL)) return '';
    return convertGLToVol(numGL).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [inputGL]);

  // Расчет: % Vol. -> g/l
  const resultGL = useMemo(() => {
    const numVol = parseFloat(inputVOL.replace(',', '.'));
    if (isNaN(numVol)) return '';
    return convertVolToGL(numVol).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [inputVOL]);

  // Авто-сохранение в историю через хук
  const { showFeedback: showFeedback1 } = useHistoryAutoSave(
    {
        type: 'alkohol',
        result: resultVOL,
        unit: '% Vol.'
    },
    resultVOL && resultVOL !== '0,00' ? resultVOL : null
  );

  const { showFeedback: showFeedback2 } = useHistoryAutoSave(
    {
        type: 'alkohol',
        result: resultGL,
        unit: 'g/l'
    },
    resultGL && resultGL !== '0,00' ? resultGL : null
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center py-12">

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bento-card border-none shadow-none mb-8">
          <CardHeader className="flex gap-5 p-8">
            <div className="p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20">
              <RefreshCcw size={32} />
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

          <CardBody className="p-8 space-y-10 pt-0">
            <Tabs
              fullWidth
              aria-label="Umrechnungs-Optionen"
              color="primary"
              variant="bordered"
              radius="full"
              classNames={{
                tabList: "bg-zinc-100 dark:bg-zinc-800/50 p-1 border-none",
                cursor: "bg-white dark:bg-zinc-700 shadow-sm",
                tab: "h-10",
                tabContent: "group-data-[selected=true]:text-brand-600 font-black uppercase tracking-tighter text-[10px] sm:text-xs"
              }}
            >
              {/* ТАБ 1: g/l to % Vol. */}
              <Tab
                key="gl-to-vol"
                title={
                  <div className="flex items-center space-x-2">
                    <FlaskConical size={16} />
                    <span>g/l ➔ % Vol.</span>
                  </div>
                }
              >
                <div className="space-y-8 pt-6">
                  <Input
                    label={t('input-gl')}
                    placeholder="0,00"
                    labelPlacement="outside"
                    size="lg"
                    radius="lg"
                    variant="flat"
                    value={inputGL}
                    onValueChange={setInputGL}
                    inputMode="decimal"
                    classNames={{
                        inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                        label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                    }}
                    endContent={<span className="text-zinc-400 font-black text-[10px]">G/L</span>}
                  />

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <Card className="relative bg-zinc-950 text-white border-none overflow-hidden h-40 flex items-center justify-center rounded-[2.5rem]" shadow="none">
                      <CardBody className="p-0 flex flex-col items-center justify-center relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3 ml-[0.3em]">
                          {t('result-vol')}
                        </span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-6xl font-black tracking-tighter text-white">
                            {resultVOL || '0,00'}
                          </span>
                          <span className="text-xl font-black text-brand-500 uppercase italic">
                            % Vol.
                          </span>
                        </div>
                      </CardBody>
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap size={80} />
                      </div>
                    </Card>
                  </div>
                </div>
              </Tab>

              {/* ТАБ 2: % Vol. to g/l */}
              <Tab
                key="vol-to-gl"
                title={
                  <div className="flex items-center space-x-2">
                    <GlassWater size={16} />
                    <span>% Vol. ➔ g/l</span>
                  </div>
                }
              >
                <div className="space-y-8 pt-6">
                  <Input
                    label={t('input-vol')}
                    placeholder="0,00"
                    labelPlacement="outside"
                    size="lg"
                    radius="lg"
                    variant="flat"
                    value={inputVOL}
                    onValueChange={setInputVOL}
                    inputMode="decimal"
                    classNames={{
                        inputWrapper: "bg-zinc-100 dark:bg-zinc-800/50 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-800 border-2 border-transparent group-data-[focus=true]:border-brand-500 transition-all",
                        label: "font-black uppercase text-[11px] tracking-widest text-zinc-400 mb-2"
                    }}
                    endContent={<span className="text-zinc-400 font-black text-[10px]">% VOL.</span>}
                  />

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <Card className="relative bg-zinc-950 text-white border-none overflow-hidden h-40 flex items-center justify-center rounded-[2.5rem]" shadow="none">
                      <CardBody className="p-0 flex flex-col items-center justify-center relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3 ml-[0.3em]">
                          {t('result-gl')}
                        </span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-6xl font-black tracking-tighter text-white">
                            {resultGL || '0,00'}
                          </span>
                          <span className="text-xl font-black text-brand-500 uppercase italic">
                            g/l
                          </span>
                        </div>
                      </CardBody>
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap size={80} />
                      </div>
                    </Card>
                  </div>
                </div>
              </Tab>
            </Tabs>

            {/* Валидация ошибки */}
            {((inputGL && isNaN(parseFloat(inputGL.replace(',', '.')))) || (inputVOL && isNaN(parseFloat(inputVOL.replace(',', '.'))))) && (
              <div className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-danger-50 text-danger border border-danger-100 animate-pulse">
                <AlertCircle size={20} />
                <span className="text-xs font-black uppercase tracking-wider">{commonT('errors.invalid')}</span>
              </div>
            )}
          </CardBody>

          <CardBody className="px-8 pb-8 pt-0 flex flex-col items-center">
            <Button
              variant="light"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
              className="font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-brand-600 w-full h-12 rounded-2xl"
            >
              {showFormula ? commonT('formula.hide') : commonT('formula.title')}
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
            className="w-full max-w-lg"
          >
            <FormulAlcCalculation />
          </m.div>
        )}
      </AnimatePresence>

      <SaveFeedback show={showFeedback1 || showFeedback2} />
    </div>
  );
};

export default FormulAlcConverter;
