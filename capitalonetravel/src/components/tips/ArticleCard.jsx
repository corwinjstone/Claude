import { Clock } from "lucide-react";

export default function ArticleCard({ article }) {
  const { category, title, excerpt, image, readTime, href } = article;

  return (
    <a
      href={href}
      className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="inline-block bg-brand-blue/10 text-brand-blue text-xs font-semibold px-2.5 py-0.5 rounded mb-2">
          {category}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <Clock size={12} />
          {readTime}
        </div>
      </div>
    </a>
  );
}
