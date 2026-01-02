'use client';

import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Input, 
  Button, 
  Divider, 
  Tooltip,
  Badge
} from "@heroui/react";
import { 
  Calculator, 
  Layers, 
  Droplet, 
  Percent, 
  Beaker, 
  Eye, 
  EyeOff,
  Plus,
  Trash2
} from "lucide-react";
import FormulMultiCalc from './FormulMultiCalc';

interface WineEntry {
  liter: string;
  sugar: string;
  alcohol: string;
}

const MultiWineCalc: React.FC = () => {
  const [showFormula, setShowFormula] = useState(false);
  
  // Начальное состояние — 3 вина, но теперь можно легко добавлять/удалять
  const [wines, setWines] = useState<WineEntry[]>(
    Array(3).fill(null).map(() => ({ liter: '', sugar: '', alcohol: '' }))
  );

  const handleInputChange = (index: number, field: keyof WineEntry, value: string) => {
    const newWines = [...wines];
    newWines[index][field] = value;
    setWines(newWines);
  };

  const addWine = () => {
    setWines([...wines, { liter: '', sugar: '', alcohol: '' }]);
  };

  const removeWine = (index: number) => {
    if (wines.length > 1) {
      setWines(wines.filter((_, i) => i !== index));
    }
  };

  // Расчет результатов "на лету"
  const results = useMemo(() => {
    let totalLiters = 0;
    let totalSugarMass = 0;
    let totalAlcoholMass = 0;

    wines.forEach(wine => {
      const l = parseFloat(wine.liter.replace(',', '.')) || 0;
      const s = parseFloat(wine.sugar.replace(',', '.')) || 0;
      const a = parseFloat(wine.alcohol.replace(',', '.')) || 0;

      if (l > 0) {
        totalLiters += l;
        totalSugarMass += l * s;
        totalAlcoholMass += l * a;
      }
    });

    return {
      totalLiters,
      avgSugar: totalLiters > 0 ? totalSugarMass / totalLiters : 0,
      avgAlcohol: totalLiters > 0 ? totalAlcoholMass / totalLiters : 0
    };
  }, [wines]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center">
      <Card className="w-full max-w-4xl shadow-2xl border-none" radius="lg">
        <CardHeader className="flex flex-col gap-2 p-6 bg-indigo-600 text-white">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Layers size={32} />
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Multi-Verschnitt</h1>
            </div>
            <Badge color="warning" content={wines.length} size="lg" shape="circle">
              <Beaker size={24} />
            </Badge>
          </div>
          <p className="text-indigo-100 text-xs sm:text-sm font-medium">
            Kalkulation von Zucker и Alkohol für beliebig viele Weinpartien
          </p>
        </CardHeader>

        <CardBody className="p-4 sm:p-8 space-y-6">
          {/* Динамический список вин */}
          <div className="space-y-4">
            {wines.map((wine, index) => (
              <div 
                key={index} 
                className="group relative grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-default-50 dark:bg-default-100/50 border border-default-200 hover:border-indigo-500/50 transition-all"
              >
                <div className="sm:col-span-1 flex items-center justify-center">
                  <span className="text-xl font-black text-default-300 group-hover:text-indigo-500 transition-colors">
                    {index + 1}
                  </span>
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Volumen"
                    placeholder="0,00"
                    size="sm"
                    variant="underlined"
                    value={wine.liter}
                    onValueChange={(v) => handleInputChange(index, 'liter', v)}
                    endContent={<span className="text-tiny text-default-400">L</span>}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Zucker"
                    placeholder="0,00"
                    size="sm"
                    variant="underlined"
                    color="warning"
                    value={wine.sugar}
                    onValueChange={(v) => handleInputChange(index, 'sugar', v)}
                    endContent={<span className="text-tiny text-default-400">g/l</span>}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Alkohol"
                    placeholder="0,00"
                    size="sm"
                    variant="underlined"
                    color="secondary"
                    value={wine.alcohol}
                    onValueChange={(v) => handleInputChange(index, 'alcohol', v)}
                    endContent={<span className="text-tiny text-default-400">g/l</span>}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end">
                  {wines.length > 1 && (
                    <Button 
                      isIconOnly 
                      variant="light" 
                      color="danger" 
                      size="sm"
                      onPress={() => removeWine(index)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button 
            fullWidth 
            variant="bordered" 
            color="primary" 
            onPress={addWine}
            startContent={<Plus size={18} />}
          >
            Weitere Partie hinzufügen
          </Button>

          <Divider className="my-6" />

          {/* Секция итогов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
              <p className="text-[10px] font-black uppercase text-indigo-600 mb-1 tracking-widest">Gesamtvolumen</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black">{results.totalLiters.toFixed(2)}</span>
                <span className="text-sm font-bold text-indigo-400">L</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
              <p className="text-[10px] font-black uppercase text-orange-600 mb-1 tracking-widest italic">Ø Zuckergehalt</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black">{results.avgSugar.toFixed(2)}</span>
                <span className="text-xs font-bold text-orange-400 uppercase">g/l</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
              <p className="text-[10px] font-black uppercase text-purple-600 mb-1 tracking-widest italic">Ø Alkoholgehalt</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black">{results.avgAlcohol.toFixed(2)}</span>
                <span className="text-sm font-bold text-purple-400 uppercase">g/l</span>
              </div>
            </div>
          </div>

          <Button 
            fullWidth 
            variant="flat" 
            color="primary" 
            className="font-bold"
            onPress={() => setShowFormula(!showFormula)}
            startContent={showFormula ? <EyeOff size={20} /> : <Eye size={20} />}
          >
            {showFormula ? 'Formeln ausblenden' : 'Die mathematische Formel ansehen'}
          </Button>
        </CardBody>
      </Card>

      {showFormula && (
        <div className="w-full max-w-4xl mt-8">
          <FormulMultiCalc />
        </div>
      )}
    </div>
  );
};

export default MultiWineCalc;