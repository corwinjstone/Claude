import HeroSection from "../components/hero/HeroSection";
import ExploreLatest from "../components/sections/ExploreLatest";
import TabsSection from "../components/sections/TabsSection";
import LoungeCarousel from "../components/sections/LoungeCarousel";
import SlideshowSection from "../components/sections/SlideshowSection";
import CreditCardSection from "../components/sections/CreditCardSection";
import FeaturedArticles from "../components/sections/FeaturedArticles";
import FullBleedCTA from "../components/sections/FullBleedCTA";
import FAQSection from "../components/sections/FAQSection";
import Footnotes from "../components/sections/Footnotes";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExploreLatest />
      <TabsSection />
      <LoungeCarousel />
      <SlideshowSection />
      <CreditCardSection />
      <FeaturedArticles />
      <FullBleedCTA />
      <FAQSection />
      <Footnotes />
    </>
  );
}
