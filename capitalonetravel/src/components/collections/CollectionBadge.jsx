import clsx from "clsx";

export default function CollectionBadge({ type }) {
  const styles = {
    premier: "bg-brand-blue text-white",
    lifestyle: "bg-amber-600 text-white",
  };

  const labels = {
    premier: "Premier Collection",
    lifestyle: "Lifestyle Collection",
  };

  return (
    <span className={clsx("absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full", styles[type])}>
      {labels[type]}
    </span>
  );
}
