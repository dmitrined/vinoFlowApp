/**
 * НАЗНАЧЕНИЕ: Универсальное модальное окно подтверждения удаления
 * ЗАВИСИМОСТИ: @heroui/react
 */

'use client';

import React from 'react';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button 
} from "@heroui/react";
import { useTranslations } from 'next-intl';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, title, message }) => {
    const t = useTranslations('Fermentation');

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            placement="center"
            backdrop="blur"
            size="sm"
            classNames={{
                base: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 m-4",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-danger uppercase italic">{title}</h3>
                </ModalHeader>
                <ModalBody className="py-4">
                    <p className="text-sm font-bold text-zinc-500">{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" className="font-bold uppercase tracking-widest text-xs" onPress={onClose}>
                        {t('cancel')}
                    </Button>
                    <Button 
                        color="danger" 
                        className="font-black uppercase tracking-widest text-xs shadow-lg shadow-danger-500/20" 
                        onPress={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {t('delete-confirm-btn')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
