import { Star } from "lucide-react";
import CollectionBadge from "./CollectionBadge";

export default function CollectionCard({ hotel }) {
  const { name, location, image, rating, reviews, pricePerNight, collection } = hotel;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <CollectionBadge type={collection} />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{name}</h3>
        <p className="text-gray-500 text-xs mb-2">{location}</p>

        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{rating}</span>
            <span className="text-xs text-gray-400">({reviews})</span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-brand-blue font-bold text-sm">${pricePerNight}</span>
            <span className="text-gray-400 text-xs">/night</span>
          </div>
        </div>
      </div>
    </div>
  );
}
