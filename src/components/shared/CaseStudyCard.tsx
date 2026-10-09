import Image from 'next/image';
import type { CaseStudy } from '@/data/caseStudies';

export function StatusChip({
  chip,
  chipType,
  floating = false,
}: {
  chip: string;
  chipType: CaseStudy['chipType'];
  floating?: boolean;
}) {
  const live = chipType === 'progress' || chipType === 'active';
  return (
    <span
      className={`${floating ? 'absolute top-4 right-4 z-10' : 'shrink-0'} inline-flex items-center gap-2 px-3 py-1 rounded-md font-mono text-xs font-semibold uppercase tracking-wider ${
        live
          ? 'bg-orange-950/80 border border-[#FF6B35]/40 text-[#FF6B35] backdrop-blur-sm'
          : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 backdrop-blur-sm'
      }`}
    >
      {live && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
        </span>
      )}
      {chip}
    </span>
  );
}

// Engagement card for the homepage and /consult. Cards with an image show it above
// the text with the chip floating on it; wide or image-less cards are text-led.
export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const showImage = Boolean(study.image) && !study.wide;
  const large = Boolean(study.wide && study.featured);
  const serviceLabel = (
    <span className="font-mono text-[11px] font-semibold text-[#0284C7] uppercase tracking-[0.08em]">
      {study.services.join(' · ')}
    </span>
  );

  return (
    <div className="group h-full">
      <div
        className={`h-full flex flex-col bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300 relative ${
          large ? 'p-6 md:p-10' : 'p-6'
        }`}
      >
        {showImage ? (
          <>
            <StatusChip chip={study.chip} chipType={study.chipType} floating />
            <div
              className={`w-full aspect-video rounded-lg mb-4 overflow-hidden relative ${
                study.imageContain ? 'bg-black' : 'bg-gradient-to-br from-surface to-elevated'
              }`}
            >
              <Image
                src={study.image!}
                alt={study.title}
                fill
                className={`${
                  study.imageContain
                    ? 'object-contain p-4'
                    : `object-cover ${study.imageCenter ? 'object-center' : 'object-top'}`
                } group-hover:scale-105 transition-transform duration-300`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="mb-2">{serviceLabel}</div>
          </>
        ) : (
          // Phones stack the chip above the tags so a three-service label stays on one line
          <div className="flex flex-col-reverse items-start gap-3 mb-3 sm:flex-row sm:justify-between sm:gap-4">
            <div className="sm:pt-1">{serviceLabel}</div>
            <StatusChip chip={study.chip} chipType={study.chipType} />
          </div>
        )}

        <h3
          className={`font-bold text-text-heading mb-3 group-hover:text-white transition-colors duration-300 ${
            large ? 'text-2xl md:text-3xl font-display' : 'text-xl'
          }`}
        >
          {study.title}
        </h3>

        <p className={`text-text-body leading-relaxed ${large ? 'text-base md:text-lg max-w-4xl' : 'text-sm max-w-4xl'}`}>
          {study.description}
        </p>
      </div>
    </div>
  );
}
