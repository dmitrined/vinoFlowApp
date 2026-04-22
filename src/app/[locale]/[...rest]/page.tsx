/**
 * НАЗНАЧЕНИЕ: Универсальный перехватчик (Catch-all) для некорректных путей
 * ЗАВИСИМОСТИ: next/navigation
 * ОСОБЕННОСТИ: Принудительно вызывает страницу notFound для локализованных путей
 */

import {notFound} from 'next/navigation';

export default function CatchAllPage() {
  notFound();
}
