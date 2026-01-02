'use client';

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import NextLink from "next/link";
import { 
  Wine, 
  Calculator, 
  Layers, 
  Droplets, 
  ArrowRight, 
  Beaker 
} from "lucide-react";

export default function Home() {
  // Список инструментов для быстрого доступа
  const tools = [
    {
      title: "SR Rechner auf/in",
      description: "Schnelle Berechnung der Süßreserve in Wein.",
      icon: <Calculator className="text-orange-500" size={24} />,
      href: "/sr-rechner-auf-in",
      color: "hover:border-orange-500"
    },
    {
      title: "Alkohol-Umrechner",
      description: "Umrechnung von Volumen- и Gewichtsprozent.",
      icon: <Beaker className="text-purple-500" size={24} />,
      href: "/alkohol-umrechner",
      color: "hover:border-purple-500"
    },
    {
      title: "SR Verschnitt",
      description: "Berechnung der Süßreserve nach der Mischungsregel.",
      icon: <Droplets className="text-teal-500" size={24} />,
      href: "/sr-verschnitt-rechner",
      color: "hover:border-teal-500"
    },
    {
      title: "Mehrfach-Verschnitt",
      description: "Assemblage von beliebig vielen Weinpartien.",
      icon: <Layers className="text-indigo-500" size={24} />,
      href: "/mehrfach-verschnitt",
      color: "hover:border-indigo-500"
    },
    
    
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mb-16">
        <div className="bg-primary/10 p-6 rounded-full mb-6 animate-pulse">
          <Wine size={64} className="text-primary" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
          Vino<span className="text-primary italic">Flow</span>
        </h1>
        <p className="text-xl text-default-500 max-w-2xl mb-8">
          Präzise önologische Berechnungen für Ihren Keller. 
          Schnell, zuverlässig und immer griffbereit.
        </p>
      </section>

      {/* Grid с инструментами */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card 
            key={tool.title} 
            isPressable 
            as={NextLink} 
            href={tool.href}
            className={`border-2 border-transparent transition-all duration-300 ${tool.color}`}
          >
            <CardHeader className="flex gap-3 p-5">
              <div className="p-2 bg-default-100 rounded-lg">
                {tool.icon}
              </div>
              <div className="flex flex-col text-left">
                <p className="text-md font-bold">{tool.title}</p>
                <p className="text-small text-default-500 font-medium italic">Tool</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-5">
              <p className="text-sm text-default-600 leading-relaxed text-left">
                {tool.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Вспомогательный компонент Divider, если он не импортирован из HeroUI
const Divider = () => <div className="h-px w-full bg-default-100" />;