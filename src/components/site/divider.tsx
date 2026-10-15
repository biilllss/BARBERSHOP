import { CedarLeaf } from "./cedar-leaf";

/**
 * Quiet editorial divider between sections — hairline rules meeting a
 * small gold cedar. Purely decorative, so it is aria-hidden and never
 * printed.
 */
export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-2 sm:px-8 print:hidden"
    >
      {/* Symmetric composition — fades stay correct in both directions */}
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-cream/15" />
      <CedarLeaf className="size-4 shrink-0 text-gold/60" />
      <span className="h-px flex-1 bg-gradient-to-r from-cream/15 via-cream/15 to-transparent" />
    </div>
  );
}
