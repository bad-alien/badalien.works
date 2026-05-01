'use client';

import { motion } from 'framer-motion';
import type { AuditBrief } from '@/lib/auditSession';

interface AuditBriefCardProps {
  brief: AuditBrief;
  url: string;
}

const effortLabel: Record<'S' | 'M' | 'L', string> = { S: 'S', M: 'M', L: 'L' };
const roiLabel: Record<'low' | 'med' | 'high', string> = { low: 'low', med: 'med', high: 'high' };

export default function AuditBriefCard({ brief, url }: AuditBriefCardProps) {
  const scoreDisplay = brief.score.toFixed(1);

  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {
    // keep raw url as fallback
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative w-full rounded-xl overflow-hidden my-3"
      style={{
        backgroundColor: '#1E1E1E',
        border: '1px solid rgba(255,107,53,0.3)',
      }}
      role="region"
      aria-label="AI audit brief"
    >
      {/* Top gradient overlay — marks this as a designed artifact, not a chat bubble */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,107,53,0.07) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-6">
        {/* Header: score label + score badge */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <p
              className="mb-1 uppercase"
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.625rem',
                color: '#8A8A8A',
                letterSpacing: '0.1em',
              }}
            >
              AI Audit Brief
            </p>
            <h3
              className="font-semibold leading-snug"
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.9375rem',
                color: '#F0F0F0',
              }}
            >
              {brief.score_label}
            </h3>
          </div>

          <div
            className="flex-shrink-0 flex flex-col items-end"
            aria-label={`Score: ${scoreDisplay} out of 10`}
          >
            <span
              className="leading-none font-bold"
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '2.25rem',
                color: '#FF6B35',
                letterSpacing: '-0.02em',
              }}
            >
              {scoreDisplay}
              <span
                className="font-normal"
                style={{ fontSize: '1rem', color: '#8A8A8A' }}
              >
                {' /10'}
              </span>
            </span>
            <span
              className="mt-0.5 text-right uppercase"
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.6rem',
                color: '#8A8A8A',
                letterSpacing: '0.06em',
              }}
            >
              AI-leverage potential
            </span>
          </div>
        </div>

        {/* OBSERVED */}
        <BriefSection label="OBSERVED">
          <ul className="space-y-2" aria-label="Observations">
            {brief.observations.map((obs, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span
                  className="flex-shrink-0 mt-[6px] w-1.5 h-1.5 rounded-full"
                  style={{ background: 'rgba(255,107,53,0.5)' }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontFamily: 'var(--font-instrument-sans)',
                    fontSize: '0.875rem',
                    color: '#C5C5C5',
                    lineHeight: '1.55',
                  }}
                >
                  {obs}
                </span>
              </li>
            ))}
          </ul>
        </BriefSection>

        {/* OPPORTUNITIES */}
        <BriefSection label="OPPORTUNITIES">
          <ol className="space-y-4" aria-label="Opportunities">
            {brief.opportunities.map((opp, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold mt-0.5"
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '0.625rem',
                    background: 'rgba(255,107,53,0.12)',
                    color: '#FF6B35',
                    minWidth: '1.25rem',
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold mb-1"
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.9375rem',
                      color: '#F0F0F0',
                    }}
                  >
                    {opp.title}
                  </p>
                  <p
                    className="mb-1.5"
                    style={{
                      fontFamily: 'var(--font-instrument-sans)',
                      fontSize: '0.8125rem',
                      color: '#C5C5C5',
                      lineHeight: '1.5',
                    }}
                  >
                    {opp.solves}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.6875rem',
                      color: '#8A8A8A',
                      letterSpacing: '0.04em',
                    }}
                  >
                    effort: {effortLabel[opp.effort]}
                    <span className="mx-1.5 opacity-40">·</span>
                    ROI: {roiLabel[opp.roi]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </BriefSection>

        {/* ON DATA SOVEREIGNTY — conditional */}
        {brief.sovereignty_callout && (
          <BriefSection label="ON DATA SOVEREIGNTY">
            <div
              className="rounded-lg px-4 py-3"
              style={{
                background: 'rgba(255,107,53,0.07)',
                border: '1px solid rgba(255,107,53,0.18)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-instrument-sans)',
                  fontSize: '0.875rem',
                  color: '#C5C5C5',
                  lineHeight: '1.55',
                }}
              >
                {brief.sovereignty_callout}
              </p>
            </div>
          </BriefSection>
        )}

        {/* Source URL */}
        <div
          className="mt-5 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p
            className="truncate"
            title={url}
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.625rem',
              color: '#3A3A3A',
              letterSpacing: '0.03em',
            }}
          >
            {hostname}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function BriefSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p
        className="mb-2.5 uppercase"
        style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.625rem',
          color: 'rgba(255,107,53,0.65)',
          letterSpacing: '0.12em',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
