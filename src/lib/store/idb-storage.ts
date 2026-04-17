/**
 * НАЗНАЧЕНИЕ: Адаптер IndexedDB для Zustand Persistence
 * ЗАВИСИМОСТИ: idb-keyval
 * ОСОБЕННОСТИ: Реализует StateStorage интерфейс, поддерживает миграцию из localStorage
 */

import { StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

/**
 * Кастомный адаптер для хранения данных в IndexedDB
 */
export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // 1. Сначала пробуем получить данные из IndexedDB
    const value = await get<string>(name);
    if (value) return value;

    // 2. Если в IndexedDB пусто, проверяем localStorage (миграция)
    if (typeof window !== 'undefined') {
      const localValue = localStorage.getItem(name);
      if (localValue) {
        // Переносим данные в IndexedDB для будущего использования
        await set(name, localValue);
        // Не удаляем сразу из localStorage для безопасности, 
        // но в будущем будем брать из IDB
        return localValue;
      }
    }

    return null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
