/**
 * НАЗНАЧЕНИЕ: Компонент-оркестратор фоновой синхронизации данных
 * ЗАВИСИМОСТИ: @/hooks/useSyncEngine, @/lib/store/useFermentationStore, @/lib/store/useHistoryStore
 * ОСОБЕННОСТИ: Headless-компонент, запускает синхронизацию по таймеру и сетевым событиям
 */

"use client";

import { useEffect } from "react";
import { useSyncEngine } from "@/hooks/useSyncEngine";

export function SyncEngine() {
  const { syncAll } = useSyncEngine();

  // Первоначальная загрузка из БД при монтировании
  useEffect(() => {
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

  // Периодическая проверка несохраненных изменений (каждые 3 минуты)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (navigator.onLine && document.visibilityState === 'visible') {
        syncAll();
      }
    }, 180000); // 3 минуты

    // Синхронизация при возврате во вкладку
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        syncAll();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

