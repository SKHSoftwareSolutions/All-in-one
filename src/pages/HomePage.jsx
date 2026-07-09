import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { siteName, siteDescription, siteUrl } from '../siteConfig';

const categories = [
  {
    title: 'PDF Tools',
    description: 'Merge, split, compress, and convert documents with ease.',
    path: '/pdf-tools/',
  },
  {
    title: 'Image Tools',
    description: 'Resize, crop, and convert images without extra software.',
    path: '/image-tools/',
  },
  {
    title: 'Text Tools',
    description: 'Count words, compare content, and convert text formats.',
    path: '/text-tools/',
  },
  {
    title: 'Calculators',
    description: 'Quick calculators for loans, age, GPA, and percentages.',
    path: '/calculators/',
  },
  {
    title: 'Generators',
    description: 'Generate secure passwords, QR codes, and invoices.',
    path: '/generators/',
  },
];

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo
        title="Home"
        description={siteDescription}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
          description: siteDescription,
        }}
      />
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">All-in-one free tools</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Fast, free, and simple online tools for everyday work.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          {siteName} brings together practical utilities for document work, image edits, text analysis, quick calculations, and everyday generators in one clean workspace.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.path}
            to={category.path}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">{category.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
