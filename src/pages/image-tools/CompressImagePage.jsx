import { useMemo, useState } from 'react';
import ImageDropzone from '../../components/ImageDropzone';
import ToolPageTemplate from '../../components/ToolPageTemplate';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function compressImage(file, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error('Compression failed.'));
        },
        file.type || 'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('The selected file could not be read.'));
    };
    img.src = url;
  });
}

function CompressImagePage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [compressedUrl, setCompressedUrl] = useState('');
  const [quality, setQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [message, setMessage] = useState('');

  const isLarge = originalSize > MAX_SIZE_BYTES;

  async function handleFileSelect(selectedFile) {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setMessage(selectedFile.size > MAX_SIZE_BYTES ? 'Large files may take a moment to process in the browser.' : '');
    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);
    try {
      const compressedBlob = await compressImage(selectedFile, quality);
      setCompressedSize(compressedBlob.size);
      setCompressedUrl(URL.createObjectURL(compressedBlob));
    } catch (error) {
      setMessage(error.message || 'Compression failed.');
    }
  }

  async function handleQualityChange(nextQuality) {
    setQuality(nextQuality);
    if (!file) return;
    try {
      const compressedBlob = await compressImage(file, nextQuality);
      setCompressedSize(compressedBlob.size);
      setCompressedUrl(URL.createObjectURL(compressedBlob));
    } catch (error) {
      setMessage(error.message || 'Compression failed.');
    }
  }

  function downloadCompressed() {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.download = `compressed-${file?.name || 'image'}`;
    link.href = compressedUrl;
    link.click();
  }

  const reduction = useMemo(() => (originalSize ? ((originalSize - compressedSize) / originalSize) * 100 : 0), [compressedSize, originalSize]);

  return (
    <ToolPageTemplate title="Compress Image" description="Reduce image file size in-browser while keeping your work local and private." metaDescription="Reduce an image file size locally in the browser without uploading it to a remote service." usageSteps={['Drop in an image or pick one from your device.', 'Adjust the compression quality slider to balance file size against visual sharpness.', 'Preview the result, then download the smaller file when it looks acceptable.']} faqItems={[{question:'Is this processing done locally?',answer:'Yes. The compression runs in your browser, so the file does not need to leave your device.'},{question:'What size files work best?',answer:'The tool handles common PNG, JPG, and WebP files well, although very large images can take longer to process.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <ImageDropzone onFileSelect={handleFileSelect} label="Drop an image here or click to browse" helper="PNG, JPG, or WebP up to large file sizes are supported." accept="image/png,image/jpeg,image/webp" />
          {isLarge ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">Large files above 10MB may take longer to process locally.</p> : null}
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Compression quality: {quality.toFixed(2)}</span>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => handleQualityChange(Number(event.target.value))} className="w-full" />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Original</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{formatBytes(originalSize)}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Compressed</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{formatBytes(compressedSize)}</div>
            </div>
          </div>

          <button type="button" onClick={downloadCompressed} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" disabled={!compressedUrl}>
            Download compressed image
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Preview</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {previewUrl ? <img src={previewUrl} alt="Original upload" className="max-h-80 w-full object-contain" /> : <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">Upload an image to preview it.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Compressed result</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {compressedUrl ? <img src={compressedUrl} alt="Compressed upload" className="max-h-80 w-full object-contain" /> : <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">Your compressed version will appear here.</div>}
            </div>
            <div className="mt-3 text-sm text-slate-600">Estimated reduction: {reduction.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default CompressImagePage;
