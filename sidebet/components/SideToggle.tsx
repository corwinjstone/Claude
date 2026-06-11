"use client";

export function SideToggle({
  value,
  onChange,
  disabled,
}: {
  value: "a" | "b";
  onChange: (v: "a" | "b") => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value === "a"}
      disabled={disabled}
      onClick={() => onChange(value === "a" ? "b" : "a")}
      className="relative w-20 h-9 bg-white/10 border border-white/20 rounded-full transition"
    >
      <span
        className={`absolute top-1 w-7 h-7 rounded-full bg-accent transition-all ${
          value === "a" ? "left-1" : "left-12"
        }`}
      />
    </button>
  );
}
