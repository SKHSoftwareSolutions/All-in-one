import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';

function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const strength = useMemo(() => {
    let score = 0;
    if (length >= 14) score += 1;
    if (length >= 18) score += 1;
    if (upper + lower + numbers + (symbols ? 1 : 0) >= 3) score += 1;
    if (excludeAmbiguous) score += 1;
    if (score <= 1) return 'Weak';
    if (score <= 2) return 'Fair';
    if (score <= 3) return 'Strong';
    return 'Very strong';
  }, [excludeAmbiguous, length, lower, numbers, symbols, upper]);

  function generatePassword() {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_=+[]{};:,.?';
    const ambiguous = 'iloIO01';

    let charSet = '';
    if (lower) charSet += lowerChars;
    if (upper) charSet += upperChars;
    if (numbers) charSet += numberChars;
    if (symbols) charSet += symbolChars;

    if (!charSet) {
      setPassword('');
      return;
    }

    const filtered = excludeAmbiguous ? charSet.split('').filter((char) => !ambiguous.includes(char)).join('') : charSet;
    if (!filtered) {
      setPassword('');
      return;
    }

    let nextPassword = '';
    for (let index = 0; index < length; index += 1) {
      nextPassword += filtered[Math.floor(Math.random() * filtered.length)];
    }

    setPassword(nextPassword);
  }

  async function copyPassword() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <ToolPageTemplate
      title="Password Generator"
      description="Generate strong, random passwords with custom options and instant strength feedback."
      metaDescription="Generate a strong password with custom length and character options for accounts and logins."
      usageSteps={[
        'Choose the password length with the slider.',
        'Turn on the character types you want to include and decide whether to exclude ambiguous symbols.',
        'Generate a password, then copy it when the strength score looks right for your use case.',
      ]}
      faqItems={[
        {
          question: 'Should I use this for my main email password?',
          answer: 'Yes, if you also keep it somewhere safe and do not reuse it across services.',
        },
        {
          question: 'Does the generator remember anything?',
          answer: 'No. It creates the password in your browser and does not store it automatically.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Length: {length}</span>
            <input type="range" min="8" max="40" value={length} onChange={(event) => setLength(Number(event.target.value))} className="w-full" />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Uppercase', upper, setUpper],
              ['Lowercase', lower, setLower],
              ['Numbers', numbers, setNumbers],
              ['Symbols', symbols, setSymbols],
            ].map(([label, checked, setter]) => (
              <label key={label} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <span>{label}</span>
                <input type="checkbox" checked={checked} onChange={() => setter(!checked)} className="h-4 w-4" />
              </label>
            ))}
          </div>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <span>Exclude ambiguous characters</span>
            <input type="checkbox" checked={excludeAmbiguous} onChange={() => setExcludeAmbiguous(!excludeAmbiguous)} className="h-4 w-4" />
          </label>

          <button type="button" onClick={generatePassword} className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
            Generate password
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">Generated password</div>
            <div className="mt-2 break-all text-lg font-semibold text-slate-900">{password || 'Generate a password to see it here.'}</div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={copyPassword} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              {copied ? 'Copied!' : 'Copy password'}
            </button>
            <div className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-600">
              Strength: <span className="font-semibold text-slate-900">{strength}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default PasswordGeneratorPage;
