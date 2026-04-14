/**
 * НАЗНАЧЕНИЕ: Компонент-оркестратор фоновой синхронизации данных
 * ЗАВИСИМОСТИ: @/hooks/useSyncEngine, @/lib/store/useFermentationStore, @/lib/store/useHistoryStore
 * ОСОБЕННОСТИ: Headless-компонент, запускает синхронизацию по таймеру и сетевым событиям
 */

"use client";

import { useEffect, useState } from "react";
import { useFermentationStore } from "@/lib/store/useFermentationStore";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { useSyncEngine } from "@/hooks/useSyncEngine";

export function SyncEngine() {
  const [isMounted, setIsMounted] = useState(false);
  const { barrels } = useFermentationStore();
  const { records } = useHistoryStore();
  const { pushLocalData } = useSyncEngine();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Мониторинг восстановления интернет-соединения
  useEffect(() => {
    const handleOnline = () => {
      pushLocalData();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [pushLocalData]);

  // Периодическая проверка несохраненных изменений (каждые 30 секунд)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        pushLocalData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [pushLocalData]);

  // Триггер синхронизации при изменении данных в сторах с дебаунсом 2сек
  useEffect(() => {
    if (!isMounted || !navigator.onLine) return;

    const handler = setTimeout(() => {
      pushLocalData();
    }, 2000);

    return () => clearTimeout(handler);
  }, [barrels, records, isMounted, pushLocalData]);

  return null;
}
