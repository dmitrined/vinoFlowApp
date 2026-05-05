/**
 * НАЗНАЧЕНИЕ: Типы для раздела базы знаний (Knowledge Hub)
 * ЗАВИСИМОСТИ: Нет
 * ОСОБЕННОСТИ: Описывает метаданные (Frontmatter) для статей
 */

export interface DocFrontmatter {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: number;
    category: string;
    relatedTools: string[];
}

export interface Doc {
    slug: string;
    frontmatter: DocFrontmatter;
    content: string;
}
