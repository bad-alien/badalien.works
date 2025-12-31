'use client';

import { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface WeeklyPatternProps {
  data: { day: string; hour: number; value: number }[];
  config: {
    color: string;
    unit?: string;
  };
  title?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface TooltipPayload {
  payload: {
    day: string;
    hour: number;
    value: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  unit?: string;
}

const CustomTooltip = ({ active, payload, unit }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 border border-neutral-800 p-3 rounded shadow-xl backdrop-blur-sm">
        <p className="text-neutral-400 text-sm mb-1">{data.day} @ {data.hour}:00</p>
        <p className="text-white font-mono text-lg font-bold">
          {data.value}
          <span className="text-neutral-500 text-xs ml-1">{unit || 'min'}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyPatternChart({ data, config, title }: WeeklyPatternProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Transform data: Map day string to index (0-6) for Y-axis placement
  // Reversing index so Mon is at top or bottom as preferred. 
  // Let's go Sun (top, index 0) to Sat (bottom, index 6) or vice versa.
  // Standard charts usually have 0 at bottom. So Sat=0, Sun=6? 
  // Or render Custom YAxis ticks.
  const processedData = data.map(item => ({
    ...item,
    dayIndex: DAYS.indexOf(item.day), // 0=Sun, 6=Sat
  }));

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
        {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-8">{title}</h3>}
        <div className="w-full h-[500px] bg-neutral-900/20 rounded-xl border border-neutral-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
      {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-8">{title}</h3>}
      
      <div className="w-full h-[500px] bg-neutral-900/20 rounded-xl border border-neutral-800 p-4 md:p-8 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis 
              type="number" 
              dataKey="hour" 
              name="hour" 
              domain={[0, 23]} 
              tickCount={12}
              stroke="#666" 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="number" 
              dataKey="dayIndex" 
              name="day" 
              domain={[0, 6]} 
              ticks={[0, 1, 2, 3, 4, 5, 6]}
              tickFormatter={(index) => DAYS[index]}
              stroke="#666" 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              reversed // Sun at top
            />
            <ZAxis type="number" dataKey="value" range={[50, 600]} name="intensity" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip unit={config.unit} />} />
            <Scatter data={processedData} fill={config.color} animationDuration={1500}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.color} fillOpacity={0.6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
