import { ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

function sentimentBadge(headline) {
  // Simple heuristic sentiment based on keywords
  const h = headline?.toLowerCase() ?? '';
  const bullish = ['beats', 'surge', 'soar', 'rally', 'gain', 'profit', 'record', 'growth', 'positive', 'upgrade'];
  const bearish = ['miss', 'drop', 'fall', 'plunge', 'loss', 'decline', 'cut', 'warning', 'downgrade', 'recall'];
  if (bullish.some((w) => h.includes(w))) return { label: 'Bullish', variant: 'positive' };
  if (bearish.some((w) => h.includes(w))) return { label: 'Bearish', variant: 'negative' };
  return { label: 'Neutral', variant: 'neutral' };
}

export function NewsCard({ article }) {
  const { label, variant } = sentimentBadge(article.headline);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={variant}>{label}</Badge>
            <span className="text-xs text-gray-500">{article.source}</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500">{formatRelativeTime(article.datetime)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
            {article.headline}
          </h3>
          {article.summary && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{article.summary}</p>
          )}
        </div>
        <ExternalLink size={14} className="text-gray-600 shrink-0 mt-0.5 group-hover:text-gray-400 transition-colors" />
      </div>
    </a>
  );
}
