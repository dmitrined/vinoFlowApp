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
import FormulPercentSRCalc from "./FormulPercentSRCalc"; 

const PercentSRCalc = () => {
  const [percentSR, setPercentSR] = useState(""); 
  const [literWein, setLiterWein] = useState(""); 
  const [showFormula, setShowFormula] = useState(false);

  // Парсинг (запятая -> точка)
  const P = parseFloat(percentSR.replace(",", "."));
  const L = parseFloat(literWein.replace(",", "."));

  const areInputsValid = !isNaN(P) && !isNaN(L) && P >= 0 && L >= 0 && P < 100;

  const resultAuf = useMemo(() => (areInputsValid ? (P / 100) * L : 0), [P, L, areInputsValid]);
  const resultIn = useMemo(() => (areInputsValid ? (P / (100 - P)) * L : 0), [P, L, areInputsValid]);

  const ResultCard = ({ label, value, description, color }: any) => {
    // Состояние для отображения описания на мобилках при тапе
    const [isLabelVisible, setIsLabelVisible] = useState(false);

    return (
      <Card 
        isPressable 
        onPress={() => setIsLabelVisible(!isLabelVisible)}
        shadow="sm" 
        className="border-none bg-default-50 dark:bg-default-100/50"
      >
        <CardBody className="flex flex-row justify-between items-center p-3 sm:p-4">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-[10px] sm:text-xs text-default-500 font-bold uppercase tracking-wider">
                {label}
              </p>
              <Tooltip content={description} placement="top">
                <Info size={14} className="text-default-400 hidden sm:block" />
              </Tooltip>
            </div>
            <p className={`text-xl sm:text-2xl font-black text-${color}-600 dark:text-${color}-400`}>
              {value > 0 ? value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"} 
              <span className="text-sm font-medium ml-1">L</span>
            </p>
            {/* Дополнительное описание для мобилок (показывается по тапу) */}
            {isLabelVisible && (
              <p className="text-[10px] text-default-400 mt-1 sm:hidden animate-in fade-in slide-in-from-top-1">
                {description}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-full bg-${color}-500/10`}>
            <ArrowRightLeft className={`text-${color}-500`} size={18} />
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6 md:p-8 flex flex-col items-center">
      
      <Card className="w-full max-w-2xl shadow-2xl mb-4 sm:mb-6" radius="lg">
        <CardHeader className="flex flex-col gap-1 p-6 sm:p-8 text-center bg-primary-50/30 dark:bg-primary-900/10">
          <div className="bg-primary-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white mb-2 mx-auto shadow-lg shadow-primary-500/30">
            <Calculator size={20} className="sm:hidden" />
            <Calculator size={24} className="hidden sm:block" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">SR Rechner</h1>
          <p className="text-default-500 text-[12px] sm:text-small max-w-62.5 sm:max-w-none mx-auto leading-tight">
            Präzise Berechnung der Süßreserve für Weintechnologen
          </p>
        </CardHeader>

        <Divider />

        <CardBody className="p-5 sm:p-10 space-y-6 sm:space-y-8">
          {/* Ввод данных: на мобильных в колонку, на десктопе в ряд */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5 sm:gap-6">
            <Input
              label="% Süßreserve"
              placeholder="0,0"
              labelPlacement="outside"
              startContent={<Percent size={18} className="text-default-400 shrink-0" />}
              value={percentSR}
              onValueChange={setPercentSR}
              type="text"
              inputMode="decimal"
              variant="bordered"
              size="lg"
              color={P >= 100 ? "danger" : "primary"}
              isInvalid={P >= 100}
              errorMessage={P >= 100 && "% SR muss < 100 sein"}
              classNames={{ 
                label: "font-bold text-default-700 text-sm",
                input: "text-lg",
                inputWrapper: "h-14"
              }}
            />

            <Input
              label="Liter Wein (Basis)"
              placeholder="0"
              labelPlacement="outside"
              startContent={<Droplets size={18} className="text-default-400 shrink-0" />}
              value={literWein}
              onValueChange={setLiterWein}
              type="text"
              inputMode="decimal"
              variant="bordered"
              size="lg"
              color="primary"
              endContent={<span className="text-default-400 font-bold text-sm">L</span>}
              classNames={{ 
                label: "font-bold text-default-700 text-sm",
                input: "text-lg",
                inputWrapper: "h-14"
              }}
            />
          </div>

          <div className="space-y-3 sm:space-y-4 pt-2">
            <h3 className="text-md sm:text-lg font-bold flex items-center gap-2 px-1">
               Ergebnisse
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <ResultCard 
                label="SR % auf" 
                value={resultAuf} 
                description="Berechnet vom Grundwein (Zusatz)"
                color="primary"
              />
              <ResultCard 
                label="SR % in" 
                value={resultIn} 
                description="Anteil im fertigen Mischvolumen"
                color="secondary"
              />
            </div>
          </div>

          <Divider />

          <div className="flex justify-center pb-2">
            <Button
              variant="light"
              color="primary"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
              className="font-bold w-full sm:w-auto"
            >
              {showFormula ? "Formeln verbergen" : "Formeln anzeigen"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {showFormula && (
        <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-300 origin-top">
          <FormulPercentSRCalc />
        </div>
      )}
    </div>
  );
};

export default PercentSRCalc;