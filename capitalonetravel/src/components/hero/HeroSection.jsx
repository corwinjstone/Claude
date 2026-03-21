import HeroBanner from "./HeroBanner";

const BASE = "https://images.contentstack.io/v3/assets/blt1788ad84f88b68a8";

const heroImages = [
  {
    src: `${BASE}/blt8b61ae1412f6b39c/6759cb50197eca75b4cdf5b9/hero-home-4-d.webp`,
    alt: "Chapman's Peak",
  },
  {
    src: `${BASE}/bltf132a963b5fbd8a2/6759cb66cbd7d6867615ab5a/hero-home-2-d.webp`,
    alt: "Aerial view of beach",
  },
  {
    src: `${BASE}/blt81ceaa67aef2c58b/6759cb79f0d6121f5eb06500/hero-home-1-d.webp`,
    alt: "Aerial view coastline and mountains",
  },
  {
    src: `${BASE}/blt1a90cf6bceb76170/68a74e8e7d7514e1e3ab544b/Homepage-hero2-9_9.webp`,
    alt: "Beautiful coastline in Spain",
  },
];

export default function HeroSection() {
  return (
    <section className="bg-[#f7f3eb] overflow-hidden">
      <div className="mx-auto px-6 ph:px-12 pt-10 pb-16" style={{ maxWidth: "1440px" }}>
        <HeroBanner />

        {/* Arched photo collage */}
        <div className="flex items-end justify-center gap-2 ph:gap-3 lg:gap-4 h-[280px] ph:h-[400px] lg:h-[500px] mt-2">
          <div className="w-[22%] max-w-[220px] h-[85%] rounded-t-full overflow-hidden flex-shrink-0">
            <img
              src={`${heroImages[0].src}?width=440&height=600&auto=webp&quality=80`}
              alt={heroImages[0].alt}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>
          <div className="w-[26%] max-w-[260px] h-full rounded-t-full overflow-hidden flex-shrink-0">
            <img
              src={`${heroImages[1].src}?width=520&height=700&auto=webp&quality=80`}
              alt={heroImages[1].alt}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>
          <div className="w-[26%] max-w-[260px] h-[92%] rounded-t-full overflow-hidden flex-shrink-0">
            <img
              src={`${heroImages[2].src}?width=520&height=660&auto=webp&quality=80`}
              alt={heroImages[2].alt}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>
          <div className="w-[22%] max-w-[220px] h-[80%] rounded-t-full overflow-hidden flex-shrink-0">
            <img
              src={`${heroImages[3].src}?width=440&height=560&auto=webp&quality=80`}
              alt={heroImages[3].alt}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
