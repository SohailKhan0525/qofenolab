export function QofenoMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.75" />
      <circle
        cx="16"
        cy="16"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="32 14"
      />
      <path
        d="M20.5 20.5L27.5 27.5"
        stroke="#E3FF3C"
        strokeWidth="2.4"
        strokeLinecap="square"
      />
      <circle cx="16" cy="16" r="2.2" fill="#E3FF3C" />
    </svg>
  );
}
