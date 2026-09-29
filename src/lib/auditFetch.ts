import dns from 'dns';

const dnsPromises = dns.promises;

const PRIVATE_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fd[0-9a-f]{2}:/i,
  /^fe[89ab][0-9a-f]:/i,
];

// Checks whether a hostname resolves to a private/loopback address.
// Also handles bare IPv4/IPv6 literals without DNS lookup.
export async function isPrivateHostname(hostname: string): Promise<boolean> {
  // Strip brackets from IPv6 literals (e.g. "[::1]" → "::1")
  const bare =
    hostname.startsWith('[') && hostname.endsWith(']')
      ? hostname.slice(1, -1)
      : hostname;

  if (PRIVATE_RANGES.some((re) => re.test(bare))) return true;

  try {
    const result = await dnsPromises.lookup(bare);
    return PRIVATE_RANGES.some((re) => re.test(result.address));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// HTML → text. Deliberately not a DOM parser: jsdom's ESM-only deps crash on
// Vercel's Node runtime, and the output only feeds an LLM prompt. Every scan
// is linear so a hostile page (unclosed tags, "<<<<") can't stall the function.
// ---------------------------------------------------------------------------
const STRIPPED_BLOCKS = ['head', 'script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe', 'svg', 'template'];

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', copy: '©', reg: '®', trade: '™',
};

// Removes everything from `open` to the end of `close` (case-insensitive).
// An unclosed block swallows the rest of the document, like a browser would.
function stripBetween(html: string, open: string, close: string, isTag: boolean): string {
  const lower = html.toLowerCase();
  let out = '';
  let i = 0;
  while (i < html.length) {
    const start = lower.indexOf(open, i);
    if (start === -1) {
      out += html.slice(i);
      break;
    }
    // "<header" must not match "<headline": require a tag-name boundary
    const after = lower.charAt(start + open.length);
    if (isTag && after && !/[\s>/]/.test(after)) {
      out += html.slice(i, start + open.length);
      i = start + open.length;
      continue;
    }
    out += html.slice(i, start) + ' ';
    const end = lower.indexOf(close, start + open.length);
    if (end === -1) break;
    if (!isTag) {
      i = end + close.length;
      continue;
    }
    const gt = lower.indexOf('>', end);
    i = gt === -1 ? html.length : gt + 1;
  }
  return out;
}

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z]{2,8});/gi, (match, ent: string) => {
    if (ent[0] === '#') {
      const code = ent[1] === 'x' || ent[1] === 'X' ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    }
    return NAMED_ENTITIES[ent.toLowerCase()] ?? match;
  });
}

export function htmlToText(html: string): string {
  let text = stripBetween(html, '<!--', '-->', false);
  for (const tag of STRIPPED_BLOCKS) {
    text = stripBetween(text, `<${tag}`, `</${tag}`, true);
  }
  // [^<>] keeps this linear: a stray "<" can't make the scan run to end-of-input
  text = text.replace(/<[^<>]*>/g, ' ');
  return decodeEntities(text).replace(/\s+/g, ' ').trim();
}

export type FetchPageResult = {
  text: string;
  blocked: boolean;
};

export async function fetchPageText(url: string): Promise<FetchPageResult> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { text: '', blocked: true };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { text: '', blocked: true };
  }

  if (await isPrivateHostname(parsed.hostname)) {
    return { text: '', blocked: true };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuditBot/1.0)' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { text: '', blocked: false };
    }

    const reader = response.body?.getReader();
    if (!reader) return { text: '', blocked: false };

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

    while (true) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      totalBytes += value.length;
      if (totalBytes > MAX_BYTES) break;
      chunks.push(value);
    }
    reader.cancel();

    const html = Buffer.concat(chunks).toString('utf-8');
    return { text: htmlToText(html).slice(0, 8000), blocked: false };
  } catch {
    return { text: '', blocked: false };
  }
}
