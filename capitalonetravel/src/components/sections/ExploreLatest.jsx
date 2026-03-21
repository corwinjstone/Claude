import { exploreLatestCards } from "../../data/articles";

export default function ExploreLatest() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
        <h2
          className="text-3xl lg:text-4xl text-center text-[#00132b] mb-12"
          style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
        >
          Explore the latest
        </h2>

        <div className="grid grid-cols-1 ph:grid-cols-3 gap-6 lg:gap-8">
          {exploreLatestCards.map((card, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-5">
                <img
                  src={`${card.image}?auto=webp&quality=80`}
                  alt={card.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-1">
                <h3
                  className="text-lg lg:text-xl text-[#00132b] mb-3 leading-snug"
                  style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                >
                  {card.heading}
                </h3>
                <p className="text-sm text-[#525252] leading-relaxed flex-1 mb-5">
                  {card.body}
                </p>
                <a
                  href={card.href}
                  className="inline-flex items-center justify-center border-2 border-[#00132b] text-[#00132b] rounded-md px-6 py-2 text-sm self-start transition-colors hover:bg-[#00132b] hover:text-white"
                  style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                >
                  {card.ctaLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
