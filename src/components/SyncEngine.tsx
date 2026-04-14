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
  const { syncAll, pushLocalData } = useSyncEngine();

  // Первоначальная загрузка из БД при монтировании
  useEffect(() => {
    setIsMounted(true);
    if (navigator.onLine) {
        syncAll(); // Тянем свежие данные с сервера при старте
    }
  }, [syncAll]);

  // Мониторинг восстановления интернет-соединения
  useEffect(() => {
    const handleOnline = () => {
      syncAll(); // Когда возвращаемся в онлайн — и отдаем, и забираем
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncAll]);

  // Периодическая проверка несохраненных изменений (каждые 30 секунд двусторонняя синхронизация)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        syncAll();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [syncAll]);

  // Триггер локальной выгрузки при изменении данных юзером (с дебаунсом 2сек)
  // Мы делаем push, так как это реакция на локальные действия.
  // Можно было бы делать syncAll, но pushLocalData работает быстрее.
  useEffect(() => {
    if (!isMounted || !navigator.onLine) return;

    const handler = setTimeout(() => {
      pushLocalData();
    }, 2000);

    return () => clearTimeout(handler);
  }, [barrels, records, isMounted, pushLocalData]);

  return null;
}
