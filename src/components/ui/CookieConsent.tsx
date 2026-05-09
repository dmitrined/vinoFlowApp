/**
 * НАЗНАЧЕНИЕ: Компонент уведомления о файлах Cookie (GDPR)
 * ЗАВИСИМОСТИ: @heroui/react, framer-motion, next-intl, lucide-react
 * ОСОБЕННОСТИ: Анимированное появление, сохранение выбора в localStorage
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardBody } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from 'next/link';

export const CookieConsent = () => {
    const t = useTranslations('Legal.cookies');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAction = (type: 'accept' | 'decline') => {
        localStorage.setItem('cookie-consent', type);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-24 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:max-w-md z-[1002]"
                >
                    <Card className="bg-background/80 backdrop-blur-md border-brand-500/20 shadow-2xl">
                        <CardBody className="p-6">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-brand-500/10 rounded-xl text-brand-500">
                                    <Cookie size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold mb-1">{t('title')}</h4>
                                    <p className="text-sm text-default-500 mb-4 leading-relaxed">
                                        {t('description')}
                                        <Link 
                                            href="/legal" 
                                            className="ml-1 text-brand-500 hover:underline inline-block"
                                        >
                                            {t('more')}
                                        </Link>
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                        <Button 
                                            size="sm" 
                                            variant="light" 
                                            onPress={() => handleAction('decline')}
                                        >
                                            {t('decline')}
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="bg-brand-500 text-white font-medium"
                                            onPress={() => handleAction('accept')}
                                        >
                                            {t('accept')}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="absolute top-2 right-2 min-w-0 h-auto p-1"
                                    onPress={() => setIsVisible(false)}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
