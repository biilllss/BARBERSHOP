import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  /** Editorial section number, e.g. "01" — rendered in gold serif before the kicker. */
  index?: string;
  align?: "start" | "center";
  id?: string;
  className?: string;
};

/**
 * Shared section intro: small-caps gold kicker (with optional index
 * number), serif headline, optional subtitle, and the hairline gold rule.
 */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  index,
  align = "start",
  id,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "items-start",
        className
      )}
    >
      <p className="kicker">
        <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
        {index && (
          <>
            <span className="font-display text-base font-semibold tracking-normal text-gold">
              {index}
            </span>
            <span aria-hidden="true" className="h-px w-4 bg-gold/40" />
          </>
        )}
        {kicker}
        {centered && <span aria-hidden="true" className="h-px w-8 bg-gold/70" />}
      </p>
      <h2
        id={id}
        className="headline text-3xl leading-[1.15] sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("max-w-xl text-base text-cream-muted", centered && "mx-auto")}>
          {subtitle}
        </p>
      )}
      <span aria-hidden="true" className="gold-rule mt-1" />
    </div>
  );
}
