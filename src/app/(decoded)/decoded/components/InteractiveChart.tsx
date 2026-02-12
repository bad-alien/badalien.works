'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

interface UserJoin {
  username: string;
  date: string;
  avatar: string;
}

interface ChartProps {
  type: 'area' | 'bar';
  data: Record<string, string | number>[];
  config: {
    xaxis_key: string;
    series: { key: string; label: string; color: string }[];
  };
  title?: string;
  userJoins?: UserJoin[];
}

const SERIES = [
  { key: 'all', label: 'All', color: '#FF6B35' },
  { key: 'albums', label: 'Albums', color: '#00D26A' },
  { key: 'movies', label: 'Movies', color: '#e74c3c' },
  { key: 'seasons', label: 'TV Seasons', color: '#3498db' },
];

// Custom label component for join date markers - uses CSS hover only (no React state)
function JoinMarkerLabel({ viewBox, users, date }: {
  viewBox?: { x?: number; y?: number; height?: number };
  users: UserJoin[];
  date: string;
}) {
  const x = viewBox?.x ?? 0;
  const topY = 8;
  const avatarSize = 18;
  const gap = 3;

  return (
    <g className="join-marker-group">
      {/* Invisible wider hit area for easier hovering */}
      <rect
        x={x - 10}
        y={0}
        width={20}
        height={viewBox?.height ?? 300}
        fill="transparent"
        style={{ cursor: 'pointer' }}
      />
      {/* Small diamond marker at the top of the line */}
      <polygon
        className="join-marker-diamond"
        points={`${x},${topY - 4} ${x + 4},${topY} ${x},${topY + 4} ${x - 4},${topY}`}
        fill="rgba(255,255,255,0.35)"
      />
      {/* Tooltip - hidden by default, shown via CSS :hover */}
      <foreignObject
        className="join-marker-tooltip"
        x={x - 60}
        y={topY + 10}
        width={120}
        height={users.length * (avatarSize + gap) + 28}
        style={{ overflow: 'visible', pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(20,20,26,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '6px 8px',
            backdropFilter: 'blur(8px)',
            width: 120,
          }}
        >
          <div style={{ color: '#999', fontSize: 10, fontFamily: 'monospace', marginBottom: 4 }}>
            Joined {date}
          </div>
          {users.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: i > 0 ? gap : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u.avatar}
                alt={u.username}
                width={avatarSize}
                height={avatarSize}
                style={{ borderRadius: '50%', flexShrink: 0 }}
              />
              <span style={{ color: '#ddd', fontSize: 10, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {u.username}
              </span>
            </div>
          ))}
        </div>
      </foreignObject>
    </g>
  );
}

// Group user joins by date for stacking
function groupJoinsByDate(joins: UserJoin[]): Map<string, UserJoin[]> {
  const map = new Map<string, UserJoin[]>();
  for (const j of joins) {
    const existing = map.get(j.date) || [];
    existing.push(j);
    map.set(j.date, existing);
  }
  return map;
}

export default function InteractiveChart({ data, config, title, userJoins }: ChartProps) {
  const [mounted, setMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const defaultDataRef = useRef<Record<string, string | number> | null>(null);

  const joinsByDate = useMemo(() => {
    return userJoins ? groupJoinsByDate(userJoins) : new Map<string, UserJoin[]>();
  }, [userJoins]);

  // Add "all" series to each data point
  const chartData = useMemo(() => {
    return data.map(item => {
      const all = config.series.reduce((sum, s) => sum + (Number(item[s.key]) || 0), 0);
      return { ...item, all } as Record<string, string | number>;
    });
  }, [data, config.series]);

  // Store default (last) data
  defaultDataRef.current = chartData[chartData.length - 1];

  // Update stats panel via DOM (no re-renders)
  const updateStats = useCallback((dataPoint: Record<string, string | number>) => {
    if (!statsRef.current) return;

    const dateEl = statsRef.current.querySelector('[data-stat="date"]');
    if (dateEl) dateEl.textContent = String(dataPoint[config.xaxis_key] || '');

    SERIES.forEach(s => {
      const el = statsRef.current?.querySelector(`[data-stat="${s.key}"]`);
      if (el) el.textContent = String(dataPoint[s.key] ?? 0);
    });
  }, [config.xaxis_key]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Trigger animation when scrolled into view
  useEffect(() => {
    if (!mounted || !chartRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  // Animate stats counter when chart comes into view
  useEffect(() => {
    if (!isInView || chartData.length === 0) return;

    const duration = 3000;
    const steps = chartData.length;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      if (step < steps) {
        updateStats(chartData[step]);
        step++;
      } else {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, chartData, updateStats]);

  // Handle hover - update stats via DOM
  const handleHover = useCallback((dataPoint: Record<string, string | number> | null) => {
    if (dataPoint) {
      updateStats(dataPoint);
    } else if (defaultDataRef.current) {
      updateStats(defaultDataRef.current);
    }
  }, [updateStats]);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
        {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-4 md:mb-8">{title}</h3>}
        <div className="w-full h-[350px] bg-neutral-900/20 rounded-xl animate-pulse" />
      </div>
    );
  }

  const initialData = chartData[chartData.length - 1];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
      {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-4 md:mb-8">{title}</h3>}

      <style jsx global>{`
        @keyframes revealLine {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .chart-hidden .recharts-area-curve,
        .chart-hidden .recharts-area-area {
          clip-path: inset(0 100% 0 0);
        }
        .chart-hidden .recharts-reference-line {
          opacity: 0;
        }
        .chart-animate .recharts-area-curve {
          animation: revealLine 3s ease-out forwards;
        }
        .chart-animate .recharts-area-area {
          clip-path: inset(0 0 0 0);
          opacity: 0;
          animation: fadeIn 1s ease-out 2.5s forwards;
        }
        .chart-animate .recharts-reference-line {
          opacity: 0;
          animation: fadeIn 0.4s ease-out 3s forwards;
        }
        .join-marker-tooltip {
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .join-marker-diamond {
          transition: fill 0.2s ease;
        }
        .join-marker-group:hover .join-marker-tooltip {
          opacity: 1;
        }
        .join-marker-group:hover .join-marker-diamond {
          fill: #FF6B35;
        }
      `}</style>

      <div className="w-full flex flex-col md:flex-row gap-4">
        {/* Chart */}
        <div ref={chartRef} className={`w-full md:flex-1 h-[340px] md:h-[350px] ${isInView ? 'chart-animate' : 'chart-hidden'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.1} />
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
                interval={30}
                tickFormatter={(v) => v.split(' ')[0]}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: '#666', strokeDasharray: '4 4' }}
                content={(props) => {
                  const { active, payload } = props;
                  if (active && payload?.[0]?.payload) {
                    handleHover(payload[0].payload);
                  } else {
                    handleHover(null);
                  }
                  return null;
                }}
              />
              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="natural"
                  dataKey={s.key}
                  stroke={s.color}
                  fill={`url(#grad-${s.key})`}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              ))}
              {/* User join date markers - hidden on mobile (hover doesn't work on touch, diamonds cluster/overlap) */}
              {!isMobile && Array.from(joinsByDate.entries()).map(([date, users]) => (
                <ReferenceLine
                  key={`join-${date}`}
                  x={date}
                  stroke="rgba(255,255,255,0.15)"
                  strokeDasharray="3 3"
                  label={
                    <JoinMarkerLabel
                      users={users}
                      date={date}
                    />
                  }
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Panel - Updated via DOM refs */}
        <div ref={statsRef} className="w-full md:w-36 flex flex-row md:flex-col justify-center items-center md:items-stretch gap-4 md:gap-0 md:space-y-2 pt-2 md:pt-0">
          <div data-stat="date" className="text-neutral-400 font-mono text-sm mb-0 md:mb-1">
            {initialData?.[config.xaxis_key] || ''}
          </div>
          {SERIES.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 md:justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-neutral-400 text-xs">{s.label}</span>
              </div>
              <span data-stat={s.key} className="text-white font-mono font-bold text-base ml-1 md:ml-0">
                {initialData?.[s.key] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
