# SEO / GEO audit, 8 October 2026

Follow-up to the 7 October audit. Search Console still shows 20 pages as
"Discovered - currently not indexed" and 2 as "Page with redirect". This time
the live site was reachable, so every check below ran against
https://www.badalien.works, fetched with a Googlebot smartphone user agent and
rendered in headless Chromium at Google's render size (412px wide, 12,140px
tall; Google expands the viewport instead of scrolling).

## 1. What the live site returns

Nothing blocks crawling or indexing.

| Check | Result |
| --- | --- |
| All 22 sitemap URLs | 200, self-canonical on www, `index, follow`, no `X-Robots-Tag` |
| Response time | 0.26s to 0.9s, served from Vercel's prerender cache |
| robots.txt | allows everything except `/api/`, names the sitemap |
| Apex and http | one 308 hop to www (http apex takes two, which is normal) |
| Trailing slash, `/tech`, query strings | redirect or canonicalise correctly |
| Unknown paths | real 404 |
| Structured data | parses on every page: Organization graph, Article, BreadcrumbList, FAQPage, ProfilePage, ItemList |
| Server HTML text | 360 to 2,000 words per page, so non-JS AI crawlers see the content |
| Rendered text | full on every page except `/consult` and `/creative` (below) |

A search for `site:badalien.works` returns nothing, and neither does a search
for the business name. The domain has no footprint in any index yet.

## 2. Why the pages sit in "Discovered"

"Discovered - currently not indexed" with "Last crawled: N/A" means Google
found the URL in the sitemap and has not fetched it. The cause is crawl
priority, not a technical fault. Google allots crawling to a new domain by how
much the rest of the web points at it and by what it found on the pages it did
fetch. Today that is zero inbound links, and a homepage that until 7 October
rendered as a logo over a blank page.

Search Console's indexing report also lags two to five days. The 7 October
fixes went live yesterday, so the report cannot reflect them yet.

The 2 "Page with redirect" URLs are almost certainly `http://badalien.works/`
and `https://badalien.works/`. They redirect to www by design. That report is
informational; leave it alone.

## 3. Fixed in this branch

- **`/consult` content was invisible to Google.** The hero used
  `min-h-screen`, so under Google's 12,140px viewport it grew to 12,140px and
  pushed every section below it out of view. Those sections fade in on scroll
  (`whileInView`) and start at opacity 0, so they never appeared. Rendered
  visible text went from 41 words to 603 after capping the hero at
  `min(100vh, 150rem)`. Real screens are never 150rem (2,400px) tall, so
  visitors see no change; this was verified at 390x844, 1440x900 and 1440x2160.
- **Homepage render showed only the hero.** The fixed hero overlay covered the
  full 12,140px, so Google's screenshot of the homepage was a logo on black.
  The overlay now has `max-h-[150rem]`; Google's render shows the page beneath
  it, and on real screens the overlay still fills the viewport exactly.
- **`/creative` had no heading and no footer.** It rendered about 14 words of
  text and linked to two pages. It now has a screen-reader H1 (as `/about` and
  the homepage do) and the site footer, which gives it the same internal links
  as every other page.
- **Void redirects took two hops.** `void.badalien.works` and `/void` went to
  the apex, which then redirected to www. They now go straight to www.
- **Sitemap lastmod** bumped for `/`, `/consult` and `/creative` so Google
  rechecks them.

## 4. Owner actions, in order

1. After this merges, in Search Console use URL Inspection on `/consult` and
   run "Test live URL", then "View tested page" and the screenshot. The
   sections below the hero should now appear. Then press Request Indexing.
   Do the same for `/`, `/ai-consultant-pasadena`, `/services`, `/about`,
   `/insights`, and the newest post. The quota is about ten a day.
2. If the sitemap was not resubmitted yesterday, resubmit it. IndexNow was
   pinged during this audit (HTTP 200, 22 URLs); run `npm run indexnow` again
   after this merges.
3. Create the Google Business Profile (service-area business, Pasadena) with
   the website set to `https://www.badalien.works/ai-consultant-pasadena`.
   This is the highest-value single link available.
4. Put `https://www.badalien.works` in the website field of the LinkedIn
   profile, a LinkedIn company page, and the GitHub `bad-alien` org. Send the
   LinkedIn URLs so they can go into the Organization schema `sameAs`.
5. Ask primarihealth.com and camcoig.com, both built by Bad Alien, to add a
   "Site by Bad Alien" footer credit linking to www. Two relevant inbound links
   from live business sites will move crawl priority more than any on-page
   change.
6. Share each new post on LinkedIn with the www link. Social links are
   nofollow but still lead Google to the URLs.

Expect the first pages to move to Indexed within one to three weeks of the
first inbound links, and the rest to follow as Google crawls the internal
links on those pages.

## 5. GEO

Answer engines (ChatGPT search, Perplexity, Google AI Overviews) cite pages
that their underlying search index already holds. With nothing indexed in
Google or Bing, there is nothing for them to cite yet, so indexing is the GEO
work right now. The on-site GEO setup is complete: AI search bots are allowed,
`/llms.txt` lists every page and post, the server HTML carries the full text,
and FAQ, Article and Organization schema are in place.

Still open from the 7 October audit:

- LinkedIn `sameAs` entries once the profiles link back.
- A short key-takeaway block near the top of each post.
- An FAQ block on `/consult`.

## 6. Still for the owner to decide

- `decoded.badalien.works` is indexable, has no canonical, and is not in any
  sitemap. If it should stay out of search, it needs a `noindex`; if it should
  rank, it needs a canonical and a sitemap entry.
