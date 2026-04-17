/**
 * НАЗНАЧЕНИЕ: Универсальные утилиты для слияния данных (Last Write Wins)
 * ЗАВИСИМОСТИ: none
 * ОСОБЕННОСТИ: Работает с любыми массивами объектов, имеющими поля id и updatedAt
 */

export interface BaseSyncEntity {
  id: string;
  updatedAt: string | Date;
  isDeleted?: boolean;
}

/**
 * Объединяет локальный и серверный массивы объектов по стратегии Last Write Wins.
 * Если объект есть в обоих массивах, выбирается тот, у которого новее updatedAt.
 */
export function mergeEntities<T extends BaseSyncEntity>(
  local: T[],
  server: T[],
  defaultDefaults?: Partial<T>
): T[] {
  const localMap = new Map(local.map((item) => [item.id, item]));
  const mergedMap = new Map<string, T>();

  // Сначала обрабатываем серверные данные
  for (const sItem of server) {
    const lItem = localMap.get(sItem.id);
    if (!lItem) {
      // Новая запись с сервера
      mergedMap.set(sItem.id, { ...defaultDefaults, ...sItem } as T);
    } else {
      // Конфликт: выбираем по дате обновления
      const sTime = new Date(sItem.updatedAt).getTime();
      const lTime = new Date(lItem.updatedAt).getTime();

      if (sTime > lTime) {
        mergedMap.set(sItem.id, { ...lItem, ...sItem });
      } else {
        mergedMap.set(sItem.id, lItem);
      }
      localMap.delete(sItem.id);
    }
  }

  // Добавляем оставшиеся локальные данные, которых нет на сервере
  for (const lItem of localMap.values()) {
    mergedMap.set(lItem.id, lItem);
  }

  return Array.from(mergedMap.values());
}
