/**
 * НАЗНАЧЕНИЕ: Визуализация динамики брожения с метками добавок
 * ЗАВИСИМОСТИ: recharts, fermentation.ts
 * ОСОБЕННОСТИ: Использование ComposedChart для надежного отображения меток через Bar
 */

'use client';

import React, { useMemo } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Reading, Addition } from '@/types/fermentation';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/dateUtils';

interface Props {
    data: Reading[];
    additions?: Addition[];
}

interface TooltipPayload {
    color: string;
    dataKey: string;
    name: string;
    value: number | string;
    payload: {
        date: string;
        additionNames?: string;
        [key: string]: unknown;
    };
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
    t: (key: string) => string;
}

const CustomTooltip = ({ active, payload, label, t }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                    {String(payload[0].payload.fullDay)} ({formatDate(label || '')})
                </p>
                {payload.map((entry: TooltipPayload, index: number) => {
                    if (entry.dataKey === 'additionVal') {
                        if (!entry.payload.additionNames) return null;
                        return (
                            <div key={index} className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-[9px] font-black text-brand-600 uppercase italic">
                                    {t('added')}: {entry.payload.additionNames}
                                </p>
                            </div>
                        );
                    }
                    return (
                        <p key={index} className="text-sm font-black flex justify-between gap-4" style={{ color: entry.color }}>
                            <span>{entry.name}:</span>
                            <span>{entry.value}{entry.dataKey === 'temperature' ? '°C' : '°'}</span>
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

export const FermentationChart: React.FC<Props> = ({ data, additions = [] }) => {
    const t = useTranslations('Fermentation');

    // Подготовка данных: объединяем замеры и добавки, рассчитываем номера дней
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const firstReadingDate = new Date(sorted[0].date);
        
        return sorted.map(reading => {
            const currentDate = new Date(reading.date);
            const diffTime = Math.abs(currentDate.getTime() - firstReadingDate.getTime());
            // Добавляем 1, чтобы первый день был "День 1"
            const dayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            const dayAdditions = additions.filter(a => a.date === reading.date);
            return {
                ...reading,
                dayNumber: `D${dayNumber}`, // Префикс D для краткости на оси
                fullDay: `${t('date')} ${dayNumber}`, // Для тултипа
                additionVal: dayAdditions.length > 0 ? 100 : 0,
                additionNames: dayAdditions.map(a => a.name).join(', ')
            };
        });
    }, [data, additions, t]);

    return (
        <div className="w-full h-[400px] p-4 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 relative group">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={chartData}
                    margin={{ top: 40, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={false} 
                        stroke="rgba(161, 161, 170, 0.1)" 
                    />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val, index) => {
                            const item = chartData[index];
                            return item ? item.dayNumber : val;
                        }}
                        tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis 
                        yAxisId="left" 
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6453e9', fontSize: 10, fontWeight: 900 }}
                        width={30}
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        domain={[0, 40]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#f97316', fontSize: 10, fontWeight: 900 }}
                        width={30}
                    />
                    
                    <Tooltip content={<CustomTooltip t={t} />} />

                    <Legend 
                        verticalAlign="top" 
                        align="right" 
                        iconType="circle"
                        content={() => (
                            <div className="flex justify-end gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('oechsle')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('temp-short')}</span>
                                </div>
                            </div>
                        )}
                    />

                    {/* Вертикальные линии добавок через тонкий Bar */}
                    <Bar 
                        yAxisId="left"
                        dataKey="additionVal" 
                        barSize={2} 
                        isAnimationActive={false}
                        label={{ 
                            position: 'top', 
                            dataKey: 'additionNames', 
                            fill: '#6453e9', 
                            fontSize: 10, 
                            fontWeight: 'bold',
                            className: 'uppercase italic'
                        }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.additionVal > 0 ? '#6453e9' : 'transparent'} />
                        ))}
                    </Bar>

                    <Line
                        yAxisId="left"
                        name="Oechsle"
                        type="monotone"
                        dataKey="oechsle"
                        stroke="#6453e9"
                        strokeWidth={4}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6453e9' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        animationDuration={1500}
                    />
                    <Line
                        yAxisId="right"
                        name="Temperature"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#f97316"
                        strokeWidth={4}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#f97316' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        animationDuration={1500}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
