'use client'

import { useState } from 'react';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/kibo-ui/dropzone';

export default function Home() {
  const [files, setFiles] = useState<File[] | undefined>();

  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };
  
  return (
    <div>
      <div className="flex h-screen w-full items-center justify-center bg-secondary p-8">
      <Dropzone
        onDrop={handleDrop}
        src={files}
        multiple
        maxFiles={Infinity}
        onError={console.error}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
      </div>
  );
}
