import { useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import { apiUrl } from '../../apiBase';

function MergePdfPage() {
  const [files, setFiles] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState('');

  function handleFileSelect(selectedFiles) {
    const nextFiles = Array.from(selectedFiles).filter((file) => file.type === 'application/pdf');
    if (!nextFiles.length) {
      setError('Please choose one or more PDF files.');
      return;
    }
    setFiles((current) => [...current, ...nextFiles]);
    setError('');
  }

  function reorder(from, to) {
    setFiles((current) => {
      const updated = [...current];
      const [item] = updated.splice(from, 1);
      updated.splice(to, 0, item);
      return updated;
    });
  }

  async function handleMerge() {
    if (!files.length) {
      setError('Please add at least one PDF file.');
      return;
    }
    setProcessing(true);
    setStatus('Uploading and merging PDFs...');
    setError('');
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('order', JSON.stringify(files.map((file) => file.name)));
      const response = await fetch(apiUrl('/api/pdf/merge'), { method: 'POST', body: formData });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Merge failed.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('Merge complete.');
    } catch (err) {
      setError(err.message || 'Unable to merge PDFs.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolPageTemplate title="Merge PDF" description="Upload multiple PDFs, reorder them with drag-and-drop, and merge them into a single download." metaDescription="Combine several PDF files into a single document in the order you choose." usageSteps={['Select the PDF files you want to combine.', 'Drag the file cards into the order you want them to appear.', 'Click merge PDFs and download the stitched file when the process completes.']} faqItems={[{question:'Does this tool keep bookmarks or form fields?',answer:'The merge keeps the content from each PDF, but complex document structure such as interactive forms may not be preserved exactly.'},{question:'How many files can I upload at once?',answer:'You can add up to 10 PDFs in a single merge operation.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Select PDFs</span>
            <input type="file" accept="application/pdf" multiple onChange={(event) => handleFileSelect(event.target.files)} className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700" />
          </label>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} draggable onDragStart={() => setDraggedIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedIndex !== null) { reorder(draggedIndex, index); setDraggedIndex(null); } }} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                <span>{file.name}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Drag to reorder</span>
              </div>
            ))}
          </div>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}

          <button type="button" onClick={handleMerge} disabled={processing} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {processing ? 'Processing...' : 'Merge PDFs'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Result</h3>
          {resultUrl ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-600">Your merged PDF is ready.</p>
              <a href={resultUrl} download="merged.pdf" className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Download merged PDF
              </a>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Your merged file will appear here after processing.</div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default MergePdfPage;
