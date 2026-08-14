import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { MAX_FILE_BYTES } from '../lib/extract';

interface Props {
  disabled: boolean;
  onFile: (file: File) => void;
}

export function UploadZone({ disabled, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`upload-zone${dragging ? ' dragging' : ''}${disabled ? ' disabled' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
      <p className="upload-title">Or drop your own document here</p>
      <p className="upload-sub">
        Dec page, ACORD form, COI, or loss run — PDF or photo, up to{' '}
        {Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB
      </p>
      <button
        type="button"
        className="btn btn-primary"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        Choose a file
      </button>
      <p className="upload-privacy">Processed in-session · never stored · never used for training</p>
    </div>
  );
}
