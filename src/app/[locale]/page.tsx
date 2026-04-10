/**
 * НАЗНАЧЕНИЕ: Трендовая главная страница в стиле Bento Grid
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, framer-motion
 * ОСОБЕННОСТИ: Модульная сетка, SaaS стилистика, улучшенная мобильная эргономика
 */

'use client';

import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import {
    Calculator,
    Layers,
    Droplets,
    Beaker,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Cpu
} from "lucide-react";
import { RecentCalculations } from "@/components/layout/RecentCalculations";

export default function Home() {
    const t = useTranslations('HomePage');

    const tools = [
        {
            title: t('tools.sr-rechner'),
            icon: <Calculator className="text-blue-500" size={24} />,
            href: "/sr-rechner-auf-in",
            className: "md:col-span-2 md:row-span-1",
            color: "brand"
        },
        {
            title: t('tools.alkohol'),
            icon: <Beaker className="text-purple-500" size={24} />,
            href: "/alkohol-umrechner",
            className: "md:col-span-1 md:row-span-1",
            color: "secondary"
        },
        {
            title: t('tools.so2-rechner'),
            icon: <Cpu className="text-emerald-500" size={24} />,
            href: "/so2-rechner",
            className: "md:col-span-1 md:row-span-1",
            color: "success"
        },
        {
            title: t('tools.sr-verschnitt'),
            icon: <Droplets className="text-cyan-500" size={24} />,
            href: "/sr-verschnitt-rechner",
            className: "md:col-span-1 md:row-span-1",
            color: "primary"
        },
        {
            title: t('tools.mehrfach'),
            icon: <Layers className="text-orange-500" size={24} />,
            href: "/mehrfach-verschnitt",
            className: "md:col-span-1 md:row-span-1",
            color: "warning"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
            {/* Hero Section - SaaS Style */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center mb-20"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8"
                >
                    <Chip 
                        variant="flat" 
                        color="primary" 
                        startContent={<Zap size={14} />}
                        className="bg-brand-500/10 text-brand-600 font-black border-none uppercase text-[10px] py-4 px-4 px-6 neon-glow"
                    >
                        Precision Enology Platform
                    </Chip>
                </motion.div>
                
                <h1 className="text-6xl sm:text-8xl font-black mb-6 tracking-tight text-tech-gradient">
                    Vino<span className="text-zinc-200 dark:text-zinc-800 italic ml-1">Flow</span>
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-500 max-w-2xl font-medium leading-relaxed mb-10 px-4">
                    Professional-grade tools for winemakers. <br/>
                    <span className="text-zinc-400 font-normal">Calculations redefined for speed and accuracy.</span>
                </p>

                <div className="flex gap-4">
                    <Button 
                        as={Link}
                        href="/so2-rechner"
                        className="bg-tech-primary font-bold px-8 h-12"
                        radius="full"
                    >
                        Get Started
                    </Button>
                    <Button 
                        variant="light"
                        className="font-bold text-zinc-500"
                        radius="full"
                    >
                        View Documentation
                    </Button>
                </div>
            </motion.section>

            {/* Dashboard / History */}
            <RecentCalculations />

            {/* Bento Grid Tools */}
            <div className="mb-8 flex items-center gap-2 px-2">
                <TrendingUp size={20} className="text-brand-500" />
                <h2 className="text-2xl font-black tracking-tight uppercase italic opacity-80">Enology Tools</h2>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
                {tools.map((tool) => (
                    <motion.div key={tool.title} variants={itemVariants} className={tool.className}>
                        <Card
                            isPressable
                            as={Link}
                            href={tool.href}
                            className="bento-card group overflow-hidden border-none h-full"
                        >
                            <CardBody className="p-8 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start w-full">
                                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl group-hover:bg-brand-600 group-hover:text-white group-hover:rotate-12 transition-all duration-300">
                                        {tool.icon}
                                    </div>
                                    <div className="p-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 opacity-20 group-hover:opacity-100 text-brand-600">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </div>
                                <div className="mt-8 text-left">
                                    <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-brand-600 transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                                        Professional tool for precise vinification parameters.
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}

                {/* Placeholder Bento Card for Pro features or info */}
                <Card className="bento-card border-none bg-brand-600 text-white md:col-span-1 md:row-span-1 pointer-events-none group">
                    <CardBody className="p-8 flex flex-col items-center justify-center text-center">
                        <div className="mb-4 p-4 bg-white/20 rounded-full animate-pulse">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-black italic mb-2 tracking-tight">Stay Precise</h3>
                        <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Cellar Management Pro</p>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
