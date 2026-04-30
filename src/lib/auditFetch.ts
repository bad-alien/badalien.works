import { JSDOM } from 'jsdom';
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
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    for (const tag of ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe', 'svg']) {
      for (const el of doc.querySelectorAll(tag)) {
        el.remove();
      }
    }

    const text = (doc.body?.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);

    return { text, blocked: false };
  } catch {
    return { text: '', blocked: false };
  }
}
