import { LoaderCircle } from 'lucide-react';

function LoadingOverlay() {
  return (
    <>
      <div className='fixed inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center z-50'>
        <LoaderCircle className='text-white animate-spin' size={40} />
      </div>
    </>
  );
}

export default LoadingOverlay;
