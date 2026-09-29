// Submits every sitemap URL to IndexNow (Bing's index, which ChatGPT search reads).
// Run after a production deploy: npm run indexnow
const HOST = 'www.badalien.works';
const KEY = 'fbbf2b019405025dcd900c8c9b979d6a'; // public by design; served at /<KEY>.txt

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
if (!res.ok) process.exit(1);
