import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';

const modes = [
  { value: 'percent-of', label: 'X% of Y' },
  { value: 'what-percent', label: 'X is what % of Y' },
  { value: 'change', label: '% increase/decrease between X and Y' },
];

function PercentageCalculatorPage() {
  const [mode, setMode] = useState('percent-of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    const parsedA = Number(a);
    const parsedB = Number(b);

    if (a === '' || b === '') {
      setError('Please enter both values.');
      return null;
    }

    if (!Number.isFinite(parsedA) || !Number.isFinite(parsedB)) {
      setError('Please enter valid numeric values.');
      return null;
    }

    setError('');

    if (mode === 'percent-of') {
      return { label: 'Result', value: `${((parsedA / 100) * parsedB).toFixed(2)}` };
    }

    if (mode === 'what-percent') {
      if (parsedB === 0) {
        setError('The divisor cannot be zero.');
        return null;
      }
      return { label: 'Percentage', value: `${((parsedA / parsedB) * 100).toFixed(2)}%` };
    }

    const change = ((parsedB - parsedA) / parsedA) * 100;
    return {
      label: change >= 0 ? 'Increase' : 'Decrease',
      value: `${Math.abs(change).toFixed(2)}%`,
    };
  }, [a, b, mode]);

  return (
    <ToolPageTemplate
      title="Percentage Calculator"
      description="Compute common percentage problems with clear inputs and instant feedback."
      metaDescription="Solve percentage questions such as X% of Y, X as a percent of Y, and percentage change."
      usageSteps={[
        'Pick the type of percentage question you want to solve.',
        'Enter the two values in the fields shown for that mode.',
        'Read the result instantly and use it for invoices, discounts, or quick comparisons.',
      ]}
      faqItems={[
        {
          question: 'What happens if I divide by zero?',
          answer: 'The tool blocks that input and shows a validation message because the calculation is undefined.',
        },
        {
          question: 'Can I use decimals?',
          answer: 'Yes. Both values accept decimal numbers, so you can work with partial amounts and precise percentages.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Select mode</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
            >
              {modes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{mode === 'percent-of' ? 'Percent' : 'X'}</span>
              <input
                type="number"
                value={a}
                onChange={(event) => setA(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
                placeholder={mode === 'percent-of' ? '25' : '10'}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{mode === 'change' ? 'Original value' : 'Y'}</span>
              <input
                type="number"
                value={b}
                onChange={(event) => setB(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
                placeholder={mode === 'percent-of' ? '200' : '50'}
              />
            </label>
          </div>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Result</h3>
          {result ? (
            <div className="mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">{result.label}</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{result.value}</div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Enter valid values to see the result.
            </div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default PercentageCalculatorPage;
