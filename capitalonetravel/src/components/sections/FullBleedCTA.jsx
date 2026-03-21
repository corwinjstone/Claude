const BASE = "https://images.contentstack.io/v3/assets/blt1788ad84f88b68a8";
const IMAGE_URL = `${BASE}/blt83c4e6345ed69a26/6759ce6de4620630a13eea65/image_(1).webp`;

export default function FullBleedCTA() {
  return (
    <section className="relative overflow-hidden bg-[#00132b]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={`${IMAGE_URL}?auto=webp&quality=80`}
          alt="COMO Castello Del Nero"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#00132b]/50" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto px-6 ph:px-12 py-24 lg:py-32 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        style={{ maxWidth: "1440px" }}
      >
        <div className="max-w-xl">
          <h2
            className="text-4xl lg:text-5xl text-white mb-4 leading-tight"
            style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
          >
            Ready, jet set, go
          </h2>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            Plan an unforgettable trip all in one place—from flights and stays to rental cars, activities and more.
          </p>
          <a
            href="https://travel.capitalone.com/?utm_source=publicsite"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-[#00132b] rounded-md px-8 py-3 text-sm transition-colors hover:bg-[#f7f3eb]"
            style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
          >
            Book travel
          </a>
        </div>
        <p className="text-white/50 text-xs lg:text-sm">COMO Castello Del Nero | Tuscany, Italy</p>
      </div>
    </section>
  );
}
