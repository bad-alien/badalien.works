import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Shared Open Graph card renderer (site-wide + per-post). Fonts are static
// WOFF instances of the DESIGN.md faces; Satori can't use the variable
// Google Fonts that next/font loads. Paths are literal so Vercel's file
// tracing bundles them with the function.
export const OG_SIZE = { width: 1200, height: 630 };

async function loadAssets() {
  const [outfit, instrument, logo] = await Promise.all([
    readFile(join(process.cwd(), 'src/app/fonts/Outfit-700.woff')),
    readFile(join(process.cwd(), 'src/app/fonts/InstrumentSans-400.woff')),
    readFile(join(process.cwd(), 'public/logos/ba-logo-trans-white.png')),
  ]);
  return { outfit, instrument, logo: `data:image/png;base64,${logo.toString('base64')}` };
}

export async function renderOgImage({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  const { outfit, instrument, logo } = await loadAssets();
  const titleSize = title.length > 70 ? 46 : title.length > 40 ? 54 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: '#0A0A0A',
          color: '#F0F0F0',
          fontFamily: 'Instrument Sans',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={150} height={123} alt="" style={{ objectFit: 'contain' }} />
          <div
            style={{
              fontSize: 20,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#0284C7',
            }}
          >
            {kicker}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000 }}>
          <div
            style={{
              fontFamily: 'Outfit',
              fontWeight: 700,
              fontSize: titleSize,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#F0F0F0',
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 26, lineHeight: 1.4, color: '#C5C5C5' }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 96, height: 4, background: '#FF6B35' }} />
          <div style={{ fontSize: 20, letterSpacing: '0.08em', color: '#8A8A8A' }}>
            badalien.works · AI consulting · Pasadena, CA
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Outfit', data: outfit, weight: 700, style: 'normal' },
        { name: 'Instrument Sans', data: instrument, weight: 400, style: 'normal' },
      ],
    }
  );
}
