import { useEffect, useRef, useState } from 'react';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useDebounce } from './useDebounce';
import { CalculationType, AutoSaveRecord } from '@/types/calculations';

/**
 * Хук для автоматического сохранения результатов расчетов в историю с дебаунсом.
 * 
 * @param records Один или несколько рекордов для сохранения
 * @param trigger Значение, изменение которого инициализирует таймер (например, сам результат)
 * @param delay Задержка перед сохранением (дефолт 3000мс)
 */
export function useHistoryAutoSave(
    records: AutoSaveRecord | (AutoSaveRecord | null)[] | null,
    trigger: any,
    delay: number = 3000
) {
    const { addRecord } = useHistoryStore();
    const [showFeedback, setShowFeedback] = useState(false);
    
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

        // Показываем фидбек
        setShowFeedback(true);
        const timer = setTimeout(() => setShowFeedback(false), 2000);
        return () => clearTimeout(timer);
    }, [debouncedTrigger, addRecord]);

    return { showFeedback };
}
