export default function Masthead({ publicationName, section, issueLabel }) {
  return (
    <div className="masthead">
      <strong>{publicationName}</strong>
      <span>{section}</span>
      <span>{issueLabel}</span>
    </div>
  );
}
