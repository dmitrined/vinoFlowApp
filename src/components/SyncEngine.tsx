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
  const { syncAll, pushLocalData } = useSyncEngine();

  // Первоначальная загрузка из БД при монтировании
  useEffect(() => {
    setIsMounted(true);
    if (navigator.onLine) {
        syncAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Только один раз при старте приложения

  // Мониторинг восстановления интернет-соединения
  useEffect(() => {
    const handleOnline = () => {
      syncAll();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Периодическая проверка несохраненных изменений (каждые 30 секунд)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        syncAll();
      }
    }, 30000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Триггер локальной выгрузки при изменении данных юзером (с дебаунсом 2сек)
  // ВАЖНО: Мы НЕ подписываемся на barrels здесь, так как мы хотим
  // чтобы этот эффект срабатывал только когда реально изменилось что-то ВНУТРИ стора.
  // Но для простоты и стабильности мы полагаемся на то, что syncAll
  // и так делает свою работу при входе на страницу и каждые 30 сек.
  // Если нужно сохранение "на лету", лучше делать его в самих действиях стора.
  
  return null;
}

