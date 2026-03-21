import clsx from "clsx";

export default function Badge({ label, variant = "blue" }) {
  const variants = {
    blue: "bg-brand-blue/10 text-brand-blue",
    coral: "bg-brand-coral/10 text-brand-coral",
    gray: "bg-gray-100 text-gray-600",
    white: "bg-white/20 text-white",
  };

  return (
    <span className={clsx("inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full", variants[variant])}>
      {label}
    </span>
  );
}
