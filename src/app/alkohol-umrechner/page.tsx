'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Tabs, 
  Tab, 
  Divider,
  Chip
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
import FormulAlcCalculation from './FormulAlcCalculation';

const CONVERSION_FACTOR = 0.1267;

const parseValue = (value: string): number => {
  const cleanValue = value.replace(',', '.');
  const number = parseFloat(cleanValue);
  return !isNaN(number) && number >= 0 ? number : NaN;
};

const AlcCalculation = () => {
  const [showFormula, setShowFormula] = useState(false);
  const [inputGL, setInputGL] = useState<string>('');
  const [inputVOL, setInputVOL] = useState<string>('');

  // Расчет: g/l -> % Vol.
  const resultVOL = useMemo(() => {
    const numGL = parseValue(inputGL);
    if (isNaN(numGL)) return '';
    return (numGL * CONVERSION_FACTOR).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [inputGL]);

  // Расчет: % Vol. -> g/l
  const resultGL = useMemo(() => {
    const numVol = parseValue(inputVOL);
    if (isNaN(numVol)) return '';
    return (numVol / CONVERSION_FACTOR).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [inputVOL]);

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-8 flex flex-col items-center">
      
      <Card className="w-full max-w-lg shadow-2xl mb-6" radius="lg">
        <CardHeader className="flex flex-col gap-1 p-6 text-center bg-indigo-500/10">
          <div className="bg-indigo-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 mx-auto">
            <RefreshCcw size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            Alkohol-Umrechner
          </h1>
          <p className="text-default-500 text-xs sm:text-small">
            Konvertierung zwischen g/l и % Vol.
          </p>
        </CardHeader>

        <CardBody className="p-4 sm:p-8">
          <Tabs 
            fullWidth 
            aria-label="Umrechnungs-Optionen" 
            color="primary" 
            variant="underlined"
            classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-indigo-500",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-indigo-500 font-bold"
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
                  label="Eingabe: Gramm pro Liter"
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
                    <div className="relative bg-background px-2">
                        <Calculator size={20} className="text-indigo-500" />
                    </div>
                </div>

                <Input
                  isReadOnly
                  label="Ergebnis: Alkoholgehalt"
                  labelPlacement="outside"
                  size="lg"
                  variant="flat"
                  color="success"
                  value={resultVOL}
                  classNames={{
                    input: "text-2xl font-mono font-bold text-success-600",
                    label: "font-semibold"
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
                  label="Eingabe: Prozent Volumen"
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
                    <div className="relative bg-background px-2">
                        <Calculator size={20} className="text-indigo-500" />
                    </div>
                </div>

                <Input
                  isReadOnly
                  label="Ergebnis: Gramm pro Liter"
                  labelPlacement="outside"
                  size="lg"
                  variant="flat"
                  color="success"
                  value={resultGL}
                  classNames={{
                    input: "text-2xl font-mono font-bold text-success-600",
                    label: "font-semibold"
                  }}
                  endContent={<span className="text-success-600 font-bold">g/l</span>}
                />
              </div>
            </Tab>
          </Tabs>

          {/* Валидация ошибки */}
          {((inputGL && isNaN(parseValue(inputGL))) || (inputVOL && isNaN(parseValue(inputVOL)))) && (
            <div className="mt-4 flex items-center gap-2 text-danger animate-pulse">
                <AlertCircle size={16} />
                <span className="text-xs font-bold">Ungültiger Wert! Bitte Zahl eingeben.</span>
            </div>
          )}
        </CardBody>

        <Divider />

        <CardBody className="p-4 flex flex-col items-center">
            <Button
              variant="light"
              color="primary"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
              className="font-bold w-full"
            >
              {showFormula ? 'Formeln verbergen' : 'Mathematische Formeln'}
            </Button>
        </CardBody>
      </Card>

      {showFormula && (
        <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
          <FormulAlcCalculation />
        </div>
      )}
    </div>
  );
};

export default AlcCalculation;