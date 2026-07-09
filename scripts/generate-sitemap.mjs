import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const siteUrl = 'https://allinonetools.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const routes = [
  '/',
  '/about',
  '/privacy-policy',
  '/terms',
  '/contact',
  '/pdf-tools/',
  '/pdf-tools/merge-pdf',
  '/pdf-tools/split-pdf',
  '/pdf-tools/compress-pdf',
  '/pdf-tools/pdf-to-word',
  '/pdf-tools/word-to-pdf',
  '/pdf-tools/image-to-pdf',
  '/image-tools/',
  '/image-tools/compress-image',
  '/image-tools/resize-image',
  '/image-tools/convert-image',
  '/image-tools/crop-image',
  '/text-tools/',
  '/text-tools/word-counter',
  '/text-tools/case-converter',
  '/text-tools/text-diff-checker',
  '/text-tools/document-similarity-checker',
  '/calculators/',
  '/calculators/percentage-calculator',
  '/calculators/emi-loan-calculator',
  '/calculators/age-calculator',
  '/calculators/gpa-calculator',
  '/generators/',
  '/generators/qr-code-generator',
  '/generators/password-generator',
  '/generators/invoice-generator',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemap);
console.log('Generated public/sitemap.xml');
