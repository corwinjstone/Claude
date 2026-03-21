import { ArrowRight } from "lucide-react";
import { premierCollections, lifestyleCollections } from "../../data/collections";
import CollectionCard from "./CollectionCard";

function CollectionSection({ title, subtitle, hotels, badge }) {
  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <a href="#" className="flex items-center gap-1 text-brand-coral text-sm font-semibold hover:underline whitespace-nowrap ml-4">
          View all <ArrowRight size={14} />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotels.map((hotel) => (
          <CollectionCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default function LifestyleCollections() {
  return (
    <section className="py-14 px-4 bg-gray-50">
      <div className="max-w-site mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">Curated Hotel Collections</h2>
          <p className="text-gray-500 mt-2">Handpicked properties with exclusive perks for Capital One cardholders.</p>
        </div>

        <CollectionSection
          title="Premier Collection"
          subtitle="Luxury stays with daily breakfast, experience credit & more"
          hotels={premierCollections}
        />

        <CollectionSection
          title="Lifestyle Collection"
          subtitle="Boutique and independent hotels with unique character"
          hotels={lifestyleCollections}
        />
      </div>
    </section>
  );
}
