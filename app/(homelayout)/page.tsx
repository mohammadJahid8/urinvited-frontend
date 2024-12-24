import { redirect } from 'next/navigation';

const Home: React.FC = () => {
  return redirect('/video-preview');
};

export default Home;
