import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link className='shrink-0' href='/'>
      <img src='/urinvited-logo.png' alt='logo' className='w-full h-10' />
    </Link>
  );
};

export default Logo;
