/**
 * НАЗНАЧЕНИЕ: Глобальная обертка провайдеров (HeroUI, tRPC, Framer Motion)
 * ЗАВИСИМОСТИ: @heroui/react, framer-motion, @/trpc/react
 * ОСОБЕННОСТИ: Client Component, LazyMotion для анимаций
 */
'use client';

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { LazyMotion, domAnimation } from "framer-motion";

import { TRPCReactProvider } from "@/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <TRPCReactProvider>
            <LazyMotion features={domAnimation}>
                <HeroUIProvider navigate={router.push}>
                    {children}
                </HeroUIProvider>
            </LazyMotion>
        </TRPCReactProvider>
    );
}
