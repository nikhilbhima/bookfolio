export function ArenaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Two 6-pointed asterisk stars - Are.na logo */}
      <path d="M7 12L7 5M7 12L7 19M7 12L1.5 8.5M7 12L12.5 8.5M7 12L1.5 15.5M7 12L12.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M17 12L17 5M17 12L17 19M17 12L11.5 8.5M17 12L22.5 8.5M17 12L11.5 15.5M17 12L22.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
