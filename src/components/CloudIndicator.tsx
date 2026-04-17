/**
 * НАЗНАЧЕНИЕ: Визуальный индикатор статуса облачной синхронизации
 * ЗАВИСИМОСТИ: lucide-react, @/lib/store/useFermentationStore, @/lib/store/useHistoryStore, @heroui/react
 * ОСОБЕННОСТИ: Динамическое отслеживание состояния сети и наличия несохраненных изменений в сторах
 */

"use client";

import React, { useEffect, useState } from "react";
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { useFermentationStore } from "@/lib/store/useFermentationStore";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { useSyncStore } from "@/lib/store/useSyncStore";
import { Tooltip } from "@heroui/react";
import { useTranslations } from "next-intl";

export const CloudIndicator = () => {
  const t = useTranslations("SyncEngine");
  const [isMounted, setIsMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const resetSync = useSyncStore(s => s.resetSync);

  // Глобальное состояние процесса синхронизации
  const isGlobalSyncing = useSyncStore((s) => s.isSyncing);

  // Подписка на состояния Zustand сторов для отслеживания флага synced
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

  // Проверка наличия несинхронизированных данных любого типа
  const hasUnsyncedBarrels = barrels.some((b) => b.synced === false);
  const hasUnsyncedReadings = barrels.some((b) => b.readings.some((r) => r.synced === false));
  const hasUnsyncedAdditions = barrels.some((b) => (b.additions || []).some((a) => a.synced === false));
  const hasUnsyncedHistory = records.some((h) => h.synced === false);

  const isSyncing = isGlobalSyncing || hasUnsyncedBarrels || hasUnsyncedReadings || hasUnsyncedAdditions || hasUnsyncedHistory;

  // Состояние: Оффлайн
  if (!isOnline) {
    return (
      <Tooltip content={t("offline")} placement="bottom">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
          <CloudOff size={16} />
        </div>
      </Tooltip>
    );
  }

  // Состояние: Идет процесс синхронизации или есть несохраненные изменения
  if (isSyncing) {
    return (
      <Tooltip content={t("syncing")} placement="bottom">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 relative">
          <RefreshCw size={16} className="animate-spin" />
        </div>
      </Tooltip>
    );
  }

  // Состояние: Все данные в облаке
  
  return (
    <Tooltip content={t("synced") + " (Click to force full sync)"} placement="bottom">
      <div 
        className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-600 cursor-pointer hover:bg-green-500/20 transition-colors"
        onClick={() => {
          resetSync();
          // Перезагрузка страницы самый простой способ запустить новый цикл с чистым флагом since
          window.location.reload();
        }}
      >
        <Cloud size={16} />
        <CheckCircle2 size={8} className="absolute bottom-1 right-1 text-green-500 bg-white dark:bg-zinc-900 rounded-full" />
      </div>
    </Tooltip>
  );
};
