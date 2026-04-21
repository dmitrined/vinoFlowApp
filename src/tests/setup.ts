/**
 * НАЗНАЧЕНИЕ: Глобальная настройка тестового окружения Vitest
 * ЗАВИСИМОСТИ: @testing-library/jest-dom
 * ОСОБЕННОСТИ: Моков необходимых браузерных API (например, ResizeObserver)
 */

import '@testing-library/jest-dom';

class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = MockResizeObserver;
