import { Hero } from '@/components/hero';
import { Stats } from '@/components/stats';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { Categories } from '@/components/categories';
import { FeaturedEvents } from '@/components/featured-events';
import { TopVolunteers } from '@/components/top-volunteers';
import { AssociationsShowcase } from '@/components/associations-showcase';
import { Testimonials } from '@/components/testimonials';
import { CTASection } from '@/components/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Categories />
      <FeaturedEvents />
      <TopVolunteers />
      <AssociationsShowcase />
      <Testimonials />
      <CTASection />
    </>
  );
}
