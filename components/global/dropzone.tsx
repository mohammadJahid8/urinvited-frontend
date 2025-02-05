import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

function Dropzone({
  onChange,
  className,
  setPreview,
  loading,
  fileInfo,
  setFileInfo,
  type,
  ...props
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (e: any) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files[0]);
    }
  };

  //BUG: issue with this if statements
  const handleFiles = (file: any) => {
    if (!file?.type?.startsWith(`${type}/`)) {
      setError(`Invalid file type. Expected: ${file} file`);
      return;
    }

    const fileSizeInKB = Math.round(file.size / 1024);

    setPreview(URL.createObjectURL(file));
    onChange(file);

    setFileInfo(`Uploaded file: ${file.name} (${fileSizeInKB} KB)`);
    setError(null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
      {...props}
    >
      <CardContent
        className='flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div
          className={`flex items-center justify-center text-muted-foreground ${
            loading && 'pointer-events-none'
          }`}
        >
          {type === 'image' ? (
            <ImageIcon className='mr-2' />
          ) : (
            <VideoIcon className='mr-2' />
          )}

          <span className='font-medium'>Drag File to Upload or</span>
          <Button
            type='button'
            disabled={loading}
            variant='ghost'
            size='sm'
            className='ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs'
            // onClick={handleButtonClick}
          >
            Click Here
          </Button>
          <input
            disabled={loading}
            ref={fileInputRef}
            type='file'
            accept={`${type}/*`}
            onChange={handleFileInputChange}
            className='hidden'
            tabIndex={-1}
          />
        </div>
        {fileInfo && <p className='text-muted-foreground'>{fileInfo}</p>}
        {error && <span className='text-red-500'>{error}</span>}
      </CardContent>
    </Card>
  );
}
export default Dropzone;
