import HeroBanner from "./HeroBanner";
import SearchWidget from "../search/SearchWidget";

const HERO_IMAGE = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80";

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[680px] pt-20 pb-24 md:pb-32"
      style={{
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/70 via-brand-blue/50 to-brand-blue/30" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <HeroBanner />
        <SearchWidget />
      </div>
    </section>
  );
}
