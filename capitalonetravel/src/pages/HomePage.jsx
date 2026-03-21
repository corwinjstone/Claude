import HeroSection from "../components/hero/HeroSection";
import LifestyleCollections from "../components/collections/LifestyleCollections";
import AirportLoungesSection from "../components/lounges/AirportLoungesSection";
import TipsPlanningSection from "../components/tips/TipsPlanningSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LifestyleCollections />
      <AirportLoungesSection />
      <TipsPlanningSection />
    </>
  );
}
