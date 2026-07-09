import { Outlet, Link, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CookieConsentBanner from './CookieConsentBanner';
import Analytics from './Analytics';
import { siteName } from '../siteConfig';

const categories = [
  { label: 'PDF Tools', path: '/pdf-tools/' },
  { label: 'Image Tools', path: '/image-tools/' },
  { label: 'Text Tools', path: '/text-tools/' },
  { label: 'Calculators', path: '/calculators/' },
  { label: 'Generators', path: '/generators/' },
];

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Helmet>
        <title>{siteName}</title>
        <meta name="description" content="Free online tools for PDFs, images, text, calculations, and generators." />
      </Helmet>
      <Analytics />

      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
            {siteName}
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <select
              aria-label="Tool categories"
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              defaultValue="/"
              onChange={(event) => {
                const target = event.target.value;
                if (target) window.location.href = target;
              }}
            >
              <option value="/">Browse tools</option>
              {categories.map((category) => (
                <option key={category.path} value={category.path}>
                  {category.label}
                </option>
              ))}
            </select>
            <NavLink to="/about" className="text-slate-600 hover:text-slate-900">
              About
            </NavLink>
            <NavLink to="/contact" className="text-slate-600 hover:text-slate-900">
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <CookieConsentBanner />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 {siteName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="hover:text-slate-900">About</Link>
            <Link to="/privacy-policy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900">Terms</Link>
            <Link to="/contact" className="hover:text-slate-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
