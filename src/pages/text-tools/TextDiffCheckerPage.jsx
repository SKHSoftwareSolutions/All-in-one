import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';

const SAMPLE_ORIGINAL = 'Launch the new dashboard with a clear navigation bar, shorter onboarding steps, and a stronger call to action.';
const SAMPLE_UPDATED = 'Launch the refreshed dashboard with a clearer navigation bar, shorter onboarding steps, and a stronger action prompt.';

function tokenize(text) {
  return text.match(/\S+|\s+/g) || [];
}

function diffWords(a, b) {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  const lengthA = tokensA.length;
  const lengthB = tokensB.length;

  const lcs = Array.from({ length: lengthA + 1 }, () => new Array(lengthB + 1).fill(0));
  for (let i = lengthA - 1; i >= 0; i -= 1) {
    for (let j = lengthB - 1; j >= 0; j -= 1) {
      lcs[i][j] = tokensA[i] === tokensB[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const ops = [];
  let i = 0;
  let j = 0;
  while (i < lengthA && j < lengthB) {
    if (tokensA[i] === tokensB[j]) {
      ops.push({ type: 'same', value: tokensA[i] });
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      ops.push({ type: 'removed', value: tokensA[i] });
      i += 1;
    } else {
      ops.push({ type: 'added', value: tokensB[j] });
      j += 1;
    }
  }
  while (i < lengthA) {
    ops.push({ type: 'removed', value: tokensA[i] });
    i += 1;
  }
  while (j < lengthB) {
    ops.push({ type: 'added', value: tokensB[j] });
    j += 1;
  }

  return ops;
}

function TextDiffCheckerPage() {
  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [updated, setUpdated] = useState(SAMPLE_UPDATED);

  const { ops, addedCount, removedCount } = useMemo(() => {
    const diffOps = diffWords(original, updated);
    return {
      ops: diffOps,
      addedCount: diffOps.filter((op) => op.type === 'added' && op.value.trim()).length,
      removedCount: diffOps.filter((op) => op.type === 'removed' && op.value.trim()).length,
    };
  }, [original, updated]);

  return (
    <ToolPageTemplate
      title="Text Diff Checker"
      description="Compare two text blocks and spot the wording changes between versions."
      metaDescription="Compare two text passages and spot the differences between them quickly."
      usageSteps={[
        'Paste the original text into one box and the revised version into the other.',
        'Review the highlighted differences to see what changed.',
        'Use the result to review edits, compare drafts, or check copy changes before publishing.',
      ]}
      faqItems={[
        {
          question: 'What kind of changes does it show?',
          answer: 'It highlights text-level differences, so you can quickly spot inserted, removed, or rearranged wording.',
        },
        {
          question: 'Is it meant for code?',
          answer: 'It is better for plain text and document revisions than for comparing large programming files.',
        },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Compare two versions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Original</span>
            <textarea
              value={original}
              onChange={(event) => setOriginal(event.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-slate-500"
              placeholder="Paste the original text here..."
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Updated</span>
            <textarea
              value={updated}
              onChange={(event) => setUpdated(event.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-slate-500"
              placeholder="Paste the updated text here..."
            />
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Differences</h3>
            <div className="flex gap-3 text-xs font-medium">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">+{addedCount} added</span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">-{removedCount} removed</span>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {ops.length ? (
              ops.map((op, index) => {
                if (op.type === 'same') return <span key={index}>{op.value}</span>;
                if (op.type === 'added') {
                  return (
                    <span key={index} className="rounded bg-emerald-100 text-emerald-800">
                      {op.value}
                    </span>
                  );
                }
                return (
                  <span key={index} className="rounded bg-rose-100 text-rose-700 line-through">
                    {op.value}
                  </span>
                );
              })
            ) : (
              <span className="text-slate-500">Enter text in both boxes to see the differences.</span>
            )}
          </p>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default TextDiffCheckerPage;
