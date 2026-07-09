import Seo from '../components/Seo';
import { siteName } from '../siteConfig';

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title="Privacy Policy" description="Read the privacy policy for this all-in-one online tools website, including cookie and file-processing details." />

      <section className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-lg leading-8 text-slate-600">
          This Privacy Policy explains what information {siteName} collects, how that information is used, and the choices available to visitors. The site is designed to be simple and privacy-conscious, but some tools require processing files on the server for certain document workflows.
        </p>
      </section>

      <section className="mt-10 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">How files are processed</h2>
          <p className="mt-3 text-slate-600">
            Some tools run entirely in your browser and never send your files to a server. Examples include image compression, resizing, cropping, conversion, and other client-side workflows. Other tools, especially PDF and document-processing features, upload files to the server so the requested operation can be completed.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Server-processed files</h2>
          <p className="mt-3 text-slate-600">
            Files uploaded for server-side processing are used only to perform the requested operation and are deleted automatically after processing. They are not stored permanently, used for training models, or shared with third parties for unrelated purposes.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Cookies and analytics</h2>
          <p className="mt-3 text-slate-600">
            The site uses cookies and similar technologies to improve performance, remember your cookie preferences, and support analytics and advertising. If you visit from the European Union or the United Kingdom, you will see a cookie consent notice before non-essential cookies are used.
          </p>
        </div>
      </section>

      <section className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Google AdSense and Google Analytics</h2>
          <p className="mt-3 text-slate-600">
            This site uses Google AdSense and Google Analytics. Google may use cookies to serve ads based on your prior visits to this and other websites. In addition, Google may use data collected through analytics and advertising services in accordance with its own privacy policy.
          </p>
          <p className="mt-3 text-slate-600">
            As required by Google’s AdSense program, this site discloses that third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites. Users may opt out of personalized advertising by visiting Google’s Ads Settings or the Network Advertising Initiative opt-out page.
          </p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPage;
