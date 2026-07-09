import { useMemo, useState } from 'react';
import ImageDropzone from '../../components/ImageDropzone';
import ToolPageTemplate from '../../components/ToolPageTemplate';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function ResizeImagePage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resizedUrl, setResizedUrl] = useState('');
  const [width, setWidth] = useState('1200');
  const [height, setHeight] = useState('800');
  const [lockAspect, setLockAspect] = useState(true);
  const [originalSize, setOriginalSize] = useState(0);
  const [message, setMessage] = useState('');
  const [sourceDimensions, setSourceDimensions] = useState({ width: 0, height: 0 });

  const isLarge = originalSize > MAX_SIZE_BYTES;

  const ratio = useMemo(() => {
    if (!sourceDimensions.width || !sourceDimensions.height) return 1;
    return sourceDimensions.width / sourceDimensions.height;
  }, [sourceDimensions]);

  async function handleFileSelect(selectedFile) {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setMessage(selectedFile.size > MAX_SIZE_BYTES ? 'Large files may take a moment to process locally.' : '');
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    const image = new Image();
    image.onload = () => {
      setSourceDimensions({ width: image.width, height: image.height });
      setWidth(String(image.width));
      setHeight(String(image.height));
      resizeImage(selectedFile, image.width, image.height);
    };
    image.src = objectUrl;
  }

  function resizeImage(selectedFile, targetWidth, targetHeight) {
    const image = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (blob) {
          setResizedUrl(URL.createObjectURL(blob));
        }
      }, selectedFile.type || 'image/png');
    };
    image.src = objectUrl;
  }

  function handleDimensionChange(nextWidth, nextHeight) {
    setWidth(nextWidth);
    setHeight(nextHeight);
    if (file) resizeImage(file, Number(nextWidth), Number(nextHeight));
  }

  function handleWidthChange(value) {
    const nextValue = Number(value);
    if (lockAspect && sourceDimensions.width && sourceDimensions.height) {
      const nextHeight = Math.round(nextValue / ratio);
      setHeight(String(nextHeight));
      handleDimensionChange(String(nextValue), String(nextHeight));
      return;
    }
    setWidth(value);
    if (file) resizeImage(file, nextValue, Number(height));
  }

  function handleHeightChange(value) {
    const nextValue = Number(value);
    if (lockAspect && sourceDimensions.width && sourceDimensions.height) {
      const nextWidth = Math.round(nextValue * ratio);
      setWidth(String(nextWidth));
      handleDimensionChange(String(nextWidth), String(nextValue));
      return;
    }
    setHeight(value);
    if (file) resizeImage(file, Number(width), nextValue);
  }

  function downloadResized() {
    if (!resizedUrl) return;
    const link = document.createElement('a');
    link.download = `resized-${file?.name || 'image'}`;
    link.href = resizedUrl;
    link.click();
  }

  return (
    <ToolPageTemplate title="Resize Image" description="Resize images in your browser while keeping an aspect ratio lock available." metaDescription="Resize an image to a new width and height while keeping the original proportions if needed." usageSteps={['Upload the image and let the tool read its original dimensions.', 'Change the width or height, or leave the aspect ratio lock on to preserve proportions.', 'Download the resized version once the preview matches your target size.']} faqItems={[{question:'What happens when I turn off the aspect ratio lock?',answer:'The width and height can be changed independently, which is useful for specific layouts or social media crops.'},{question:'Is this good for large banners or hero images?',answer:'It is useful for resizing source images before upload, but it does not add extra detail to a low-resolution file.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <ImageDropzone onFileSelect={handleFileSelect} label="Drop an image here or click to browse" helper="JPG, PNG, or WebP are supported." accept="image/png,image/jpeg,image/webp" />
          {isLarge ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">Large files above 10MB may take a little longer to process locally.</p> : null}
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Width</span>
              <input type="number" min="1" value={width} onChange={(event) => handleWidthChange(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Height</span>
              <input type="number" min="1" value={height} onChange={(event) => handleHeightChange(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none" />
            </label>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <span>Lock aspect ratio</span>
            <input type="checkbox" checked={lockAspect} onChange={() => setLockAspect(!lockAspect)} className="h-4 w-4" />
          </label>

          <button type="button" onClick={downloadResized} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" disabled={!resizedUrl}>
            Download resized image
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Original</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {previewUrl ? <img src={previewUrl} alt="Original upload" className="max-h-80 w-full object-contain" /> : <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">Upload an image to preview it.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Resized result</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {resizedUrl ? <img src={resizedUrl} alt="Resized upload" className="max-h-80 w-full object-contain" /> : <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">Your resized output will appear here.</div>}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default ResizeImagePage;
