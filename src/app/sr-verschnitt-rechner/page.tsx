'use client';

import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Input, 
  Button, 
  Divider, 
  Tooltip 
} from "@heroui/react";
import { 
  Calculator, 
  Beaker, 
  Target, 
  Droplets, 
  Eye, 
  EyeOff,
  AlertCircle
} from "lucide-react";
import FormulSRCalc from './FormulSRCalc'; 

const SrCalc: React.FC = () => {
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

  // Валидация "на лету"
  const errors = useMemo(() => {
    const s = parseInput(values.gl_SR);
    const w = parseInput(values.gl_Wein);
    const z = parseInput(values.ziel_gl);
    
    const errs: Record<string, string> = {};

    if (values.gl_SR && isNaN(s)) errs.gl_SR = "Ungültige Zahl";
    if (values.gl_Wein && isNaN(w)) errs.gl_Wein = "Ungültige Zahl";
    
    // Главная логика: Ziel должен быть между SR и Wein
    if (!isNaN(s) && !isNaN(w) && !isNaN(z)) {
        const isBetween = (z > w && z < s) || (z > s && z < w);
        if (!isBetween && z !== 0) {
            errs.ziel_gl = "Ziel muss zwischen Wein и SR liegen";
        }
    }
    return errs;
  }, [values]);

  // Расчет результатов
  const results = useMemo(() => {
    const s = parseInput(values.gl_SR);
    const w = parseInput(values.gl_Wein);
    const l = parseInput(values.l_Wein);
    const z = parseInput(values.ziel_gl);

    if (isNaN(s) || isNaN(w) || isNaN(l) || isNaN(z)) return null;

    const denominator = s - z;
    if (Math.abs(denominator) < 1e-6) return null;

    let liter_SR = (l * (z - w)) / denominator;
    if (liter_SR < 0) return null; // Если расчет невозможен по физике процесса

    return {
      liter_SR: liter_SR,
      gesamt_Liter: l + liter_SR
    };
  }, [values]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl shadow-2xl border-none" radius="lg">
        <CardHeader className="flex flex-col gap-2 p-6 bg-teal-500 text-white">
          <div className="flex items-center gap-3">
            <Calculator size={32} />
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight">SR-VERSCHNITT</h1>
          </div>
        </CardHeader>

        <CardBody className="p-4 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Zuckergehalt SR (g/l)"
              placeholder="0,00"
              variant="bordered"
              color={errors.gl_SR ? "danger" : "secondary"}
              isInvalid={!!errors.gl_SR}
              errorMessage={errors.gl_SR}
              value={values.gl_SR}
              onValueChange={(v) => setValues({...values, gl_SR: v})}
              startContent={<Droplets className="text-secondary-400" size={18} />}
            />
            
            <Input
              label="Zuckergehalt Wein (g/l)"
              placeholder="0,00"
              variant="bordered"
              color={errors.gl_Wein ? "danger" : "warning"}
              isInvalid={!!errors.gl_Wein}
              errorMessage={errors.gl_Wein}
              value={values.gl_Wein}
              onValueChange={(v) => setValues({...values, gl_Wein: v})}
              startContent={<Beaker className="text-warning-400" size={18} />}
            />

            <Input
              label="Volumen Wein (L)"
              placeholder="0"
              variant="bordered"
              color="primary"
              value={values.l_Wein}
              onValueChange={(v) => setValues({...values, l_Wein: v})}
            />

            <Input
              label="Ziel-Zucker (g/l)"
              placeholder="0,00"
              variant="bordered"
              color={errors.ziel_gl ? "danger" : "success"}
              isInvalid={!!errors.ziel_gl}
              errorMessage={errors.ziel_gl}
              value={values.ziel_gl}
              onValueChange={(v) => setValues({...values, ziel_gl: v})}
              startContent={<Target className="text-success-400" size={18} />}
            />
          </div>

          <Divider />

          {/* Результаты */}
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl transition-all ${results ? 'bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500' : 'bg-default-100 opacity-50'}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs font-black uppercase text-teal-600">Süßreserve Zugabe</p>
                        <p className="text-3xl font-mono font-black">
                            {results ? results.liter_SR.toFixed(2) : "0.00"} <span className="text-lg font-sans">L</span>
                        </p>
                    </div>
                    {results && <div className="bg-teal-500 text-white p-2 rounded-full"><Droplets /></div>}
                </div>
            </div>

            <div className="p-4 bg-default-50 rounded-xl border border-dashed border-default-300 flex justify-between items-center">
                <span className="text-sm font-bold text-default-500 uppercase">Gesamtmenge</span>
                <span className="text-xl font-mono font-bold">
                    {results ? results.gesamt_Liter.toFixed(2) : "0.00"} L
                </span>
            </div>
          </div>

          <Button 
            fullWidth
            variant="flat"
            onPress={() => setShowFormula(!showFormula)}
            startContent={showFormula ? <EyeOff size={20} /> : <Eye size={20} />}
          >
            Mathematik anzeigen
          </Button>
        </CardBody>
      </Card>

      {showFormula && <div className="w-full max-w-2xl mt-8"><FormulSRCalc /></div>}
    </div>
  );
};

export default SrCalc;