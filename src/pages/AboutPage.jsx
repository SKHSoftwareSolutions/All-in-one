import Seo from '../components/Seo';
import { siteName, contactEmail } from '../siteConfig';

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title="About" description="Learn what this all-in-one free tools site is for, how it works, and who built it." />

      <section className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">About {siteName}</h1>
        <p className="text-lg leading-8 text-slate-600">
          {siteName} is a free, browser-based collection of everyday utility tools for working with PDFs, images, text, calculations, and common generators. The goal is simple: give people a fast way to complete small but frequent tasks without installing bulky desktop software or creating an account.
        </p>
        <p className="text-lg leading-8 text-slate-600">
          The site exists because many helpful online tools are scattered across dozens of unrelated websites, and many of them bury the most common actions behind sign-up walls or confusing interfaces. {siteName} brings those tasks into one place with a consistent layout, clear routes, and tools that can be used immediately.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">What the site includes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
          <li>PDF tools for merging, splitting, compression, conversion, and image-to-PDF workflows.</li>
          <li>Image tools for compression, resizing, conversion, and cropping.</li>
          <li>Text tools for word counts, case conversion, diff review, and document similarity checks.</li>
          <li>Practical calculators and generators for everyday planning and content tasks.</li>
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Who built it</h2>
        <p className="mt-4 text-slate-600">
          {siteName} is built and maintained by SKH Software Solutions, a software development startup founded by three friends. The project is led by Muhammad Haseeb Raza, and the team's goal is to build practical, genuinely useful software rather than filler content.
        </p>
        <p className="mt-3 text-slate-600">
          Have feedback, found a bug, or want to request a new tool? Reach the team any time at{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium text-sky-700 hover:text-sky-800">
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
