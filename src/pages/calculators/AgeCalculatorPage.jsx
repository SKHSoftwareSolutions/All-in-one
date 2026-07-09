import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';

function AgeCalculatorPage() {
  const [dob, setDob] = useState('1995-01-01');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    if (!dob) {
      setError('Please choose a date of birth.');
      return null;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime())) {
      setError('Please enter a valid date.');
      return null;
    }

    if (birthDate > today) {
      setError('Date of birth cannot be in the future.');
      return null;
    }

    setError('');

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const diff = nextBirthday < today ? new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate()) : nextBirthday;
    const daysUntil = Math.max(0, Math.ceil((diff - today) / (1000 * 60 * 60 * 24)));

    return {
      years,
      months,
      days,
      daysUntil,
    };
  }, [dob]);

  return (
    <ToolPageTemplate
      title="Age Calculator"
      description="Find your exact age and the days remaining until your next birthday."
      metaDescription="Calculate age from a date of birth and see how many days remain until the next birthday."
      usageSteps={[
        'Choose a date of birth in the picker.',
        'The calculator instantly shows your age in years, months, and days.',
        'Use the next-birthday count when you want a quick reminder for upcoming celebrations.',
      ]}
      faqItems={[
        {
          question: 'Does it handle future dates?',
          answer: 'No. The tool rejects dates in the future so the result stays grounded in real time.',
        },
        {
          question: 'Is this accurate for leap years?',
          answer: 'Yes. The calculation uses the calendar dates you enter, so leap-year birthdays are handled correctly.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 p-5">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Date of birth</span>
            <input
              type="date"
              value={dob}
              onChange={(event) => setDob(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
            />
          </label>

          {error ? <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          {result ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Years', result.years],
                ['Months', result.months],
                ['Days', result.days],
                ['Days until next birthday', result.daysUntil],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Choose a date to calculate your age.
            </div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default AgeCalculatorPage;
