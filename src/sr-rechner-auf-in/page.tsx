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
  // Состояния для входных данных
  const [percentSR, setPercentSR] = useState(""); 
  const [literWein, setLiterWein] = useState(""); 
  const [showFormula, setShowFormula] = useState(false);

  // Парсинг входных данных
  const P = parseFloat(percentSR.replace(",", "."));
  const L = parseFloat(literWein.replace(",", "."));

  const areInputsValid = !isNaN(P) && !isNaN(L) && P >= 0 && L >= 0 && P < 100;

  // Расчеты
  const resultAuf = useMemo(() => (areInputsValid ? (P / 100) * L : 0), [P, L, areInputsValid]);
  const resultIn = useMemo(() => (areInputsValid ? (P / (100 - P)) * L : 0), [P, L, areInputsValid]);

  // Вспомогательный компонент для карточки результата
  const ResultCard = ({ label, value, description, color }: any) => (
    <Card shadow="sm" className="border-none bg-default-50 dark:bg-default-100/50">
      <CardBody className="flex flex-row justify-between items-center p-4">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-xs text-default-500 font-semibold uppercase tracking-wider">{label}</p>
            <Tooltip content={description}>
              <Info size={14} className="text-default-400 cursor-help" />
            </Tooltip>
          </div>
          <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
            {value > 0 ? value.toFixed(2) : "0.00"} <span className="text-small font-normal">L</span>
          </p>
        </div>
        <ArrowRightLeft className="text-default-300" size={20} />
      </CardBody>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 flex flex-col items-center">
      
      <Card className="w-full max-w-2xl shadow-2xl mb-6" radius="lg">
        <CardHeader className="flex flex-col gap-1 p-8 text-center bg-primary-50/30 dark:bg-primary-900/10">
          <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 mx-auto shadow-lg shadow-primary-500/30">
            <Calculator size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">SR Rechner</h1>
          <p className="text-default-500 text-small">
            Präzise Berechnung der Süßreserve für Weintechnologen
          </p>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 sm:p-10 space-y-8">
          {/* Секция ввода данных */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="% Süßreserve"
              placeholder="z.B. 10"
              labelPlacement="outside"
              startContent={<Percent size={18} className="text-default-400" />}
              value={percentSR}
              onValueChange={setPercentSR}
              type="text"
              inputMode="decimal"
              variant="bordered"
              color={P >= 100 ? "danger" : "primary"}
              isInvalid={P >= 100}
              errorMessage={P >= 100 && "% SR muss < 100 sein"}
              classNames={{ label: "font-bold text-default-700" }}
            />

            <Input
              label="Liter Wein (Basis)"
              placeholder="z.B. 1000"
              labelPlacement="outside"
              startContent={<Droplets size={18} className="text-default-400" />}
              value={literWein}
              onValueChange={setLiterWein}
              type="text"
              inputMode="decimal"
              variant="bordered"
              color="primary"
              endContent={<span className="text-default-400 font-bold">L</span>}
              classNames={{ label: "font-bold text-default-700" }}
            />
          </div>

          {/* Секция результатов */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
               Ergebnisse <span className="text-xs font-normal text-default-400">(Liter SR)</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <ResultCard 
                label="SR % auf" 
                value={resultAuf} 
                description="Zusatz bezogen auf die Weinmenge"
                color="primary"
              />
              <ResultCard 
                label="SR % in" 
                value={resultIn} 
                description="Anteil im fertigen Gesamtvolumen"
                color="secondary"
              />
            </div>
          </div>

          <Divider />

          {/* Кнопка управления формулами */}
          <div className="flex justify-center">
            <Button
              variant="flat"
              color="primary"
              onPress={() => setShowFormula(!showFormula)}
              startContent={showFormula ? <EyeOff size={18} /> : <Eye size={18} />}
              className="font-bold transition-all"
            >
              {showFormula ? "Formeln ausblenden" : "Mathematische Formeln anzeigen"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Вызов компонента с формулами */}
      {showFormula && (
        <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-300">
          <FormulPercentSRCalc />
        </div>
      )}
    </div>
  );
};

export default PercentSRCalc;