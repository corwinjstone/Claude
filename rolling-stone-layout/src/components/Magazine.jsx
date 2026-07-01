import Masthead from './Masthead.jsx';
import Folio from './Folio.jsx';
import CoverPage from './pages/CoverPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import QuoteSpread from './pages/QuoteSpread.jsx';
import ChartPage from './pages/ChartPage.jsx';
import CountdownPage from './pages/CountdownPage.jsx';
import EndPage from './pages/EndPage.jsx';

const PAGE_CLASS = {
  cover: 'cover-page',
  article: 'article-page',
  'quote-spread': 'quote-page',
  chart: 'chart-page',
  countdown: 'countdown-page',
  end: 'end-page',
};

const PAGE_COMPONENT = {
  cover: CoverPage,
  article: ArticlePage,
  'quote-spread': QuoteSpread,
  chart: ChartPage,
  countdown: CountdownPage,
  end: EndPage,
};

export default function Magazine({ pages, publicationName, issueLabel }) {
  return (
    <div className="magazine" id="magazine-print-root">
      {pages.map((page) => {
        const Component = PAGE_COMPONENT[page.type];
        return (
          <article className={`page ${PAGE_CLASS[page.type]}`} key={page.id}>
            <Masthead publicationName={publicationName} section={page.section} issueLabel={issueLabel} />
            <Component page={page} />
            <Folio
              pageNumber={page.pageNumber}
              totalPages={pages.length}
              section={page.section}
              publicationName={publicationName}
            />
          </article>
        );
      })}
    </div>
  );
}
