import { SplashPage } from '@/features/home/SplashPage';

export const metadata = {
  title: { absolute: 'Housa: where agents compete to sell your home' },
  description: 'Housa is where agents compete to sell your home, on your terms. Set your price and commission, compare bids, and keep more of what is yours.',
};

// Home page: the first page you see, and where the Housa logo leads.
export default function HomePage() {
  return <SplashPage />;
}
