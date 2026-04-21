/**
 * НАЗНАЧЕНИЕ: Поверхностные UI-тесты (Smoke Tests) основных страниц
 * ЗАВИСИМОСТИ: vitest, @testing-library/react, @/tests/utils/test-utils
 * ОСОБЕННОСТИ: Проверка корректности рендеринга без падений
 */

import React, { ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Home from '../../app/[locale]/page';
import FermentationDashboard from '../../app/[locale]/fermentation/page';
import FormulSo2Calc from '../../app/[locale]/so2-rechner/FormulSo2Calc';

// Мок Recharts для корректной работы в JSDOM
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    LineChart: () => <div data-testid="line-chart" />,
    Line: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
}));

// Мок Framer Motion для ускорения тестов и предотвращения runtime-ошибок
vi.mock('framer-motion', () => ({
    m: {
        section: ({ children, ...props }: { children: ReactNode }) => <section {...props}>{children}</section>,
        div: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

test('renders Home page without crashing', () => {
    render(<Home />);
    // Проверка наличия логотипа VinoFlow
    expect(screen.getByText(/Vino/i)).toBeDefined();
    expect(screen.getByText(/Flow/i)).toBeDefined();
});

test('renders Fermentation list page without crashing', () => {
    render(<FermentationDashboard />);
    // Проверка наличия основного заголовка уровня h1
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
});

test('renders SO2 Calculator page without crashing', () => {
    render(<FormulSo2Calc />);
    // Проверка наличия заголовка калькулятора
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
});
