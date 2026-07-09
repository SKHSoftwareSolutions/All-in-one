import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';

const defaultGradeMap = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0,
};

function GpaCalculatorPage() {
  const [rows, setRows] = useState([{ course: 'Math', credits: '3', grade: 'A' }]);
  const [gradeMap, setGradeMap] = useState(defaultGradeMap);
  const [error, setError] = useState('');

  const result = useMemo(() => {
    const validRows = rows.filter((row) => row.course.trim() && row.credits && row.grade);
    if (!validRows.length) {
      setError('Add at least one course row.');
      return null;
    }

    let totalCredits = 0;
    let totalPoints = 0;

    for (const row of validRows) {
      const credits = Number(row.credits);
      const points = gradeMap[row.grade];
      if (!Number.isFinite(credits) || credits <= 0) {
        setError('Credit hours must be positive numbers.');
        return null;
      }
      if (points === undefined) {
        setError('Each grade must be mapped to a GPA value.');
        return null;
      }
      totalCredits += credits;
      totalPoints += credits * points;
    }

    setError('');
    return totalCredits ? totalPoints / totalCredits : 0;
  }, [rows, gradeMap]);

  function updateRow(index, field, value) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  }

  function addRow() {
    setRows((current) => [...current, { course: '', credits: '', grade: 'A' }]);
  }

  function removeRow(index) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  function updateGradeMap(grade, value) {
    setGradeMap((current) => ({ ...current, [grade]: Number(value) }));
  }

  return (
    <ToolPageTemplate
      title="GPA Calculator"
      description="Calculate weighted GPA from multiple course rows and an editable grade-to-points mapping."
      metaDescription="Calculate weighted GPA from course credits and grades for a semester or full academic plan."
      usageSteps={[
        'Add each course, its credit hours, and the grade you received.',
        'Adjust the grade mapping if your school uses a different point scale.',
        'Review the weighted GPA in the result panel once all rows are filled in.',
      ]}
      faqItems={[
        {
          question: 'Can I change the grading scale?',
          answer: 'Yes. Each grade can be mapped to a different point value if your school or program uses a custom scale.',
        },
        {
          question: 'What if I leave a row blank?',
          answer: 'Blank course rows are ignored, so you can build the list gradually without getting bad results.',
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Courses</h3>
            <button type="button" onClick={addRow} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Add course
            </button>
          </div>

          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1.2fr_0.6fr_0.6fr_auto]">
                <input
                  value={row.course}
                  onChange={(event) => updateRow(index, 'course', event.target.value)}
                  placeholder="Course name"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={row.credits}
                  onChange={(event) => updateRow(index, 'credits', event.target.value)}
                  placeholder="Credits"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
                />
                <select
                  value={row.grade}
                  onChange={(event) => updateRow(index, 'grade', event.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
                >
                  {Object.keys(gradeMap).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => removeRow(index)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Result</h3>
            <div className="mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">Weighted GPA</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{result !== null ? result.toFixed(2) : '—'}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Grade mapping</h3>
            <div className="mt-4 space-y-2">
              {Object.entries(gradeMap).map(([grade, points]) => (
                <label key={grade} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <span className="font-medium text-slate-700">{grade}</span>
                  <input
                    type="number"
                    step="0.1"
                    value={points}
                    onChange={(event) => updateGradeMap(grade, event.target.value)}
                    className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-right text-sm focus:border-slate-500 focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default GpaCalculatorPage;
