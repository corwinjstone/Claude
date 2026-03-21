import { loungeCards } from "../../data/lounges";

export default function LoungeCarousel() {
  return (
    <section className="bg-[#00132b] py-16 lg:py-24">
      <div className="mx-auto px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h2
              className="text-3xl lg:text-4xl text-white mb-4"
              style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
            >
              Reimagined airport experiences
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Relax, refuel and recharge in our worldwide network of airport lounges, featuring luxurious spaces with fresh local food and beverages.²
            </p>
          </div>
          <a
            href="/airport-lounges/"
            className="inline-flex items-center justify-center border-2 border-white text-white rounded-md px-6 py-2.5 text-sm transition-colors hover:bg-white hover:text-[#00132b] whitespace-nowrap self-start lg:self-auto"
            style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
          >
            Search our network
          </a>
        </div>

        {/* Horizontal scroll carousel */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {loungeCards.map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[260px] ph:w-[280px] bg-[#013d5b] rounded-lg overflow-hidden"
            >
              <div className="h-[180px] overflow-hidden">
                <img
                  src={`${card.image}?auto=webp&quality=80`}
                  alt={card.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#a6cbd6] mb-1">{card.eyebrow}</p>
                <p
                  className="text-base text-white mb-4"
                  style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                >
                  {card.city}
                </p>
                {card.href ? (
                  <a
                    href={card.href}
                    className="inline-flex items-center justify-center border border-white/40 text-white rounded-md px-4 py-1.5 text-xs transition-colors hover:border-white hover:bg-white/10"
                  >
                    {card.code}
                  </a>
                ) : (
                  <span className="inline-flex items-center border border-white/20 text-white/40 rounded-md px-4 py-1.5 text-xs">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
