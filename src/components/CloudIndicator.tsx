/**
 * НАЗНАЧЕНИЕ: Визуальный индикатор статуса облачной синхронизации
 * ЗАВИСИМОСТИ: lucide-react, @/lib/store/useFermentationStore, @/lib/store/useHistoryStore, @heroui/react
 * ОСОБЕННОСТИ: Динамическое отслеживание состояния сети и наличия несохраненных изменений в сторах
 */

"use client";

import React, { useEffect, useState } from "react";
import { Cloud, CloudOff, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import { useFermentationStore } from "@/lib/store/useFermentationStore";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { useSyncStore } from "@/lib/store/useSyncStore";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { useTranslations } from "next-intl";

export const CloudIndicator = () => {
    const t = useTranslations("SyncEngine");
    const [isMounted, setIsMounted] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const resetSync = useSyncStore(s => s.resetSync);

    const isGlobalSyncing = useSyncStore((s) => s.isSyncing);
    const barrels = useFermentationStore((state) => state.barrels);
    const records = useHistoryStore((state) => state.records);

    useEffect(() => {
        setIsMounted(true);
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!isMounted) return null;

    const hasUnsyncedBarrels = barrels.some((b) => b.synced === false);
    const hasUnsyncedReadings = barrels.some((b) => b.readings.some((r) => r.synced === false));
    const hasUnsyncedAdditions = barrels.some((b) => (b.additions || []).some((a) => a.synced === false));
    const hasUnsyncedHistory = records.some((h) => h.synced === false);

    const isSyncing = isGlobalSyncing || hasUnsyncedBarrels || hasUnsyncedReadings || hasUnsyncedAdditions || hasUnsyncedHistory;

    const renderIcon = () => {
        if (!isOnline) return <CloudOff size={18} className="text-zinc-400" />;
        if (isSyncing) return <RefreshCw size={18} className="text-brand-600 animate-spin" />;
        return (
            <div className="relative">
                <Cloud size={18} className="text-green-600" />
                <CheckCircle2 size={8} className="absolute -bottom-1 -right-1 text-green-500 bg-white dark:bg-zinc-900 rounded-full" />
            </div>
        );
    };

    return (
        <Popover placement="bottom-end" backdrop="blur" classNames={{
            content: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-2xl min-w-[200px]"
        }}>
            <PopoverTrigger>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all active:scale-95 ${
                    !isOnline ? 'bg-zinc-100 dark:bg-zinc-800' : 
                    isSyncing ? 'bg-brand-500/10' : 'bg-green-500/10 hover:bg-green-500/20'
                }`}>
                    {renderIcon()}
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Cloud Status
                        </p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {!isOnline ? t("offline") : isSyncing ? t("syncing") : t("synced")}
                        </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-[9px] text-zinc-400 mb-2 leading-relaxed font-medium">
                            Use this only if your data is out of sync or if you reset the database.
                        </p>
                        <Button 
                            color="danger" 
                            variant="flat" 
                            size="sm" 
                            className="w-full font-black uppercase tracking-widest text-[10px] h-9"
                            startContent={<ShieldAlert size={14} />}
                            onPress={() => {
                                resetSync();
                                window.location.reload();
                            }}
                        >
                            Reset & Full Sync
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
