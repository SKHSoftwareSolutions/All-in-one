import { useCallback, useState } from 'react';

function ImageDropzone({ onFileSelect, label, accept = 'image/*', helper }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragActive(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${dragActive ? 'border-slate-600 bg-slate-100' : 'border-slate-300 bg-slate-50/70 hover:border-slate-400'}`}
    >
      <input type="file" accept={accept} onChange={(event) => handleFiles(event.target.files)} className="hidden" />
      <div className="text-sm font-medium text-slate-800">{label}</div>
      <div className="mt-2 text-sm text-slate-500">{helper}</div>
    </label>
  );
}

export default ImageDropzone;
