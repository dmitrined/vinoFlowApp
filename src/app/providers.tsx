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
