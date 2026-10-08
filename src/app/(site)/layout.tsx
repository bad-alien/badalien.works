import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, organizationJsonLd, jsonLdScript } from '@/lib/site';
import { GOOGLE_ADS_ID, GOOGLE_ADS_BOOTSTRAP } from '@/lib/googleAds';

// Production only, so preview QA and local runs never count as ad conversions.
const loadGoogleAds = process.env.VERCEL_ENV === 'production';

// Main-domain only: the decoded/void subdomains share the root layout but not
// this one, so their pages don't inherit main-site canonicals or org schema.
export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
  },
  // Explicit snippet limits: Google and the AI answer engines default to short previews otherwise.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
      />
      {loadGoogleAds && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
          <Script id="google-ads-tag" strategy="afterInteractive">
            {GOOGLE_ADS_BOOTSTRAP}
          </Script>
        </>
      )}
      {children}
    </>
  );
}
