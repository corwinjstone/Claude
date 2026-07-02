function Block({ block, dropCapOnThis }) {
  if (block.type === 'h2') {
    return <h2 className="article-heading">{block.text}</h2>;
  }
  if (block.type === 'list') {
    return (
      <ul className="article-list">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'dialogue') {
    return (
      <>
        {block.lines.map((line, i) => (
          <div className="dialogue-block" key={i}>
            <span className="dialogue-speaker">{line.speaker}</span>
            <p className="dialogue-text">{line.text}</p>
          </div>
        ))}
      </>
    );
  }
  return <p className={dropCapOnThis ? 'has-dropcap' : ''}>{block.text}</p>;
}

export default function ArticlePage({ page }) {
  const heading = page.blocks[0]?.type === 'h2' ? page.blocks[0] : null;
  const rest = heading ? page.blocks.slice(1) : page.blocks;
  let dropCapAssigned = false;

  // Roughly midway through the flowing text, drop in the inline pull quote
  // so it interrupts the columns the way a real inset would.
  const midpoint = Math.floor(rest.length / 2);

  return (
    <div className="page__body">
      {heading && <h2 className="article-heading">{heading.text}</h2>}
      <div className="article-columns">
        {rest.map((block, i) => {
          const isFirstParagraph = !dropCapAssigned && block.type === 'p';
          if (isFirstParagraph) dropCapAssigned = true;
          return (
            <div key={i}>
              <Block
                block={block}
                dropCapOnThis={page.dropCap && isFirstParagraph}
              />
              {page.inlineQuote && i === midpoint && (
                <blockquote className="inline-quote">
                  “{page.inlineQuote.text.replace(/^["“]|["”]$/g, '')}”
                </blockquote>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
