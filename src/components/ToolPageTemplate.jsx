import { useLocation } from 'react-router-dom';
import Seo from './Seo';
import { siteName, siteDescription, siteUrl } from '../siteConfig';

function ToolPageTemplate({ title, description, metaDescription, usageSteps = [], faqItems = [], children }) {
  const { pathname } = useLocation();
  const metaContent = metaDescription || description;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    description: metaContent,
    url: `${siteUrl}${pathname}`,
    provider: {
      '@type': 'Organization',
      name: siteName,
    },
    keywords: [siteDescription, title],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title={title} description={metaContent} jsonLd={jsonLd} />

      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">How to use this tool</h2>
          {usageSteps.length ? (
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
              {usageSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-slate-600">Add a short list of steps here to help readers understand the workflow.</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
          {faqItems.length ? (
            <div className="mt-4 space-y-3">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="font-medium text-slate-800">{item.question}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-slate-600">Add a few common questions and answers here to make the page more helpful.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default ToolPageTemplate;
