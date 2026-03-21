import clsx from "clsx";

const config = {
  "Pending Stips": { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  "Ready to Fund": { bg: "bg-green-100", text: "text-[#7a9a01]", dot: "bg-[#7a9a01]" },
  Returned:        { bg: "bg-red-100",   text: "text-[#bf5347]", dot: "bg-[#bf5347]" },
};

export default function StatusBadge({ status, size = "md" }) {
  const c = config[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        c.bg, c.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
      style={{ fontFamily: '"Optimist", sans-serif' }}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />
      {status}
    </span>
  );
}
