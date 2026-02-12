'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Image from 'next/image';

interface UserData {
  name: string;
  join_date: string;
  image_asset_name: string;
  play_time: {
    total: string;
    movie: string;
    tv: string;
    music: string;
  };
}

interface UserUsageChartProps {
  users: UserData[];
  year: string;
  title?: string;
}

const CATEGORIES = [
  { key: 'movie', label: 'Movies', color: '#e74c3c' },
  { key: 'tv', label: 'TV Shows', color: '#3498db' },
  { key: 'music', label: 'Music', color: '#2ecc71' },
];

// Users to exclude from the chart bars (but include in totals)
const EXCLUDED_USERS = ['car4338', 'spamw2', 'natalietice'];

// Parse time string like "4d 16h" or "0d 0h" to hours
function parseTimeToHours(timeStr: string): number {
  const match = timeStr.match(/(\d+)d\s*(\d+)h/);
  if (match) {
    const days = parseInt(match[1], 10);
    const hours = parseInt(match[2], 10);
    return days * 24 + hours;
  }
  return 0;
}

// Format hours back to readable string
function formatHours(hours: number): string {
  if (hours === 0) return '0h';
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days === 0) return `${remainingHours}h`;
  if (remainingHours === 0) return `${days}d`;
  return `${days}d ${remainingHours}h`;
}

// Mobile-friendly: show just days with + if there are remaining hours
function formatDaysPlus(hours: number): string {
  if (hours === 0) return '0h';
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days === 0) return `${remainingHours}h`;
  return remainingHours > 0 ? `${days}d+` : `${days}d`;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload: {
    name: string;
    movie: number;
    tv: number;
    music: number;
    total: number;
    image_asset_name: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  year: string;
}

const CustomTooltip = ({ active, payload, year }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/95 border border-neutral-700 rounded-lg p-4 shadow-2xl backdrop-blur-sm min-w-[200px]">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-neutral-800">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-void-orange">
            <Image
              src={`/decoded/assets/${year}/${data.image_asset_name}`}
              alt={data.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{data.name}</p>
            <p className="text-void-orange font-mono text-xs">{formatHours(data.total)} total</p>
          </div>
        </div>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <div key={cat.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-neutral-400 text-xs">{cat.label}</span>
              </div>
              <span className="text-white font-mono text-xs font-bold">
                {formatHours(data[cat.key as keyof typeof data] as number)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function UserUsageChart({ users, year, title }: UserUsageChartProps) {
  const [mounted, setMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Process all user data (for totals calculation)
  const allUserData = useMemo(() => {
    return users.map(user => ({
      name: user.name,
      movie: parseTimeToHours(user.play_time.movie),
      tv: parseTimeToHours(user.play_time.tv),
      music: parseTimeToHours(user.play_time.music),
      total: parseTimeToHours(user.play_time.total),
      image_asset_name: user.image_asset_name,
    }));
  }, [users]);

  // Filter and sort user data for chart display (excludes certain users)
  const chartData = useMemo(() => {
    return allUserData
      .filter(user => !EXCLUDED_USERS.includes(user.name))
      .sort((a, b) => b.total - a.total); // Sort descending by total
  }, [allUserData]);

  // Calculate totals for stats panel (includes ALL users)
  const totals = useMemo(() => {
    return allUserData.reduce(
      (acc, user) => ({
        movie: acc.movie + user.movie,
        tv: acc.tv + user.tv,
        music: acc.music + user.music,
        total: acc.total + user.total,
      }),
      { movie: 0, tv: 0, music: 0, total: 0 }
    );
  }, [allUserData]);

  useEffect(() => {
    setMounted(true);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  useEffect(() => {
    if (!mounted || !chartRef.current || hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
        {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-4 md:mb-8">{title}</h3>}
        <div className="w-full h-[400px] bg-neutral-900/20 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-6xl mx-auto">
      {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-4 md:mb-8">{title}</h3>}

      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Chart */}
        <div
          ref={chartRef}
          className="w-full md:flex-1 h-[350px] md:h-[400px]"
          style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.3s' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="15%">
              <defs>
                {CATEGORIES.map((cat) => (
                  <linearGradient key={cat.key} id={`grad-${cat.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cat.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={cat.color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#666"
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => isMobile ? formatDaysPlus(v) : formatHours(v)}
              />
              <Tooltip
                content={<CustomTooltip year={year} />}
                cursor={{ fill: 'rgba(255,107,53,0.1)' }}
              />
              {CATEGORIES.map((cat) => (
                <Bar
                  key={cat.key}
                  dataKey={cat.key}
                  stackId="usage"
                  fill={`url(#grad-${cat.key})`}
                  radius={cat.key === 'music' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  isAnimationActive={isInView}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Panel */}
        <div className="w-full md:w-40 flex flex-row md:flex-col justify-center items-center md:items-stretch gap-6 md:gap-0 md:space-y-4 pt-2 md:pt-0">
          <div className="text-center md:mb-4">
            <p className="text-void-orange font-mono text-2xl font-bold">{formatHours(totals.total)}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Total Playtime</p>
          </div>
          <div className="flex flex-row md:flex-col gap-4 md:gap-0 md:space-y-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2 md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-neutral-400 text-xs">{cat.label}</span>
                </div>
                <span className="text-white font-mono font-bold text-sm">
                  {isMobile ? formatDaysPlus(totals[cat.key as keyof typeof totals]) : formatHours(totals[cat.key as keyof typeof totals])}
                </span>
              </div>
            ))}
          </div>
          <div className="md:pt-4 md:border-t md:border-neutral-800 hidden md:block">
            <p className="text-neutral-500 text-xs text-center">
              {allUserData.length} users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
