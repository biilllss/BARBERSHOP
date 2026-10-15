/**
 * The Blade & Cedar signature: a stylised cedar of Lebanon silhouette.
 * Pure decoration — always aria-hidden, inherits currentColor.
 */
export function CedarLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Layered canopy tiers + trunk */}
      <path d="M12 1.5 16.2 7.5 H7.8 Z" />
      <path d="M12 5.5 18.4 13.5 H5.6 Z" />
      <path d="M12 10.5 20.8 19.5 H3.2 Z" />
      <path d="M10.7 19.5 h2.6 V23 h-2.6 Z" />
    </svg>
  );
}
