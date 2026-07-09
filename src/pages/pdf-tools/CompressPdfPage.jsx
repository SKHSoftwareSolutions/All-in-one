import { useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import { apiUrl } from '../../apiBase';

function CompressPdfPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [sizes, setSizes] = useState({ before: 0, after: 0 });

  async function handleCompress() {
    if (!file) {
      setError('Please choose a PDF file.');
      return;
    }
    setProcessing(true);
    setStatus('Uploading and compressing PDF...');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(apiUrl('/api/pdf/compress'), { method: 'POST', body: formData });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Compression failed.');
      }
      const blob = await response.blob();
      setSizes({ before: file.size, after: blob.size });
      setResultUrl(URL.createObjectURL(blob));
      setStatus('Compression complete.');
    } catch (err) {
      setError(err.message || 'Unable to compress PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolPageTemplate title="Compress PDF" description="Reduce the size of a PDF in the browser by sending it to the server-side processing endpoint." metaDescription="Shrink a PDF file so it is easier to email, upload, or store." usageSteps={['Upload the PDF you want to make smaller.', 'Start the compression process and wait for the optimized file to be generated.', 'Download the compressed version and compare the before-and-after file sizes.']} faqItems={[{question:'Will compression reduce quality?',answer:'It can reduce file size by simplifying the document structure, but the visible text and images are usually preserved well for everyday use.'},{question:'Does this tool upload my file somewhere?',answer:'Yes. The file is sent to the server for processing so the compression can be done outside the browser.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Select PDF</span>
            <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700" />
          </label>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}

          <button type="button" onClick={handleCompress} disabled={processing} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {processing ? 'Processing...' : 'Compress PDF'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Result</h3>
          {resultUrl ? (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Before</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{(sizes.before / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">After</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{(sizes.after / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <a href={resultUrl} download="compressed.pdf" className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Download compressed PDF
              </a>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Your compressed file will appear here after processing.</div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default CompressPdfPage;
