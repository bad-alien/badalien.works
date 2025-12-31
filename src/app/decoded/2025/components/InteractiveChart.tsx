'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ChartProps {
  type: 'area' | 'bar';
  data: Record<string, string | number>[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  title?: string;
}

interface TooltipPayload {
  value: number;
  payload: Record<string, string | number>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 border border-neutral-800 p-3 rounded shadow-xl backdrop-blur-sm">
        <p className="text-neutral-400 text-sm mb-1">{label}</p>
        <p className="text-white font-mono text-lg font-bold">
          {payload[0].value}
          <span className="text-neutral-500 text-xs ml-1">units</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function InteractiveChart({ type, data, dataKey, xAxisKey, color = "#FF6B35", title }: ChartProps) {
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
                <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
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
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666', strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                fillOpacity={1} 
                fill={`url(#color${dataKey})`} 
                strokeWidth={3}
                animationDuration={2000}
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar 
                dataKey={dataKey} 
                fill={color} 
                radius={[4, 4, 0, 0]}
                animationDuration={2000}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
