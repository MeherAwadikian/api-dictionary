/**
 * Parser script: converts public-apis README.md markdown tables into apis.json
 *
 * Usage:
 *   1. Clone https://github.com/public-apis/public-apis
 *   2. Copy its README.md into the project root as README.md
 *   3. Run: npm run parse
 *   4. Output: src/data/apis.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

type ApiEntry = {
  name: string;
  category: string;
  description: string;
  auth: string;
  https: string;
  cors: string;
  link: string;
  useCase: string;
};

const useCaseMap: Record<string, string> = {
  Animals: 'display animal facts and images in a pet or nature app',
  Anime: 'build an anime discovery or tracking feature',
  'Anti-Malware': 'scan user-submitted URLs or files for threats before processing',
  'Art & Design': 'enrich a creative platform with artwork, icons, or color palettes',
  'Authentication & Authorization': 'add secure, passwordless login to your application',
  Blockchain: 'query on-chain data or build a crypto dashboard',
  Books: 'build a reading list feature with book metadata and covers',
  Business: 'automate business data lookups like company info or VAT validation',
  Calendar: 'integrate public holiday or event data into a scheduling app',
  Cryptocurrency: 'show live crypto prices and market data in a finance app',
  'Currency Exchange': 'convert prices between currencies in real time',
  'Data Validation': 'validate user input like emails, phone numbers, or addresses',
  Development: 'generate placeholder data or utilities during development',
  Dictionaries: 'show word definitions and synonyms on hover or click',
  Email: 'validate email addresses or send transactional emails from your app',
  Entertainment: 'surface fun trivia, quotes, or random facts to delight users',
  Environment: 'display real-time air quality or environmental data in a geo app',
  Finance: 'show stock prices, financial statements, or portfolio data',
  'Food & Drink': 'suggest recipes or nutritional info based on user ingredients',
  Geocoding: 'convert addresses to coordinates for mapping features',
  Government: 'surface public data like legislation, spending, or census info',
  Health: 'provide medical reference data or health metrics to users',
  Jobs: 'aggregate job listings from multiple sources in a career platform',
  Music: 'show track metadata, lyrics, or recommendations in a music app',
  News: 'pull live headlines into a news feed or notification system',
  Photography: 'let users search and embed high-quality stock photos',
  Science: 'display scientific data, space imagery, or research findings',
  Security: 'check user credentials against breach databases during sign-up',
  Social: 'aggregate social media stats or let users share content',
  Sports: 'show live scores, standings, or player stats in a sports app',
  'Text Analysis': 'analyze sentiment or extract keywords from user content',
  Tracking: 'track shipments or deliveries in real time',
  Transportation: 'show flight or transit schedules in a travel planning app',
  Video: 'embed video search or metadata in a media platform',
  Weather: 'show current conditions and forecasts in a location-aware app',
};

function generateUseCase(category: string, name: string, description: string): string {
  const base = useCaseMap[category];
  if (base) return base;
  return `integrate ${name.toLowerCase()} to ${description.toLowerCase().replace(/\.$/, '')} in your app`;
}

function parseReadme(content: string): ApiEntry[] {
  const entries: ApiEntry[] = [];
  let currentCategory = '';

  const lines = content.split('\n');

  for (const line of lines) {
    // Match category heading: ### Category Name
    const categoryMatch = line.match(/^###\s+(.+)$/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // Skip table header rows
    if (line.startsWith('| API') || line.startsWith('|:---') || line.startsWith('| ---')) continue;

    // Match table data row: | [Name](url) | Description | Auth | HTTPS | CORS |
    const rowMatch = line.match(/^\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/);
    if (rowMatch && currentCategory) {
      const [, name, url, description, auth, https, cors] = rowMatch;
      // Parse auth: strip backticks
      const cleanAuth = auth.trim().replace(/`/g, '') || 'No';
      entries.push({
        name: name.trim(),
        category: currentCategory,
        description: description.trim(),
        auth: cleanAuth === '' ? 'No' : cleanAuth,
        https: https.trim(),
        cors: cors.trim(),
        link: url.trim(),
        useCase: generateUseCase(currentCategory, name.trim(), description.trim()),
      });
    }
  }

  return entries;
}

const readmePath = resolve(process.cwd(), 'README.md');
const outputPath = resolve(process.cwd(), 'src/data/apis.json');

const content = readFileSync(readmePath, 'utf-8');
const entries = parseReadme(content);

writeFileSync(outputPath, JSON.stringify(entries, null, 2));
console.log(`Parsed ${entries.length} API entries → ${outputPath}`);
