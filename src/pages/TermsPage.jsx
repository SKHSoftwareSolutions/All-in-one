import Seo from '../components/Seo';
import { siteName } from '../siteConfig';

function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title="Terms" description="Read the terms of service for using this online tools website." />

      <section className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Terms of Service</h1>
        <p className="text-lg leading-8 text-slate-600">
          By using {siteName}, you agree to these Terms of Service. The site provides free utility tools for convenience and informational purposes. You are responsible for using the tools in a lawful and respectful way.
        </p>
      </section>

      <section className="mt-10 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Acceptable use</h2>
          <p className="mt-3 text-slate-600">
            You may not use the site to upload illegal, abusive, or harmful content. You also agree not to attempt to disrupt the service, scrape it excessively, or bypass any reasonable access controls.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">No warranty on tool output</h2>
          <p className="mt-3 text-slate-600">
            The tools are provided as-is and may contain errors, omissions, or limitations. Output should be reviewed carefully before you rely on it for legal, financial, medical, contractual, or other high-stakes decisions.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Limitation of liability</h2>
          <p className="mt-3 text-slate-600">
            {siteName} and its operators are not liable for indirect, incidental, consequential, or punitive damages arising from your use of the site or any tool output. This includes issues caused by file upload errors, conversion limitations, or service interruptions.
          </p>
        </div>
      </section>
    </div>
  );
}

export default TermsPage;
