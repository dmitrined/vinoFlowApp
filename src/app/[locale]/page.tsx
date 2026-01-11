'use client';

import { Button, Card, CardBody, CardHeader, Image } from "@heroui/react";
import NextImage from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import {
    Calculator,
    Layers,
    Droplets,
    ArrowRight,
    Beaker
} from "lucide-react";

export default function Home() {
    const t = useTranslations('HomePage');

    // Список инструментов для быстрого доступа
    const tools = [
        {
            title: t('tools.sr-rechner'),
            description: t('tools.sr-rechner-desc'),
            icon: <Calculator className="text-orange-500" size={24} />,
            href: "/sr-rechner-auf-in",
            color: "hover:border-orange-500"
        },
        {
            title: t('tools.alkohol'),
            description: t('tools.alkohol-desc'),
            icon: <Beaker className="text-purple-500" size={24} />,
            href: "/alkohol-umrechner",
            color: "hover:border-purple-500"
        },
        {
            title: t('tools.sr-verschnitt'),
            description: t('tools.sr-verschnitt-desc'),
            icon: <Droplets className="text-teal-500" size={24} />,
            href: "/sr-verschnitt-rechner",
            color: "hover:border-teal-500"
        },
        {
            title: t('tools.mehrfach'),
            description: t('tools.mehrfach-desc'),
            icon: <Layers className="text-indigo-500" size={24} />,
            href: "/mehrfach-verschnitt",
            color: "hover:border-indigo-500"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center mb-16"
            >
                <div className="bg-wine-500/5 p-2 rounded-full mb-6 relative">
                    <Image
                        as={NextImage}
                        src="/icon-192x192.png"
                        alt="VinoFlow Logo"
                        width={80}
                        height={80}
                        className="rounded-full shadow-lg"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-wine-500/10 rounded-full -z-10 blur-xl"
                    />
                </div>
                <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
                    Vino<span className="text-wine-600 italic">Flow</span>
                </h1>
                <p className="text-xl text-default-500 max-w-2xl mb-8">
                    {t('description')}
                </p>
            </motion.section>

            {/* Grid с инструментами */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {tools.map((tool) => (
                    <motion.div key={tool.title} variants={itemVariants}>
                        <Card
                            isPressable
                            as={Link}
                            href={tool.href}
                            className={`border-2 border-transparent transition-all duration-300 ${tool.color} glass-card`}
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
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

const Divider = () => <div className="h-px w-full bg-default-100" />;
