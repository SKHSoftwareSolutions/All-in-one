import { useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import { apiUrl } from '../../apiBase';

function PdfToWordPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState('');

  async function handleConvert() {
    if (!file) {
      setError('Please choose a PDF file.');
      return;
    }
    setProcessing(true);
    setStatus('Uploading and converting PDF...');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(apiUrl('/api/pdf/to-word'), { method: 'POST', body: formData });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Conversion failed.');
      }
      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
      setStatus('Conversion complete. Complex layouts may not convert perfectly.');
    } catch (err) {
      setError(err.message || 'Unable to convert PDF to Word.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolPageTemplate title="PDF to Word" description="Convert a PDF into an editable Word document. Complex layouts may not convert perfectly." metaDescription="Turn a PDF into a DOCX file you can edit in Word or Google Docs." usageSteps={['Upload the PDF you want to edit.', 'Start the conversion and wait for the Word document to be generated.', 'Download the DOCX file and review the layout, especially if the PDF contains columns, tables, or scanned pages.']} faqItems={[{question:'How accurate is the conversion?',answer:'It is usually good for simple text-based PDFs, but complex layouts, scanned pages, and fancy tables can come through imperfectly.'},{question:'Does it work on scanned documents?',answer:'Not reliably. Scanned pages are images, so the result is more like an image import than true editable text.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Select PDF</span>
            <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700" />
          </label>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}

          <button type="button" onClick={handleConvert} disabled={processing} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {processing ? 'Processing...' : 'Convert to Word'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Result</h3>
          {resultUrl ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-600">Your editable Word document is ready.</p>
              <a href={resultUrl} download="converted.docx" className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Download DOCX
              </a>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Your converted document will appear here after processing.</div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default PdfToWordPage;
