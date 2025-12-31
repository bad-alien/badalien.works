'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

interface ChartConfig {
  xaxis_key: string;
  series: ChartSeries[];
  unit?: string;
}

interface ChartProps {
  type: 'area' | 'bar';
  data: Record<string, string | number>[];
  config: ChartConfig;
  title?: string;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload: Record<string, string | number>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  unit?: string;
}

const CustomTooltip = ({ active, payload, label, unit }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-neutral-800 p-4 rounded shadow-2xl backdrop-blur-md min-w-[200px]">
        <p className="text-neutral-400 text-sm mb-3 font-mono border-b border-neutral-800 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-neutral-300 text-sm">{entry.name}</span>
              </div>
              <p className="text-white font-mono font-bold">
                {entry.value}
                {unit && <span className="text-neutral-600 text-xs ml-1">{unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function InteractiveChart({ type, data, config, title }: ChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
        {title && (
          <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-8">{title}</h3>
        )}
        <div className="w-full h-[400px] bg-neutral-900/20 rounded-xl border border-neutral-800 p-4 md:p-8 backdrop-blur-sm animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
      {title && (
        <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-8">{title}</h3>
      )}
      
      <div className="w-full h-[400px] bg-neutral-900/20 rounded-xl border border-neutral-800 p-4 md:p-8 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                {config.series.map((s) => (
                  <linearGradient key={s.key} id={`color${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey={config.xaxis_key} 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip unit={config.unit} />} 
                cursor={{ stroke: '#666', strokeDasharray: '4 4' }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {config.series.map((s) => (
                <Area 
                  key={s.key}
                  type="monotone" 
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color} 
                  fillOpacity={1} 
                  fill={`url(#color${s.key})`} 
                  strokeWidth={3}
                  animationDuration={2000}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey={config.xaxis_key} 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip unit={config.unit} />} 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {config.series.map((s) => (
                <Bar 
                  key={s.key}
                  dataKey={s.key} 
                  name={s.label}
                  fill={s.color} 
                  radius={[4, 4, 0, 0]}
                  animationDuration={2000}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
