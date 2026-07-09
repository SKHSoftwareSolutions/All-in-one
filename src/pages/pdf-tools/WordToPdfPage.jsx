import { useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import { apiUrl } from '../../apiBase';

function WordToPdfPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState('');

  async function handleConvert() {
    if (!file) {
      setError('Please choose a .docx file.');
      return;
    }
    setProcessing(true);
    setStatus('Uploading and converting document...');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(apiUrl('/api/pdf/word-to-pdf'), { method: 'POST', body: formData });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Conversion failed.');
      }
      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
      setStatus('Conversion complete.');
    } catch (err) {
      setError(err.message || 'Unable to convert Word to PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolPageTemplate title="Word to PDF" description="Convert a .docx document into a PDF file using the server-side converter." metaDescription="Convert a Word document into a PDF file for sharing, printing, or archiving." usageSteps={['Upload a .docx file from your computer.', 'Start the conversion and wait for the PDF to be generated.', 'Download the PDF and open it in a viewer to confirm the formatting.']} faqItems={[{question:'What file types are supported?',answer:'The tool accepts .docx files and converts them to PDF using a server-side document converter.'},{question:'Will the layout stay exactly the same?',answer:'Most Word documents convert cleanly, but very complex formatting can shift slightly depending on the source file.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Select .docx file</span>
            <input type="file" accept=".docx" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700" />
          </label>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}

          <button type="button" onClick={handleConvert} disabled={processing} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {processing ? 'Processing...' : 'Convert to PDF'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Result</h3>
          {resultUrl ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-600">Your PDF is ready.</p>
              <a href={resultUrl} download="converted.pdf" className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Download PDF
              </a>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Your converted PDF will appear here after processing.</div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default WordToPdfPage;
