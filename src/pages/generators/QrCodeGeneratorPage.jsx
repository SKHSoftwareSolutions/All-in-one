import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import ToolPageTemplate from '../../components/ToolPageTemplate';

function QrCodeGeneratorPage() {
  const [value, setValue] = useState('https://example.com');
  const [dataUrl, setDataUrl] = useState('');
  const [svgMarkup, setSvgMarkup] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!value.trim()) {
      setError('Please enter some text or a URL.');
      return;
    }

    let cancelled = false;
    setError('');

    Promise.all([
      QRCode.toDataURL(value, { width: 240, margin: 1, color: { dark: '#111827', light: '#ffffff' } }),
      QRCode.toString(value, { type: 'svg', margin: 1, color: { dark: '#111827', light: '#ffffff' } }),
    ])
      .then(([png, svg]) => {
        if (cancelled) return;
        setDataUrl(png);
        setSvgMarkup(svg);
      })
      .catch(() => {
        if (!cancelled) setError('Unable to generate QR code right now.');
      });

    return () => {
      cancelled = true;
    };
  }, [value]);

  async function handleDownload(format) {
    if (format === 'svg') {
      if (!svgMarkup) return;
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'qrcode.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode.${format}`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <ToolPageTemplate
      title="QR Code Generator"
      description="Create a QR code for text or URLs directly in your browser and download it as an image."
      metaDescription="Generate a QR code for a URL, message, or short text and download it as an image."
      usageSteps={[
        'Paste a URL or short text into the input field.',
        'Wait for the QR code preview to appear beneath it.',
        'Download the PNG or SVG version when you are ready to share it.',
      ]}
      faqItems={[
        {
          question: 'How much text can it handle?',
          answer: 'The generator works best for short links and compact text. Long strings can become harder to scan.',
        },
        {
          question: 'Does it work offline?',
          answer: 'Yes. Once the page is open, the QR code is generated locally in your browser.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Text or URL</span>
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              rows={6}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
              placeholder="https://example.com"
            />
          </label>

          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => handleDownload('png')} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Download PNG
            </button>
            <button type="button" onClick={() => handleDownload('svg')} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Download SVG
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-4">
            {dataUrl ? <img src={dataUrl} alt="Generated QR code" className="max-w-full rounded-xl" /> : <p className="text-sm text-slate-500">Your QR code will appear here.</p>}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default QrCodeGeneratorPage;
