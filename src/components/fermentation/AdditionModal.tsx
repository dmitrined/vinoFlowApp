/**
 * НАЗНАЧЕНИЕ: Модальное окно для добавления ингредиентов/добавок
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react
 * ОСОБЕННОСТИ: Пресеты ингредиентов, выбор дозировки и даты
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
    Input,
    Select,
    SelectItem
} from "@heroui/react";
import { useTranslations } from 'next-intl';
import { Addition } from '@/types/fermentation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, dosage: number, unit: string, date: string) => void;
    initialData?: Addition | null;
}

export const AdditionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
    const t = useTranslations('Fermentation');
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [unit, setUnit] = useState('g/L');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const units = ['g/L', 'g/hl', 'g/1000L'];

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
                setDosage(initialData.dosage.toString());
                setUnit(initialData.unit);
                setDate(initialData.date);
            } else {
                setName('');
                setDosage('');
                setUnit('g/L');
                setDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        const dNum = parseFloat(dosage);
        if (name && !isNaN(dNum)) {
            onSave(name, dNum, unit, date);
            onClose();
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            placement="center"
            backdrop="blur"
            classNames={{
                base: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 m-4",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-tech-gradient uppercase italic">{t('add-addition')}</h3>
                </ModalHeader>
                <ModalBody className="py-6 space-y-4">
                    <Input
                        autoFocus
                        label={t('ingredient')}
                        placeholder={t('name-placeholder')}
                        variant="flat"
                        value={name}
                        onValueChange={setName}
                        className="font-bold"
                    />

                    <div className="flex gap-3">
                        <Input
                            type="number"
                            label={t('dosage')}
                            placeholder="0.0"
                            variant="flat"
                            value={dosage}
                            onValueChange={setDosage}
                            className="font-bold flex-[2]"
                        />
                        <Select
                            label={t('unit')}
                            variant="flat"
                            selectedKeys={[unit]}
                            onSelectionChange={(keys) => setUnit(Array.from(keys)[0] as string)}
                            className="font-bold flex-1"
                        >
                            {units.map((u) => (
                                <SelectItem key={u}>
                                    {u}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <Input
                        type="date"
                        label={t('date')}
                        variant="flat"
                        value={date}
                        onValueChange={setDate}
                        className="font-bold"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" className="font-bold uppercase tracking-widest text-xs" onPress={onClose}>
                        {t('cancel')}
                    </Button>
                    <Button 
                        color="primary" 
                        className="font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-500/20" 
                        onPress={handleSave}
                        isDisabled={!name || !dosage}
                    >
                        {t('save')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
