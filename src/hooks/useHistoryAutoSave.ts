import { useEffect, useRef, useState } from 'react';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useDebounce } from './useDebounce';
import { AutoSaveRecord } from '@/types/calculations';

/**
 * Хук для автоматического сохранения результатов расчетов в историю с дебаунсом.
 * 
 * @param records Один или несколько рекордов для сохранения
 * @param trigger Значение, изменение которого инициализирует таймер (например, сам результат)
 * @param delay Задержка перед сохранением (дефолт 3000мс)
 */
export function useHistoryAutoSave(
    records: AutoSaveRecord | (AutoSaveRecord | null)[] | null,
    trigger: unknown,
    delay: number = 10000
) {
    const { addRecord } = useHistoryStore();
    const [showFeedback] = useState(false);
    
    // Дебаунсим триггер (результат)
    const debouncedTrigger = useDebounce(trigger, delay);
    
    // Используем Ref для доступа к актуальным данным в момент срабатывания дебаунса
    const recordsRef = useRef(records);
    recordsRef.current = records;

    useEffect(() => {
        // Если триггер ложный (например результат 0) - не сохраняем
        if (!debouncedTrigger) return;

        const data = recordsRef.current;
        if (!data) return;

        if (Array.isArray(data)) {
            data.forEach(r => {
                if (r) addRecord(r);
            });
        } else {
            addRecord(data);
        }

        // Фидбек отключен по просьбе пользователя
    }, [debouncedTrigger, addRecord]);

    return { showFeedback };
}
