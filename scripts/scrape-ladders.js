// Script to fetch AFL and AFLW ladders from the official AFL API and update JSON files
// Usage: node scripts/scrape-ladders.js

import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';

const SOURCES = [
  {
    url: 'https://aflapi.afl.com.au/afl/v2/compseasons/73/ladders?roundId=',
    out: './public/data/afl.json',
  },
  {
    url: 'https://aflapi.afl.com.au/afl/v2/compseasons/84/ladders?roundId=',
    out: './public/data/aflw.json',
  }
];

const HEADERS = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'account': 'afl',
  'cache-control': 'no-cache',
  'dnt': '1',
  'origin': 'https://www.afl.com.au',
  'pragma': 'no-cache',
  'priority': 'u=1, i',
  'referer': 'https://www.afl.com.au/',
  'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'sec-gpc': '1',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
};

function canonicalKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchLadder({ url, out }) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  const json = await res.json();
  // Debug: log the full API response to help diagnose empty ladders
  console.log(`Full API response for ${url}:`);
  console.dir(json, { depth: 6 });
  // The ladder is in json.ladders[0].entries
  const entries = json.ladders?.[0]?.entries || [];
  const data = entries.map(entry => ({
    team: entry.team.name,
    wins: entry.thisSeasonRecord?.winLossRecord?.wins ?? 0,
    key: canonicalKey(entry.team.name)
  }));
  await writeFile(out, JSON.stringify(data, null, 2));
  console.log(`Wrote ${data.length} teams to ${out}`);
}

(async () => {
  for (const src of SOURCES) {
    try {
      await fetchLadder(src);
    } catch (e) {
      console.error(`Failed to fetch ladder for ${src.out}:`, e.message);
    }
  }
})();
