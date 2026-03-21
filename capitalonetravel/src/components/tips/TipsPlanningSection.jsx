import { ArrowRight } from "lucide-react";
import { articles } from "../../data/articles";
import ArticleCard from "./ArticleCard";

export default function TipsPlanningSection() {
  return (
    <section className="py-14 px-4 bg-gray-50">
      <div className="max-w-site mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">Tips & Planning</h2>
            <p className="text-gray-500 mt-2 text-sm">Expert advice to help you travel smarter and earn more rewards.</p>
          </div>
          <a href="#" className="flex items-center gap-1 text-brand-coral text-sm font-semibold hover:underline whitespace-nowrap ml-4">
            View all articles <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
