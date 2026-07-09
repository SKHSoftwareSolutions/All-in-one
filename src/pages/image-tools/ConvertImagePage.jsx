import { useState } from 'react';
import ImageDropzone from '../../components/ImageDropzone';
import ToolPageTemplate from '../../components/ToolPageTemplate';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function ConvertImagePage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [targetFormat, setTargetFormat] = useState('png');
  const [message, setMessage] = useState('');
  const [originalSize, setOriginalSize] = useState(0);

  const isLarge = originalSize > MAX_SIZE_BYTES;

  function handleFileSelect(selectedFile) {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setMessage(selectedFile.size > MAX_SIZE_BYTES ? 'Large files may take longer to process locally.' : '');
    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);
    convertImage(selectedFile, targetFormat);
  }

  function convertImage(selectedFile, format) {
    const image = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (blob) {
            setConvertedUrl(URL.createObjectURL(blob));
          }
        },
        `image/${format}`,
        1
      );
    };
    image.src = objectUrl;
  }

  function handleConvert() {
    if (!file) return;
    convertImage(file, targetFormat);
  }

  function downloadConverted() {
    if (!convertedUrl) return;
    const link = document.createElement('a');
    link.download = `converted.${targetFormat}`;
    link.href = convertedUrl;
    link.click();
  }

  return (
    <ToolPageTemplate title="Convert Image" description="Convert uploaded images between PNG, JPG, and WebP entirely in your browser." metaDescription="Convert a PNG, JPG, or WebP image to another format without leaving the browser." usageSteps={['Upload the source image.', 'Pick the output format you need from the dropdown.', 'Convert the file and download the result once the preview looks correct.']} faqItems={[{question:'Will the image quality change?',answer:'The conversion is lossless in the sense that it preserves the source pixels, though some formats may be better for transparency or compression.'},{question:'Does it support transparent PNGs?',answer:'Yes, PNG is a good choice for transparent images, while JPG does not preserve transparency.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <ImageDropzone onFileSelect={handleFileSelect} label="Drop an image here or click to browse" helper="PNG, JPG, or WebP files are supported." accept="image/png,image/jpeg,image/webp" />
          {isLarge ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">Large files above 10MB may take a little longer to process locally.</p> : null}
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Output format</span>
            <select value={targetFormat} onChange={(event) => setTargetFormat(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none">
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleConvert} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Convert image
            </button>
            <button type="button" onClick={downloadConverted} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" disabled={!convertedUrl}>
              Download result
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Original</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {previewUrl ? <img src={previewUrl} alt="Original upload" className="max-h-80 w-full object-contain" /> : <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">Upload an image to preview it.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Converted result</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {convertedUrl ? <img src={convertedUrl} alt="Converted upload" className="max-h-80 w-full object-contain" /> : <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">Your converted file will appear here.</div>}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default ConvertImagePage;
