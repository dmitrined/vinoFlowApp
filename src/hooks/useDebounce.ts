import { useState, useEffect } from 'react';

/**
 * Хук для дебаунса любого значения.
 * @param value Значение для дебаунса
 * @param delay Задержка в мс
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
