import { Gift, ShoppingBag, ShieldCheck } from "lucide-react";

const DESERT_IMAGE =
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80";

const FONTS = [
  {
    name: "Plus Jakarta Sans",
    family: "'Plus Jakarta Sans', sans-serif",
    tag: "Closest match — geometric humanist",
  },
  {
    name: "DM Sans",
    family: "'DM Sans', sans-serif",
    tag: "Runner-up — slightly more neutral",
  },
  {
    name: "Inter",
    family: "'Inter', sans-serif",
    tag: "Runner-up — highly legible, neutral",
  },
  {
    name: "Outfit",
    family: "'Outfit', sans-serif",
    tag: "Runner-up — more geometric",
  },
];

const features = [
  {
    icon: Gift,
    title: "Earn more rewards",
    body: "Access new ways to earn and spend rewards with an eligible Capital One or Discover by Capital One credit card.",
  },
  {
    icon: ShoppingBag,
    title: "Shop and save with confidence",
    body: "We track prices and predict the best time to book to help save an average of 15%.¹",
  },
  {
    icon: ShieldCheck,
    title: "Book with free price drop protection",
    body: "If you book your flight when we recommend and the price drops, you'll get up to a $50 travel credit.¹",
  },
];

function TravelCard({ font }) {
  return (
    <div
      className="w-full"
      style={{ fontFamily: font.family }}
    >
      {/* Font label */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <span className="text-lg font-semibold text-gray-800" style={{ fontFamily: font.family }}>
          {font.name}
        </span>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
          {font.tag}
        </span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{ backgroundColor: "#c8dde5" }}
      >
        {/* Tab nav */}
        <div className="flex justify-center gap-2 pt-5 pb-4 px-6">
          <button
            className="px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#1a2332", fontFamily: font.family }}
          >
            Capital One Travel
          </button>
          <button
            className="px-5 py-2 rounded-full text-sm font-semibold text-gray-800 bg-white/70 border border-gray-300"
            style={{ fontFamily: font.family }}
          >
            Capital One Business Travel
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Left: features */}
          <div className="flex-1 px-8 py-6 flex flex-col justify-center gap-6">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="mt-0.5 shrink-0">
                  <Icon size={32} strokeWidth={1.5} color="#c0392b" />
                </div>
                <div>
                  <p
                    className="font-bold text-gray-900 mb-1"
                    style={{ fontSize: "1rem", fontFamily: font.family }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-gray-700 leading-relaxed"
                    style={{ fontSize: "0.875rem", fontFamily: font.family }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="mt-2">
              <button
                className="px-6 py-3 border-2 border-gray-900 rounded-lg font-bold text-gray-900 text-sm bg-transparent hover:bg-gray-900 hover:text-white transition-colors"
                style={{ fontFamily: font.family }}
              >
                View access &amp; benefits
              </button>
            </div>
          </div>

          {/* Right: image */}
          <div className="w-full md:w-[45%] min-h-[280px] md:min-h-0 shrink-0">
            <img
              src={DESERT_IMAGE}
              alt="Desert landscape"
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FontShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Optimist Font — Public Alternatives
          </h1>
          <p className="text-gray-500 text-sm">
            4 versions of the Capital One Travel card, each rendered in a different publicly available font.
          </p>
        </div>

        {/* 4 versions stacked */}
        <div className="flex flex-col gap-12">
          {FONTS.map((font) => (
            <TravelCard key={font.name} font={font} />
          ))}
        </div>
      </div>
    </div>
  );
}
