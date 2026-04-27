/**
 * НАЗНАЧЕНИЕ: Визуальный индикатор статуса облачной синхронизации
 * ЗАВИСИМОСТИ: lucide-react, @/lib/store/useFermentationStore, @/lib/store/useHistoryStore, @/hooks/useSyncEngine, @heroui/react
 * ОСОБЕННОСТИ: Динамическое отслеживание состояния сети, времени последней синхронизации и ручной запуск syncAll
 */

"use client";

import React, { useEffect, useState } from "react";
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { useFermentationStore } from "@/lib/store/useFermentationStore";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { useSyncStore } from "@/lib/store/useSyncStore";
import { useSyncEngine } from "@/hooks/useSyncEngine";
import { 
    Popover, 
    PopoverTrigger, 
    PopoverContent, 
    Button
} from "@heroui/react";
import { useTranslations } from "next-intl";

export const CloudIndicator = () => {
    const t = useTranslations("SyncEngine");
    const [isMounted, setIsMounted] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const isGlobalSyncing = useSyncStore((s) => s.isSyncing);
    const lastSyncTimestamp = useSyncStore((s) => s.lastSyncTimestamp);
    const { syncAll } = useSyncEngine();
    
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
        <>
            <Popover 
                isOpen={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                placement="bottom-end" 
                backdrop="blur" 
                classNames={{
                    content: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-2xl min-w-[200px]"
                }}
            >
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
                                {t("title")}
                            </p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {!isOnline ? t("offline") : isSyncing ? t("syncing") : t("synced")}
                            </p>
                            {!isSyncing && isOnline && lastSyncTimestamp && (
                                <p className="text-[10px] font-medium text-zinc-500 mt-1">
                                    {t("last_sync")} {new Date(lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>

                        <div className="pt-2 flex gap-2">
                            <Button 
                                color="primary" 
                                variant="flat" 
                                size="sm" 
                                className="flex-1 font-black uppercase tracking-widest text-[10px] h-9"
                                startContent={<RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />}
                                onPress={() => {
                                    syncAll();
                                    setIsPopoverOpen(false);
                                }}
                                isDisabled={!isOnline || isSyncing}
                            >
                                {t("sync_now")}
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};
