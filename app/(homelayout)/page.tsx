'use client';

import { useAppContext } from '@/lib/context';
import { redirect } from 'next/navigation';

const Home: React.FC = () => {
  const { user } = useAppContext();

  if (user?.role === 'admin') {
    return redirect('/manage-events');
  }

  if (user?.role === 'user') {
    return redirect('/events');
  }

  return redirect('/login');
};

export default Home;
