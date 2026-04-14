'use client';

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from 'next/navigation';

import { TRPCReactProvider } from "@/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <TRPCReactProvider>
            <HeroUIProvider navigate={router.push}>
                {children}
            </HeroUIProvider>
        </TRPCReactProvider>
    );
}
