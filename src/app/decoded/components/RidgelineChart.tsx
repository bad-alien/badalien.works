'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

interface RidgelineChartProps {
  data: { day: string; hour: number; value: number }[];
  config?: {
    color: string;
    unit?: string;
  };
  title?: string;
}

// Monday first, Sunday last
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type DayName = typeof DAYS[number];

const DAY_SHORT: Record<string, DayName> = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

// 7-color warm→cool spectrum anchored to primary orange
const DAY_COLORS: Record<DayName, string> = {
  Monday: '#FF6B35',    // orange (primary)
  Tuesday: '#FF8C42',   // amber
  Wednesday: '#E85D75', // coral/rose
  Thursday: '#C44569',  // magenta
  Friday: '#8B5CF6',    // purple
  Saturday: '#4F46E5',  // indigo
  Sunday: '#22D3EE',    // cyan
};

export default function RidgelineChart({ data, title }: RidgelineChartProps) {
  const [mounted, setMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Chart dimensions
  const margin = { top: 60, right: 30, bottom: 50, left: 110 };
  const width = 900;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // X-axis starts at 4am, ends at 4am next day (hour 4 to hour 28)
  // Buffer: 1 hour on each side for smooth curve edges
  const START_HOUR = 4;
  const END_HOUR = 28; // 4am next day
  const BUFFER_HOURS = 1;

  // Process data into day-indexed arrays with shifted hours (4am start) + buffer
  const processedData = useMemo(() => {
    // Build raw 24-hour data first
    const rawData: Record<DayName, number[]> = {
      Monday: Array(24).fill(0),
      Tuesday: Array(24).fill(0),
      Wednesday: Array(24).fill(0),
      Thursday: Array(24).fill(0),
      Friday: Array(24).fill(0),
      Saturday: Array(24).fill(0),
      Sunday: Array(24).fill(0),
    };

    // Fill in actual values
    data.forEach(item => {
      const dayName = DAY_SHORT[item.day];
      if (dayName && item.hour >= 0 && item.hour < 24) {
        rawData[dayName][item.hour] = item.value;
      }
    });

    const dayData: Record<DayName, { hour: number; value: number }[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    const nextDay: Record<DayName, DayName> = {
      Monday: 'Tuesday',
      Tuesday: 'Wednesday',
      Wednesday: 'Thursday',
      Thursday: 'Friday',
      Friday: 'Saturday',
      Saturday: 'Sunday',
      Sunday: 'Monday',
    };

    DAYS.forEach(day => {
      // Buffer before: hour 3 (1 hour before 4am)
      for (let h = START_HOUR - BUFFER_HOURS; h < START_HOUR; h++) {
        dayData[day].push({ hour: h, value: rawData[day][h] });
      }
      // Hours 4-23 from current day
      for (let h = START_HOUR; h < 24; h++) {
        dayData[day].push({ hour: h, value: rawData[day][h] });
      }
      // Hours 0-3 from next day (displayed as 24-27)
      for (let h = 0; h < START_HOUR; h++) {
        dayData[day].push({ hour: h + 24, value: rawData[nextDay[day]][h] });
      }
      // Buffer after: hours 4-5 of next day (displayed as 28-29)
      for (let h = START_HOUR; h <= START_HOUR + BUFFER_HOURS; h++) {
        dayData[day].push({ hour: h + 24, value: rawData[nextDay[day]][h] });
      }
    });

    return dayData;
  }, [data]);

  // Calculate global max - true maximum for absolute scaling across all days
  const globalMax = useMemo(() => {
    let max = 0;
    DAYS.forEach(day => {
      processedData[day].forEach(d => {
        if (d.value > max) max = d.value;
      });
    });
    return max || 1;
  }, [processedData]);

  // D3 scales - x-axis includes buffer (3-29) but we clip to show 4-28
  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([START_HOUR - BUFFER_HOURS, END_HOUR + BUFFER_HOURS])
      .range([0, innerWidth * (1 + 2 * BUFFER_HOURS / 24)]); // Extend range for buffer
  }, [innerWidth]);

  // Clip boundaries for visible area (4am to 4am)
  const clipX = xScale(START_HOUR);
  const clipWidth = xScale(END_HOUR) - xScale(START_HOUR);

  const yScale = useMemo(() => {
    return d3.scaleBand<DayName>()
      .domain(DAYS as unknown as DayName[])
      .range([0, innerHeight])
      .paddingInner(0); // Remove padding for more overlap
  }, [innerHeight]);

  const areaHeight = yScale.bandwidth() * 1.62; // 10% less than 1.8

  // Square root scale to compress extremes while keeping smaller values visible
  const sqrtMax = Math.sqrt(globalMax);

  // D3 area generator - curveMonotoneX preserves peaks better than curveBasis
  const areaGenerator = useMemo(() => {
    return d3.area<{ hour: number; value: number }>()
      .x(d => xScale(d.hour))
      .y0(0)
      .y1(d => -(Math.sqrt(d.value) / sqrtMax) * areaHeight)
      .curve(d3.curveMonotoneX);
  }, [xScale, sqrtMax, areaHeight]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // IntersectionObserver for entrance animation
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  // Format hour for display (handles hours > 23 for next day)
  const formatHour = (hour: number): string => {
    const h = hour % 24;
    if (h === 0) return '12am';
    if (h === 12) return '12pm';
    if (h < 12) return `${h}am`;
    return `${h - 12}pm`;
  };

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
        {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-8">{title}</h3>}
        <div className="w-full h-[500px] bg-neutral-900/20 rounded-xl border border-neutral-800 animate-pulse" />
      </div>
    );
  }

  // Render order: Monday first (at top), Sunday last (at bottom)
  // Later days render on top of earlier days (reverse of DAYS array for SVG layering)
  const renderOrder = [...DAYS];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto"
    >
      {title && <h3 className="text-2xl md:text-3xl font-mono text-neutral-200 mb-8">{title}</h3>}

      <style jsx global>{`
        @keyframes waveReveal {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }
        .ridgeline-wave {
          clip-path: inset(0 100% 0 0);
        }
        .ridgeline-animate .ridgeline-wave {
          animation: waveReveal 1s ease-out forwards;
        }
        ${DAYS.map((day, i) => `
          .ridgeline-animate .wave-${day.toLowerCase()} {
            animation-delay: ${i * 70}ms;
          }
        `).join('')}
      `}</style>

      <div className="w-full bg-neutral-900/20 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full h-auto ${isInView ? 'ridgeline-animate' : ''}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Clip path to show only 4am-4am, hiding buffer hours */}
            <clipPath id="chart-clip">
              <rect x={0} y={-200} width={clipWidth} height={innerHeight + 400} />
            </clipPath>
          </defs>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* X-axis labels - every other hour from 4am to 4am */}
            <g transform={`translate(${-clipX}, ${innerHeight + 10})`}>
              {Array.from({ length: 13 }, (_, i) => i * 2 + 4).map(hour => (
                <text
                  key={hour}
                  x={xScale(hour)}
                  y={15}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="11"
                >
                  {formatHour(hour)}
                </text>
              ))}
            </g>

            {/* Day rows - clipped to show only 4am-4am */}
            <g clipPath="url(#chart-clip)">
              {renderOrder.map(day => {
                const dayY = yScale(day) ?? 0;
                const color = DAY_COLORS[day];
                const dayData = processedData[day];

                return (
                  <g
                    key={day}
                    transform={`translate(${-clipX}, ${dayY + yScale.bandwidth()})`}
                    className={`ridgeline-wave wave-${day.toLowerCase()}`}
                  >
                    {/* Baseline */}
                    <line
                      x1={xScale(START_HOUR)}
                      y1={0}
                      x2={xScale(END_HOUR)}
                      y2={0}
                      stroke="#666"
                      strokeWidth={1}
                      opacity={0.3}
                    />

                    {/* Filled area - fully opaque */}
                    <path
                      d={areaGenerator(dayData) || ''}
                      fill={color}
                    />
                  </g>
                );
              })}
            </g>

            {/* Day labels - outside clip area */}
            {renderOrder.map(day => {
              const dayY = yScale(day) ?? 0;
              return (
                <text
                  key={`label-${day}`}
                  x={-15}
                  y={dayY + yScale.bandwidth() - areaHeight / 3}
                  textAnchor="end"
                  fill="#666"
                  fontSize="14"
                >
                  {day}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
