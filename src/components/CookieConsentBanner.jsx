import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem('cookie-consent-dismissed');
    setVisible(!dismissed);
  }, []);

  const dismiss = () => {
    window.localStorage.setItem('cookie-consent-dismissed', 'true');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-900 px-4 py-4 text-sm text-slate-100 shadow-2xl sm:left-auto sm:right-4 sm:max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-6">
          This site uses cookies and similar technologies for analytics, advertising, and basic site performance. You can learn more in our{' '}
          <Link to="/privacy-policy" className="font-semibold text-sky-300 underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full bg-white px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
