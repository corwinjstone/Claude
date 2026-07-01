export default function Folio({ pageNumber, totalPages, section, publicationName }) {
  const num = String(pageNumber).padStart(3, '0');
  return (
    <footer className="folio">
      <span>{publicationName}</span>
      <span>{section}</span>
      <span>
        {num} / {String(totalPages).padStart(3, '0')}
      </span>
    </footer>
  );
}
