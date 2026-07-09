import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';

function EmiLoanCalculatorPage() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('12');
  const [tenure, setTenure] = useState('12');
  const [tenureUnit, setTenureUnit] = useState('months');
  const [error, setError] = useState('');

  const results = useMemo(() => {
    const principalValue = Number(principal);
    const rateValue = Number(rate);
    const tenureValue = Number(tenure);
    const months = tenureUnit === 'years' ? tenureValue * 12 : tenureValue;

    if (!principal || !rate || !tenure) {
      setError('Please fill in all values.');
      return null;
    }

    if (principalValue <= 0 || rateValue < 0 || tenureValue <= 0) {
      setError('Principal must be positive, rate cannot be negative, and tenure must be positive.');
      return null;
    }

    if (months <= 0) {
      setError('Tenure must be at least one month.');
      return null;
    }

    setError('');

    const monthlyRate = rateValue / 100 / 12;
    const emi = monthlyRate > 0 ? (principalValue * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : principalValue / months;
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principalValue;

    return {
      emi,
      totalPayment,
      totalInterest,
      amortization: [
        { label: 'Principal', value: principalValue },
        { label: 'Interest', value: totalInterest },
        { label: 'Total payment', value: totalPayment },
      ],
    };
  }, [principal, rate, tenure, tenureUnit]);

  return (
    <ToolPageTemplate
      title="EMI Loan Calculator"
      description="Estimate monthly EMI, total interest, and total payment for a loan."
      metaDescription="Estimate loan EMI, total interest, and total repayment from principal, rate, and tenure."
      usageSteps={[
        'Enter the loan principal, annual interest rate, and tenure.',
        'Choose whether the tenure is in months or years.',
        'Review the monthly EMI, the total interest paid, and the full repayment total.',
      ]}
      faqItems={[
        {
          question: 'Is this a full amortization schedule?',
          answer: 'It gives a quick summary of principal, interest, and total repayment rather than a month-by-month payment table.',
        },
        {
          question: 'Does it include processing fees?',
          answer: 'No. The calculator uses the values you enter and does not add lender fees, insurance, or other charges.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Principal amount</span>
              <input
                type="number"
                value={principal}
                onChange={(event) => setPrincipal(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Annual interest rate (%)</span>
              <input
                type="number"
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Tenure</span>
              <input
                type="number"
                value={tenure}
                onChange={(event) => setTenure(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Unit</span>
              <select
                value={tenureUnit}
                onChange={(event) => setTenureUnit(event.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </label>
          </div>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
        </div>

        <div className="space-y-4">
          {results ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Monthly EMI', `₹${results.emi.toFixed(2)}`],
                  ['Total interest', `₹${results.totalInterest.toFixed(2)}`],
                  ['Total payment', `₹${results.totalPayment.toFixed(2)}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-left text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Summary</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.amortization.map((row) => (
                      <tr key={row.label} className="border-t border-slate-200 bg-white">
                        <td className="px-4 py-3 text-slate-700">{row.label}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">₹{row.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Enter valid loan details to see EMI results.
            </div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default EmiLoanCalculatorPage;
