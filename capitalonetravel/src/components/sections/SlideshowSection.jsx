import { useState } from "react";
import { premierCollection, lifestyleCollection } from "../../data/collections";

function CollectionPanel({ collection }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col">
      {/* Image carousel */}
      <div className="relative rounded-lg overflow-hidden mb-6">
        <div className="aspect-[4/3] overflow-hidden rounded-b-none rounded-t-lg">
          <img
            src={`${collection.cards[activeIdx].image}?auto=webp&quality=80`}
            alt={collection.cards[activeIdx].alt}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        </div>
        {/* Caption */}
        <div className="bg-[#f7f3eb] px-4 py-2 rounded-b-lg">
          <p className="text-xs text-[#525252]">{collection.cards[activeIdx].caption}</p>
        </div>
        {/* Dot indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {collection.cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIdx ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
        {/* Prev / Next */}
        {collection.cards.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((activeIdx - 1 + collection.cards.length) % collection.cards.length)}
              className="absolute left-3 top-[45%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow"
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIdx((activeIdx + 1) % collection.cards.length)}
              className="absolute right-3 top-[45%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow"
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Logo + text + CTA */}
      <img
        src={collection.logo}
        alt={collection.logoAlt}
        className="h-8 w-auto mb-4 object-contain object-left"
        loading="lazy"
      />
      <h3
        className="text-xl lg:text-2xl text-[#00132b] mb-3"
        style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
      >
        {collection.headline}
      </h3>
      <p className="text-sm text-[#525252] leading-relaxed mb-6 flex-1">{collection.body}</p>
      <a
        href={collection.ctaHref}
        className="inline-flex items-center justify-center border-2 border-[#00132b] text-[#00132b] rounded-md px-6 py-2.5 text-sm self-start transition-colors hover:bg-[#00132b] hover:text-white"
        style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
      >
        {collection.ctaLabel}
      </a>
    </div>
  );
}

export default function SlideshowSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <h2
            className="text-3xl lg:text-4xl text-[#00132b] mb-4"
            style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
          >
            Make every stay extraordinary
          </h2>
          <p className="text-sm text-[#525252] leading-relaxed">
            Venture X, Venture X Business, Venture and Spark Miles cardholders enjoy a suite of premium benefits from our curated hotel and vacation rental collections.
          </p>
        </div>

        {/* Two collection panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <CollectionPanel collection={premierCollection} />
          <CollectionPanel collection={lifestyleCollection} />
        </div>
      </div>
    </section>
  );
}
