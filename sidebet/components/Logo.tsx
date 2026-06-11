export function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="SideBet"
    >
      {/* hexagon */}
      <polygon
        points="32,4 60,18 60,46 32,60 4,46 4,18"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* inner SB-style mark */}
      <path
        d="M22 22 L28 22 L28 32 L36 32 L36 22 L42 22 L42 42 L36 42 L36 38 L28 38 L28 42 L22 42 Z"
        fill="currentColor"
      />
    </svg>
  );
}
