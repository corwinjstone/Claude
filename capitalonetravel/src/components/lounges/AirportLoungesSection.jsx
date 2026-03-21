import { Check } from "lucide-react";
import { loungeFeatures } from "../../data/lounges";
import Button from "../ui/Button";

const LOUNGE_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80";

export default function AirportLoungesSection() {
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-site mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <span className="inline-block bg-brand-blue/10 text-brand-blue text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Airport Lounges
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-4">
              Relax before you fly
            </h2>
            <p className="text-gray-600 mb-6">
              Access Capital One Lounges and over 1,300 Priority Pass lounges worldwide with your eligible Capital One card.
            </p>

            {/* Stat */}
            <div className="flex gap-8 mb-6">
              <div>
                <div className="text-4xl font-bold text-brand-blue">1,300<span className="text-brand-coral">+</span></div>
                <div className="text-sm text-gray-500">Lounges worldwide</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-brand-blue">6</div>
                <div className="text-sm text-gray-500">Capital One Lounges</div>
              </div>
            </div>

            {/* Features */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {loungeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={15} className="text-brand-coral flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="md">Explore Lounges</Button>
              <Button variant="outline" size="md">Find Near Me</Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
            <img
              src={LOUNGE_IMAGE}
              alt="Capital One Lounge interior"
              loading="lazy"
              className="w-full h-80 lg:h-96 object-cover"
            />
            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-blue/80 to-transparent p-6">
              <p className="text-white font-semibold">Capital One Lounge — Dallas Fort Worth</p>
              <p className="text-white/70 text-sm">Terminal D</p>
            </div>
          </div>
        </div>

        {/* Lounge type cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {[
            {
              title: "Capital One Lounges",
              desc: "Exclusively designed spaces with chef-inspired menus, craft cocktails, relaxation rooms, and premium amenities at select major airports.",
              badge: "Owned & Operated",
              color: "brand-blue",
            },
            {
              title: "Priority Pass Network",
              desc: "Access over 1,300 partner lounges worldwide at no additional cost with your eligible Venture or Spark card.",
              badge: "1,300+ Locations",
              color: "amber-600",
            },
          ].map((card) => (
            <div key={card.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-card transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-bold text-gray-900 text-lg">{card.title}</h3>
                <span className="bg-brand-blue/10 text-brand-blue text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {card.badge}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{card.desc}</p>
              <a href="#" className="inline-block mt-4 text-brand-coral text-sm font-semibold hover:underline">
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
