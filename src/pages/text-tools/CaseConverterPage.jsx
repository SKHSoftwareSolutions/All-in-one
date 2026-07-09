import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import CopyButton from '../../components/CopyButton';

function CaseConverterPage() {
  const [input, setInput] = useState('');

  const conversions = useMemo(() => {
    if (!input.trim()) {
      return {
        uppercase: '',
        lowercase: '',
        titleCase: '',
        sentenceCase: '',
        camelCase: '',
      };
    }

    const words = input.trim().split(/\s+/);
    const upper = input.toUpperCase();
    const lower = input.toLowerCase();
    const title = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    const sentence = input
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
    const camel = words
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');

    return {
      uppercase: upper,
      lowercase: lower,
      titleCase: title,
      sentenceCase: sentence,
      camelCase: camel,
    };
  }, [input]);

  return (
    <ToolPageTemplate
      title="Case Converter"
      description="Convert text into common casing styles and copy each result instantly."
      metaDescription="Convert text into uppercase, lowercase, title case, sentence case, or camelCase."
      usageSteps={[
        'Paste your text into the input box.',
        'Scan the converted versions that appear on the right.',
        'Use the copy button for any format you want to drop into a document or code file.',
      ]}
      faqItems={[
        {
          question: 'How does title case behave?',
          answer: 'It capitalizes the first letter of each word and lowercases the rest, which is handy for headings and names.',
        },
        {
          question: 'Is camelCase generated for every input?',
          answer: 'The tool creates a basic camelCase version from the words it detects, so it is best for simple labels and identifiers.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Input text</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={12}
            placeholder="Type or paste text here..."
            className="min-h-[260px] w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:bg-white"
          />
        </label>

        <div className="space-y-3">
          {[
            ['UPPERCASE', conversions.uppercase],
            ['lowercase', conversions.lowercase],
            ['Title Case', conversions.titleCase],
            ['Sentence case', conversions.sentenceCase],
            ['camelCase', conversions.camelCase],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
                <CopyButton text={value} label="Copy" />
              </div>
              <div className="min-h-16 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap">
                {value || 'Nothing to show yet. Enter some text to convert it.'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default CaseConverterPage;
