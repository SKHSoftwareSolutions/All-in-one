import { useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import { apiUrl } from '../../apiBase';

function ImageToPdfPage() {
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState('');

  async function handleConvert() {
    if (!files.length) {
      setError('Please choose one or more image files.');
      return;
    }
    setProcessing(true);
    setStatus('Uploading and creating PDF...');
    setError('');
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('page_size', pageSize);
      formData.append('orientation', orientation);
      const response = await fetch(apiUrl('/api/image/to-pdf'), { method: 'POST', body: formData });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Conversion failed.');
      }
      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
      setStatus('PDF created.');
    } catch (err) {
      setError(err.message || 'Unable to create PDF from images.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolPageTemplate title="Image to PDF" description="Upload one or more images and combine them into a single PDF with page size and orientation controls." metaDescription="Turn one or more images into a single PDF document with page-size and orientation options." usageSteps={['Choose the images you want to combine.', 'Pick the page size and orientation that fit your use case.', 'Create the PDF and download it when the preview looks right.']} faqItems={[{question:'What image formats are supported?',answer:'PNG, JPG, and WebP files are accepted for conversion into a PDF.'},{question:'Will each image be placed on its own page?',answer:'Yes. Each uploaded image becomes a page in the generated PDF.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Select images</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Page size</span>
              <select value={pageSize} onChange={(event) => setPageSize(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Orientation</span>
              <select value={orientation} onChange={(event) => setOrientation(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none">
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>
          </div>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}

          <button type="button" onClick={handleConvert} disabled={processing} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {processing ? 'Processing...' : 'Create PDF'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Result</h3>
          {resultUrl ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-600">Your combined PDF is ready.</p>
              <a href={resultUrl} download="images.pdf" className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Download PDF
              </a>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Your PDF will appear here after processing.</div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default ImageToPdfPage;
