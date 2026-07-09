import { useState } from 'react';
import Cropper from 'react-easy-crop';
import ImageDropzone from '../../components/ImageDropzone';
import ToolPageTemplate from '../../components/ToolPageTemplate';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function CropImagePage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [croppedUrl, setCroppedUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [message, setMessage] = useState('');
  const [originalSize, setOriginalSize] = useState(0);

  const isLarge = originalSize > MAX_SIZE_BYTES;

  function handleFileSelect(selectedFile) {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setMessage(selectedFile.size > MAX_SIZE_BYTES ? 'Large files may take longer to process locally.' : '');
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setCroppedUrl('');
  }

  async function handleCropComplete(_, croppedAreaPixelsValue) {
    setCroppedAreaPixels(croppedAreaPixelsValue);
  }

  function createCroppedImage() {
    if (!previewUrl || !croppedAreaPixels) return;
    const image = new Image();
    image.src = previewUrl;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);
      canvas.toBlob((blob) => {
        if (blob) setCroppedUrl(URL.createObjectURL(blob));
      }, file?.type || 'image/png');
    };
  }

  function downloadCropped() {
    if (!croppedUrl) return;
    const link = document.createElement('a');
    link.download = `cropped-${file?.name || 'image'}`;
    link.href = croppedUrl;
    link.click();
  }

  return (
    <ToolPageTemplate title="Crop Image" description="Upload an image, adjust the crop area, and download the cropped result entirely in your browser." metaDescription="Crop a photo or screenshot locally in the browser and download the edited image." usageSteps={['Upload the image you want to trim.', 'Drag the crop box until the important area is framed the way you want.', 'Apply the crop and download the new image when the preview looks right.']} faqItems={[{question:'Is the crop permanent?',answer:'The crop only applies to the exported file; the original upload remains unchanged on your device.'},{question:'Can I zoom in while cropping?',answer:'Yes. The zoom slider helps you position the crop precisely on detailed images.'}]}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <ImageDropzone onFileSelect={handleFileSelect} label="Drop an image here or click to browse" helper="PNG, JPG, or WebP files are supported." accept="image/png,image/jpeg,image/webp" />
          {isLarge ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">Large files above 10MB may take a little longer to process locally.</p> : null}
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Zoom</span>
            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-full" />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={createCroppedImage} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Apply crop
            </button>
            <button type="button" onClick={downloadCropped} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" disabled={!croppedUrl}>
              Download cropped image
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Crop preview</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {previewUrl ? (
                <div className="relative h-[320px] w-full">
                  <Cropper image={previewUrl} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={handleCropComplete} />
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center text-sm text-slate-500">Upload an image to begin cropping.</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-800">Cropped result</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {croppedUrl ? <img src={croppedUrl} alt="Cropped upload" className="max-h-80 w-full object-contain" /> : <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">Your cropped image will appear here.</div>}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default CropImagePage;
