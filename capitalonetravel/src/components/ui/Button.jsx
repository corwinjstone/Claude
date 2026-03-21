import clsx from "clsx";

export default function Button({ variant = "primary", size = "md", children, onClick, type = "button", disabled, className }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand-coral text-white hover:bg-brand-coral-dark focus-visible:ring-brand-coral",
    secondary: "bg-brand-blue text-white hover:bg-brand-blue-dark focus-visible:ring-brand-blue",
    ghost: "border border-white text-white hover:bg-white/10 focus-visible:ring-white",
    outline: "border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white focus-visible:ring-brand-blue",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}
