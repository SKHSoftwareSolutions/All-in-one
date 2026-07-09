import { useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import { apiUrl } from '../../apiBase';

function DocumentSimilarityCheckerPage() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  async function handleCompare() {
    setProcessing(true);
    setStatus('Comparing documents...');
    setError('');
    try {
      const formData = new FormData();
      formData.append('text_a', textA);
      formData.append('text_b', textB);
      if (fileA) formData.append('file_a', fileA);
      if (fileB) formData.append('file_b', fileB);
      const response = await fetch(apiUrl('/api/text/similarity'), { method: 'POST', body: formData });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Comparison failed.');
      }
      const json = await response.json();
      setResult(json);
      setStatus('Comparison complete.');
    } catch (err) {
      setError(err.message || 'Unable to compare documents.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolPageTemplate title="Document Comparison Tool" description="Compare two provided documents against each other only. This does not check against the web or any external database." metaDescription="Compare two documents and see how similar they are based on their shared wording and structure." usageSteps={['Paste the first document or upload a text file for it.', 'Do the same for the second document.', 'Run the comparison and review the overall similarity score plus the matching passages.']} faqItems={[{question:'Does this tool search the web?',answer:'No. It compares only the two documents you provide, so it does not check against external sources or databases.'},{question:'How accurate is the similarity score?',answer:'It is a useful quick signal, but short texts and highly repetitive wording can make the score less meaningful.'}]}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Document A</h3>
            <textarea value={textA} onChange={(event) => setTextA(event.target.value)} rows={10} placeholder="Paste the first document here..." className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none" />
            <input type="file" accept=".txt,.md" onChange={(event) => setFileA(event.target.files?.[0] || null)} className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700" />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Document B</h3>
            <textarea value={textB} onChange={(event) => setTextB(event.target.value)} rows={10} placeholder="Paste the second document here..." className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none" />
            <input type="file" accept=".txt,.md" onChange={(event) => setFileB(event.target.files?.[0] || null)} className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700" />
          </div>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}

          <button type="button" onClick={handleCompare} disabled={processing} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {processing ? 'Comparing...' : 'Compare documents'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Results</h3>
          {result ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                <div className="text-sm text-slate-500">Overall similarity</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{result.overall_similarity}%</div>
              </div>
              <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-800">Matching passages</div>
                <div className="mt-3 space-y-3 text-sm text-slate-600">
                  {result.matches.length ? result.matches.map((match, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 p-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Match score {match.score}</div>
                      <div className="mt-2 whitespace-pre-wrap">{match.sentence_a}</div>
                      <div className="mt-2 whitespace-pre-wrap text-slate-500">{match.sentence_b}</div>
                    </div>
                  )) : <p>No strong sentence-level matches were found.</p>}
                </div>
              </div>
              <p className="text-sm text-slate-500">{result.note}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Your similarity results will appear here after processing.</div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default DocumentSimilarityCheckerPage;
