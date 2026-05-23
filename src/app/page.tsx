import HomeClient from './HomeClient';
import { publicSeo } from '@/lib/seo';

export const metadata = publicSeo.home;

export default function HomePage() {
  return <HomeClient />;
}
