/**
 * НАЗНАЧЕНИЕ: Парсинг и чтение MDX файлов из файловой системы
 * ЗАВИСИМОСТИ: fs, path, gray-matter, src/types/docs
 * ОСОБЕННОСТИ: Чтение локализованных статей по слагу
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Doc, DocFrontmatter } from '@/types/docs';

const docsDirectory = path.join(process.cwd(), 'src/content/docs');

// Получение списка всех статей для определенной локали
export function getDocs(locale: string): Doc[] {
    const localeDir = path.join(docsDirectory, locale);
    
    if (!fs.existsSync(localeDir)) {
        return [];
    }

    const fileNames = fs.readdirSync(localeDir);
    
    const docs = fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '');
            const fullPath = path.join(localeDir, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            
            const { data, content } = matter(fileContents);
            
            return {
                slug,
                frontmatter: data as DocFrontmatter,
                content
            };
        })
        .sort((a, b) => {
            if (a.frontmatter.date < b.frontmatter.date) {
                return 1;
            } else {
                return -1;
            }
        });

    return docs;
}

// Получение одной статьи по слагу и локали
export function getDocBySlug(slug: string, locale: string): Doc | null {
    const fullPath = path.join(docsDirectory, locale, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
        slug,
        frontmatter: data as DocFrontmatter,
        content
    };
}
