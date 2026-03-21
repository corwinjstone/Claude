import { useState } from "react";

const BASE = "https://images.contentstack.io/v3/assets/blt1788ad84f88b68a8";

const tabs = [
  {
    label: "Capital One Travel",
    items: [
      {
        icon: `${BASE}/blta396e6177f89ecba/67d98f2edb833bd60a553cfb/grv-rewards.svg`,
        title: "Earn more rewards",
        body: "Access new ways to earn and spend rewards with an eligible Capital One or Discover by Capital One credit card.",
      },
      {
        icon: `${BASE}/blt7e196a63a7bf2558/67d98f2efa2ac2573035ff62/grv-shopping-bag.svg`,
        title: "Shop and save with confidence",
        body: "We track prices and predict the best time to book to help save an average of 15%.¹",
      },
      {
        icon: `${BASE}/blt2c8c64b13e33aa2b/67d98f2e0c5905430ffd0a04/grv-shopping-bag-1.svg`,
        title: "Book with free price drop protection",
        body: "If you book your flight when we recommend and the price drops, you'll get up to a $50 travel credit.¹",
      },
    ],
    cta: { label: "View access & benefits", href: "/consumer-travel-benefits" },
    image: `${BASE}/bltadd6ee2b68e8588c/67eacb2f23211a6df27fe3fa/Compare-COT.jpg`,
    imageAlt: "City skyline with bridge in foreground",
  },
  {
    label: "Capital One Business Travel",
    items: [
      {
        icon: `${BASE}/blta396e6177f89ecba/67d98f2edb833bd60a553cfb/grv-rewards.svg`,
        title: "Earn more rewards",
        body: "Get rewarded when you book business travel, and use your rewards later for work or leisure.",
      },
      {
        icon: `${BASE}/blt7e196a63a7bf2558/67d98f2efa2ac2573035ff62/grv-shopping-bag.svg`,
        title: "Stay in style",
        body: "Get exclusive hotel discounts, including 10% off select hotel brands' best available rates.",
      },
      {
        icon: `${BASE}/blt2c8c64b13e33aa2b/67d98f2e0c5905430ffd0a04/grv-shopping-bag-1.svg`,
        title: "Book with confidence",
        body: "Our live agents are waiting for your call 24/7, so that when the unexpected happens, you're taken care of right away.",
      },
    ],
    cta: { label: "View access & benefits", href: "/business-travel" },
    image: `${BASE}/blta3e3746c2b605404/67d98e1818b08467f8aaffae/COBT_Compare_Business.webp`,
    imageAlt: "City skyline with bridge in foreground",
  },
];

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = tabs[activeTab];

  return (
    <section className="bg-[#d6e8ea] py-16 lg:py-24">
      <div className="mx-auto px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
        <h2
          className="text-3xl lg:text-4xl text-[#00132b] mb-10 text-center lg:text-left"
          style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
        >
          Book for business or leisure
        </h2>

        {/* Tab buttons */}
        <div className="flex gap-0 border-b-2 border-[#00132b] mb-10 w-fit">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-3 text-sm transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "bg-[#00132b] text-white"
                  : "bg-white text-[#00132b] hover:bg-[#00132b]/10"
              }`}
              style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: items + CTA */}
          <div>
            <ul className="space-y-8 mb-10">
              {tab.items.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <img
                    src={item.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="flex-shrink-0 mt-1"
                    loading="lazy"
                  />
                  <div>
                    <h3
                      className="text-base text-[#00132b] mb-1"
                      style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#525252] leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={tab.cta.href}
              className="inline-flex items-center justify-center border-2 border-[#00132b] text-[#00132b] rounded-md px-6 py-2.5 text-sm transition-colors hover:bg-[#00132b] hover:text-white"
              style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
            >
              {tab.cta.label}
            </a>
          </div>

          {/* Right: image */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={`${tab.image}?auto=webp&quality=80`}
              alt={tab.imageAlt}
              className="w-full h-[320px] lg:h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
