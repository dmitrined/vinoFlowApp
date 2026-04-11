/**
 * НАЗНАЧЕНИЕ: Модальное окно для добавления или редактирования записи брожения
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, fermentation.ts
 * ОСОБЕННОСТИ: Валидация ввода, автоматическая подстановка даты
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input
} from "@heroui/react";
import { Beaker, Thermometer, Calendar } from "lucide-react";
import { Reading } from '@/types/fermentation';
import { useTranslations } from 'next-intl';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (oechsle: number, temp: number, date: string) => void;
    initialData?: Reading | null;
}

export const ReadingModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
    const t = useTranslations('Fermentation');
    const [oechsle, setOechsle] = useState<string>('');
    const [temp, setTemp] = useState<string>('');
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        if (initialData) {
            setOechsle(initialData.oechsle.toString());
            setTemp(initialData.temperature.toString());
            setDate(initialData.date);
        } else {
            setOechsle('');
            setTemp('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [initialData, isOpen]);

    const handleSave = () => {
        const o = parseFloat(oechsle);
        const tVal = parseFloat(temp);
        if (!isNaN(o) && !isNaN(tVal)) {
            onSave(o, tVal, date);
            onClose();
        }
    };

    const isInvalid = !oechsle || !temp || isNaN(parseFloat(oechsle)) || isNaN(parseFloat(temp));

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            placement="center"
            scrollBehavior="inside"
            size="sm"
            backdrop="blur"
            classNames={{
                base: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 m-4",
                header: "border-b border-zinc-100 dark:border-zinc-800",
                footer: "border-t border-zinc-100 dark:border-zinc-800"
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-black text-tech-gradient uppercase italic">
                        {initialData ? t('edit-reading') : t('add-reading')}
                    </h2>
                </ModalHeader>
                <ModalBody className="py-6 space-y-4">
                    <Input
                        type="date"
                        label={t('date')}
                        labelPlacement="outside"
                        value={date}
                        onValueChange={setDate}
                        startContent={<Calendar size={18} className="text-zinc-400" />}
                        variant="flat"
                        className="font-bold"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label={t('oechsle')}
                            labelPlacement="outside"
                            placeholder="95"
                            value={oechsle}
                            onValueChange={setOechsle}
                            startContent={<Beaker size={18} className="text-brand-500" />}
                            variant="flat"
                            className="font-bold"
                            isRequired
                            isInvalid={oechsle !== '' && isNaN(parseFloat(oechsle))}
                        />
                        <Input
                            type="number"
                            label={t('temperature')}
                            labelPlacement="outside"
                            placeholder="18"
                            value={temp}
                            onValueChange={setTemp}
                            startContent={<Thermometer size={18} className="text-orange-500" />}
                            variant="flat"
                            className="font-bold"
                            isRequired
                            isInvalid={temp !== '' && isNaN(parseFloat(temp))}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" className="font-bold uppercase tracking-widest text-xs" onPress={onClose}>
                        {t('cancel')}
                    </Button>
                    <Button 
                        color="primary" 
                        className="font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-500/20" 
                        onPress={handleSave}
                        isDisabled={isInvalid}
                    >
                        {t('save')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
