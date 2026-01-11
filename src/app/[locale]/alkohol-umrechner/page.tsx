/**
 * НАЗНАЧЕНИЕ: Конвертер спирта (г/л <-> % об.)
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, @/lib/calculations
 * ОСОБЕННОСТИ: Двухсторонний расчет, i18n, Mobile-first
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
  Divider,
} from "@heroui/react";
import {
  Calculator,
  RefreshCcw,
  GlassWater,
  FlaskConical,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { convertGLToVol, convertVolToGL } from '@/lib/calculations';
import FormulAlcCalculation from './FormulAlcCalculation';

const AlcCalculation = () => {
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

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-8 flex flex-col items-center">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl mb-6 border-none" radius="lg">
          <CardHeader className="flex flex-col gap-1 p-6 text-center bg-wine-600/10">
            <div className="bg-wine-600 w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 mx-auto shadow-lg shadow-wine-600/20">
              <RefreshCcw size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-wine-600 dark:text-wine-400">
              {t('title')}
            </h1>
            <p className="text-default-500 text-xs sm:text-small font-medium">
              {t('subtitle')}
            </p>
          </CardHeader>

          <CardBody className="p-4 sm:p-8">
            <Tabs
              fullWidth
              aria-label="Umrechnungs-Optionen"
              color="danger"
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-wine-600",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-wine-600 font-bold"
              }}
            >
              {/* ТАБ 1: g/l to % Vol. */}
              <Tab
                key="gl-to-vol"
                title={
                  <div className="flex items-center space-x-2">
                    <FlaskConical size={18} />
                    <span>g/l ➔ % Vol.</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-6">
                  <Input
                    label={t('input-gl')}
                    placeholder="0,00"
                    labelPlacement="outside"
                    size="lg"
                    variant="bordered"
                    value={inputGL}
                    onValueChange={setInputGL}
                    inputMode="decimal"
                    endContent={<span className="text-default-400 font-bold">g/l</span>}
                  />

                  <div className="relative py-2 flex justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <Divider />
                    </div>
                    <div className="relative bg-background px-2 text-wine-600">
                      <Calculator size={20} />
                    </div>
                  </div>

                  <Input
                    isReadOnly
                    label={t('result-vol')}
                    labelPlacement="outside"
                    size="lg"
                    variant="flat"
                    color="success"
                    value={resultVOL}
                    classNames={{
                      input: "text-2xl font-mono font-bold text-success-600",
                      label: "font-semibold text-default-700"
                    }}
                    endContent={<span className="text-success-600 font-bold">% Vol.</span>}
                  />
                </div>
              </Tab>

              {/* ТАБ 2: % Vol. to g/l */}
              <Tab
                key="vol-to-gl"
                title={
                  <div className="flex items-center space-x-2">
                    <GlassWater size={18} />
                    <span>% Vol. ➔ g/l</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-6">
                  <Input
                    label={t('input-vol')}
                    placeholder="0,00"
                    labelPlacement="outside"
                    size="lg"
                    variant="bordered"
                    value={inputVOL}
                    onValueChange={setInputVOL}
                    inputMode="decimal"
                    endContent={<span className="text-default-400 font-bold">% Vol.</span>}
                  />

                  <div className="relative py-2 flex justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <Divider />
                    </div>
                    <div className="relative bg-background px-2 text-wine-600">
                      <Calculator size={20} />
                    </div>
                  </div>

                  <Input
                    isReadOnly
                    label={t('result-gl')}
                    labelPlacement="outside"
                    size="lg"
                    variant="flat"
                    color="success"
                    value={resultGL}
                    classNames={{
                      input: "text-2xl font-mono font-bold text-success-600",
                      label: "font-semibold text-default-700"
                    }}
                    endContent={<span className="text-success-600 font-bold">g/l</span>}
                  />
                </div>
              </Tab>
            </Tabs>

            {/* Валидация ошибки */}
            {((inputGL && isNaN(parseFloat(inputGL.replace(',', '.')))) || (inputVOL && isNaN(parseFloat(inputVOL.replace(',', '.'))))) && (
              <div className="mt-4 flex items-center gap-2 text-danger animate-pulse">
                <AlertCircle size={16} />
                <span className="text-xs font-bold">{commonT('errors.invalid')}</span>
              </div>
            )}
          </CardBody>

          <Divider />

          <CardBody className="p-4 flex flex-col items-center">
            <Button
              variant="light"
              color="danger"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
              className="font-bold w-full"
            >
              {showFormula ? commonT('formula.hide') : commonT('formula.title')}
            </Button>
          </CardBody>
        </Card>
      </motion.div>

      {showFormula && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <FormulAlcCalculation />
        </motion.div>
      )}
    </div>
  );
};

export default AlcCalculation;