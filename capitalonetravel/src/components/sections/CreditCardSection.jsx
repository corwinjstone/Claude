const BASE = "https://images.contentstack.io/v3/assets/blt1788ad84f88b68a8";

const cards = [
  {
    name: "Venture X",
    cardImage: `${BASE}/blt9565fbedd360d524/69b56cc531eed4766ea79f83/Venture-X-Gen-Flat-Standard.webp`,
    cardImageAlt: "Venture X Card",
    limitedTimeOffer: false,
    benefits: [
      {
        headline: "Get a $300 travel credit",
        body: "Receive an annual credit for bookings through Capital One Travel, where you'll get our best prices on thousands of options.⁵",
      },
      {
        headline: "Enjoy elevated rewards",
        body: "Get a $100 experience credit and other premium benefits with every hotel and vacation rental booked from the Premier Collection.³",
      },
      {
        headline: "Maximize your miles",
        body: "Earn unlimited 5X miles on flights and vacation rentals and 10X on hotels and cars booked through Capital One Travel.",
      },
    ],
    ctaPrimary: {
      label: "Learn more",
      href: "https://www.capitalone.com/credit-cards/venture-x/?external_id=WWW_SITE_TRAVEL_UM_ACQUISITION_VX_HP2_CTA_1_Z_Z_",
    },
    ctaSecondary: {
      label: "View all cards",
      href: "https://www.capitalone.com/credit-cards/travel-and-miles/?external_id=WWW_SITE_COT_PPX_PAGE_TM___1120_Z_Z_",
    },
  },
  {
    name: "Venture X Business",
    cardImage: `${BASE}/bltc417ae013e0afa2a/68476b3b24f13b15b7d59827/dapp-Venture-X-Bus-MC-WE-480x302.png`,
    cardImageAlt: "Venture X Business Card",
    limitedTimeOffer: false,
    benefits: [
      {
        headline: "Get a $300 travel credit",
        body: "Receive an annual credit for bookings through Capital One Business Travel, where you'll get our best prices on thousands of options.⁵",
      },
      {
        headline: "Premium perks for your business",
        body: "Complimentary airport lounge access, plus luxury travel benefits on every Premier and Lifestyle Collection booking.",
      },
      {
        headline: "Earn 150,000 bonus miles",
        body: "Enjoy more miles once you spend $30,000 within the first 3 months from account opening.",
      },
    ],
    ctaPrimary: {
      label: "Learn more",
      href: "https://www.capitalone.com/small-business/credit-cards/venture-x-business/?external_id=WWW_SITE_TRAVEL_UM_ACQUISITION_VENTURE_HP4_CTA_2_Z_Z_",
    },
    ctaSecondary: {
      label: "View all cards",
      href: "https://www.capitalone.com/small-business/credit-cards/",
    },
  },
  {
    name: "Venture",
    cardImage: `${BASE}/blt56be5d8e8d9fb954/67b4c3df9e98d96581be9fc1/venture_cardart-ribbon-lto-large.webp`,
    cardImageAlt: "Venture Card",
    limitedTimeOffer: true,
    benefits: [
      {
        headline: "Limited-Time Offer",
        body: "Enjoy a one-time $250 Capital One Travel credit, plus earn 75,000 bonus miles once you spend $4,000 on purchases within the first 3 months.⁶",
      },
      {
        headline: "Maximize your miles",
        body: "Earn 2X miles on every purchase, every day, plus 5X on hotels, vacation rentals and rental cars booked through Capital One Travel.",
      },
      {
        headline: "Elevate your stay",
        body: "Enjoy a $50 experience credit and other premium benefits with every hotel and vacation rental booked from the Lifestyle Collection.",
      },
    ],
    ctaPrimary: {
      label: "Learn More",
      href: "https://www.capitalone.com/credit-cards/venture/?external_id=WWW_SITE_TRAVEL_UM_ACQUISITION_VENTURE_HP2_CTA_2_Z_Z_",
    },
    ctaSecondary: {
      label: "View all cards",
      href: "https://www.capitalone.com/credit-cards/compare/",
    },
  },
];

export default function CreditCardSection() {
  return (
    <section className="bg-[#d6e8ea] py-16 lg:py-24">
      <div className="mx-auto px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
        <h2
          className="text-3xl lg:text-4xl text-[#00132b] mb-12 text-center"
          style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
        >
          Travel cards designed to take you further
        </h2>

        <div className="grid grid-cols-1 ph:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-white rounded-xl p-6 flex flex-col relative"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
            >
              {card.limitedTimeOffer && (
                <div className="absolute top-4 right-4 bg-[#bf5347] text-white text-xs px-2 py-0.5 rounded-full"
                  style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                >
                  Limited-Time Offer
                </div>
              )}
              <img
                src={`${card.cardImage}?auto=webp&quality=80`}
                alt={card.cardImageAlt}
                className="w-full max-w-[200px] mx-auto mb-6 object-contain"
                loading="lazy"
              />
              <h3
                className="text-xl text-[#00132b] mb-5 text-center"
                style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
              >
                {card.name}
              </h3>
              <ul className="space-y-4 mb-8 flex-1">
                {card.benefits.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-[#013d5b] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span
                        className="text-sm text-[#00132b]"
                        style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                      >
                        {b.headline}
                      </span>
                      <p className="text-xs text-[#525252] leading-relaxed mt-0.5">{b.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <a
                  href={card.ctaPrimary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center border-2 border-[#00132b] text-[#00132b] rounded-md py-2.5 text-sm transition-colors hover:bg-[#00132b] hover:text-white"
                  style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                >
                  {card.ctaPrimary.label}
                </a>
                <a
                  href={card.ctaSecondary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center text-[#00132b] py-2 text-sm underline hover:text-[#013d5b]"
                >
                  {card.ctaSecondary.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
