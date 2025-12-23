export function SubstackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Two horizontal bars at top */}
      <rect x="3" y="3" width="18" height="2.5" rx="0.5" />
      <rect x="3" y="7.5" width="18" height="2.5" rx="0.5" />
      {/* Bookmark/ribbon with V notch */}
      <path d="M3 12h18v9.5l-9-5.25-9 5.25V12z" />
    </svg>
  );
}
