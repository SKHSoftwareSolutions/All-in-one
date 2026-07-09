import { useState } from 'react';
import Seo from '../components/Seo';
import { siteName, contactEmail } from '../siteConfig';
import { apiUrl } from '../apiBase';

function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim() || 'Anonymous';
    const email = data.get('email')?.toString().trim() || contactEmail;
    const message = data.get('message')?.toString().trim() || '';

    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setStatus('Thanks for reaching out. Your message has been sent.');
        form.reset();
        return;
      }
    } catch (error) {
      // Fall back to the user's mail client when the backend is not available.
    }

    const mailtoHref = `mailto:${contactEmail}?subject=${encodeURIComponent(`Contact from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoHref;
    setStatus('Your email app should open with a prefilled message. If it does not, please email us directly at the address above.');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title="Contact" description="Contact the team behind this free online tools site or send a message through the form." />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Contact {siteName}</h1>
          <p className="text-lg leading-8 text-slate-600">
            Need help with one of the tools, want to share feedback, or have a question about the site? Send a message using the form or contact us directly by email.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Email</h2>
            <a href={`mailto:${contactEmail}`} className="mt-3 inline-block text-sky-700 hover:text-sky-800">
              {contactEmail}
            </a>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Send a message</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input name="name" required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input type="email" name="email" required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Message
              <textarea name="message" rows={6} required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none" />
            </label>
          </div>
          <button type="submit" className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            Send message
          </button>
          {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
