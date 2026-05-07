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
    try {
      // Политика очистки (TTL) для предотвращения переполнения IndexedDB
      if (name === 'vinoflow-fermentation-storage') {
        const parsed = JSON.parse(value);
        if (parsed?.state?.barrels) {
          const ttlDate = new Date();
          ttlDate.setDate(ttlDate.getDate() - 30); // 30 дней TTL
          
          interface StoreEntity {
            isDeleted?: boolean;
            synced?: boolean;
            updatedAt: string;
          }
          
          interface StoreBarrel extends StoreEntity {
            readings?: StoreEntity[];
            additions?: StoreEntity[];
          }

          parsed.state.barrels = parsed.state.barrels.filter((b: StoreBarrel) => {
            // Удаляем локально бочки, которые удалены, синхронизированы и старше 30 дней
            if (b.isDeleted && b.synced && new Date(b.updatedAt) < ttlDate) return false;
            
            if (b.readings) {
              b.readings = b.readings.filter((r: StoreEntity) => !(r.isDeleted && r.synced && new Date(r.updatedAt) < ttlDate));
            }
            if (b.additions) {
              b.additions = b.additions.filter((a: StoreEntity) => !(a.isDeleted && a.synced && new Date(a.updatedAt) < ttlDate));
            }
            return true;
          });
          
          value = JSON.stringify(parsed);
        }
      }
    } catch (e) {
      console.warn('IDB Storage TTL Cleanup Error:', e);
    }
    
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
