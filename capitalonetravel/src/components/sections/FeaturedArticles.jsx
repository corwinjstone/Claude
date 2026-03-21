import { featuredArticles } from "../../data/articles";

export default function FeaturedArticles() {
  return (
    <section className="bg-[#f7f3eb] py-16 lg:py-24">
      <div className="mx-auto px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
        <h2
          className="text-3xl lg:text-4xl text-center text-[#00132b] mb-12"
          style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
        >
          Featured articles
        </h2>

        <div className="grid grid-cols-1 ph:grid-cols-3 gap-6 lg:gap-8">
          {featuredArticles.map((article, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-5">
                <img
                  src={`${article.image}?auto=webp&quality=80`}
                  alt={article.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs border border-[#00132b] text-[#00132b] rounded-full px-3 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  className="text-lg lg:text-xl text-[#00132b] mb-3 leading-snug"
                  style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                >
                  {article.heading}
                </h3>
                <p className="text-sm text-[#525252] leading-relaxed flex-1 mb-5">
                  {article.body}
                </p>
                <a
                  href={article.href}
                  className="inline-flex items-center justify-center border-2 border-[#00132b] text-[#00132b] rounded-md px-6 py-2 text-sm self-start transition-colors hover:bg-[#00132b] hover:text-white"
                  style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                >
                  {article.ctaLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
