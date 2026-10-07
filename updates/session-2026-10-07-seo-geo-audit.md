# SEO / GEO audit, 7 October 2026

Scope: main domain (www.badalien.works). Checked the source, the rendered HTML
from a local production build, and the two Search Console reports supplied
(Discovered - currently not indexed, 20 pages; Page with redirect, 2 pages).

Note: this session's network policy blocks badalien.works, so live headers and
the Vercel redirect chain were not re-fetched. Everything below that concerns
live behaviour comes from the Search Console screenshots and the production
build served locally.

## 1. Search Console

### Page with redirect (2 URLs): no action

`http://badalien.works/` and `https://badalien.works/` redirect to
`https://www.badalien.works/`. That is the intended canonical setup (www is the
canonical host in `src/lib/site.ts`, the apex redirects at Vercel). Google lists
redirecting URLs under this heading purely as information. Do not press
Validate Fix; nothing is broken.

Two things on the site were still feeding Google the apex host, which is why it
keeps rediscovering those URLs. Both fixed in this session:

- The RSS feed (`/api/rss`) built every link on `https://badalien.works`.
- The privacy policy linked to `https://badalien.works`.

### Discovered - currently not indexed (20 URLs): mostly time, plus fixes

The sitemap has 22 URLs. Google has 20 of them queued with "Last crawled: N/A",
meaning it found them in the sitemap but has not fetched them yet. The SEO
foundations (www canonical, sitemap, robots, schema) went live on 29 September
and Search Console first detected the pages on 4 October. For a site with
almost no inbound links, a week in the queue is normal. This status is a
crawl-budget and authority signal, not a technical error.

What was wrong on the site and is now fixed:

- Homepage body was served at `opacity: 0`. `HomeContent` kept `<main>`
  invisible until the visitor clicked or scrolled past the hero. Googlebot never
  interacts, so the rendered homepage was a logo and a chat prompt. The hero
  overlay is a fixed, opaque layer that already covers the body, so the opacity
  gate was removed; visitors see no difference.
- No `lastmod` on the ten static sitemap entries. Google uses lastmod to decide
  what to recrawl and ignores changefreq and priority. A maintained date map now
  drives it (`STATIC_PAGES` in `src/app/sitemap.ts`); bump a date when a page's
  copy changes, not on every deploy. Posts can set an `updated` frontmatter
  field.
- `/services` had no footer, so it was the only main page without the
  site-wide internal links. Footer added.

What to do in Search Console and elsewhere (owner actions, in priority order):

1. URL Inspection, then Request Indexing, for these six, one at a time:
   `/`, `/consult`, `/ai-consultant-pasadena`, `/insights`, `/about`,
   `/services`. Manual requests jump the queue; the quota is roughly ten a day.
2. After this branch deploys, run `npm run indexnow` to push the sitemap to
   Bing (which also feeds ChatGPT search and DuckDuckGo).
3. Resubmit the sitemap in Search Console (Sitemaps, enter
   `https://www.badalien.works/sitemap.xml`) so Google sees the new lastmod
   values immediately.
4. Get a few real inbound links; this is the lever that actually moves
   "Discovered" to "Indexed" for a new domain:
   - Google Business Profile for Bad Alien (Pasadena, service-area business)
     with the website set to `https://www.badalien.works/ai-consultant-pasadena`.
   - LinkedIn profile and company page website fields pointing at www.
   - GitHub `bad-alien` org profile website field.
   - Any directory or client site that already mentions Bad Alien.
5. Leave Validate Fix alone on the Discovered report. It only re-checks the
   listed URLs; it does not speed up crawling.

Expect the count to fall over two to four weeks once the first pages are
indexed and the internal links on them are followed.

## 2. Technical SEO: state after this session

Verified on the local production build (status codes, head tags, schema):

| Check | Result |
| --- | --- |
| Canonical host | www on every page, apex redirects |
| Self canonical on every indexable page | yes, absolute www URL |
| Title and description per page | yes, all unique |
| OG and Twitter cards | site-wide card plus generated per-post cards |
| `robots.txt` | allows all, blocks `/api/`, names sitemap and host, lists AI search bots |
| `sitemap.xml` | 22 URLs, now all with lastmod |
| 404 pages | real 404 status, `noindex, follow`, branded |
| `/tech` legacy route | 301 to `/services` |
| Trailing slashes | 308 to the slashless URL |
| `/void`, `/decoded` on main host | 301 to the subdomains |
| Organization and WebSite schema | on every main-domain page |
| ProfilePage schema | `/about` |
| FAQPage schema | `/ai-consultant-pasadena` |
| Article schema | every post, now with image, dateModified, breadcrumbs |
| Service schema | `/services` (new) |
| RSS | www host, linked from every page head (new) |
| `llms.txt` | new |

Changes made in this session, all in the `seo-geo-audit-oct-2026` branch:

- `src/lib/site.ts`: RSS alternate link in `pageMetadata`; `breadcrumbJsonLd`
  helper.
- `src/app/layout.tsx`: `metadataBase` moved to the root layout so the 404 page
  and subdomains resolve absolute OG URLs (the 404 page was emitting
  `http://localhost:3000/opengraph-image`).
- `src/app/(site)/layout.tsx`: explicit robots meta with
  `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`. Without
  these Google and the AI answer engines can truncate snippets.
- `src/app/sitemap.ts`: lastmod for static pages, `updated` support for posts.
- `src/app/(site)/insights/[slug]/page.tsx`: Article schema gains `image`,
  `dateModified`, `inLanguage`, `articleSection`, `isPartOf`; BreadcrumbList
  added; OG `modifiedTime` and `authors`.
- `src/app/(site)/services/layout.tsx`: ItemList of Service schema; sections
  get anchor ids so `/services#ai-adoption` resolves.
- `src/app/api/rss/route.ts`: www host.
- `src/app/llms.txt/route.ts`: new.
- `src/components/home/HomeContent.tsx`: body no longer hidden.
- Privacy and terms pages use `pageMetadata` (OG tags, RSS link, consistent
  title separator).
- Three posts brought in line with the content rules: booking CTAs now go to
  `/contact`, the "About the author" footers are gone.
- `tests/seo.test.ts`: sitemap, robots, RSS host, llms.txt, metadata helpers.

## 3. GEO (answer-engine visibility)

Already in good shape: AI search bots are explicitly allowed, entity statements
exist on the home, about and Pasadena pages, the organization schema carries
`knowsAbout`, `areaServed`, `founder` and `sameAs`, and the FAQ page gives
Perplexity and ChatGPT quotable question-and-answer pairs.

Added this session: `/llms.txt` (a one-pass plain-text map of the site with
the services, pages and every post), Service schema, snippet-length robots
directives, and breadcrumbs.

Still worth doing, in order of payoff:

1. Inbound mentions. Answer engines cite sources that other sources cite. The
   Google Business Profile and LinkedIn links above do double duty here.
2. Add `sameAs` entries for LinkedIn (personal and company) to the organization
   and founder schema once those profiles point back at the site. Only GitHub is
   listed today.
3. Each post currently has one quotable summary (the description). A two or
   three sentence "key takeaway" block near the top of each post gives answer
   engines a clean extract; the terse post style already suits this.
4. The `/consult` page has no FAQ. Pricing, timeline and "do we need technical
   staff" questions on the Pasadena page could be reused there with a second
   FAQPage block.

## 4. Decisions for the owner

- Street address in the privacy policy. `CLAUDE.md` says no street address
  anywhere, but `/privacy-policy` prints the Wallis Street mailing address. SMS
  and 10DLC registrations often require a mailing address in the policy, so it
  was left alone. If a PO box or registered-agent address is acceptable, swap
  it; otherwise the rule in `CLAUDE.md` should carve out the legal pages.
- `void.` and `decoded.` subdomains have titles and descriptions but no
  canonical and are not in any sitemap. If they should rank, they need
  canonicals and a sitemap each; if not, a `noindex` on `void.` (a chat UI)
  would keep it out of results. Neither was changed.
- Homepage H1 is screen-reader only. Fine for indexing, but the visible page
  has no headline text until the visitor leaves the hero. If the brand moment
  is negotiable, a one-line visible headline under the logo would help both
  users and snippets.
