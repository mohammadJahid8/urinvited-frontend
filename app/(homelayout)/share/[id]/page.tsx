import Share from '@/components/global/share';
import React from 'react';

const SharePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className=''>
      <Share id={params.id} />
    </div>
  );
};

export default SharePage;
