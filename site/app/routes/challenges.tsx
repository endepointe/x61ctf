import React, { useEffect } from "react";

type ChallengeProps = {
  /** Provide content per box. If omitted, placeholders render. */
  items?: React.ReactNode[];
  /** How many boxes to render when items is not provided. */
  count?: number;
  /** Extra classes for the grid container (e.g., margins). */
  className?: string;
  /** Tailwind gap utility (defaults to gap-4). */
  gapClass?: string;
};

const Challenges: React.FC<ChallengeProps> = ({
  items,
  count = 12,
  className = "",
  gapClass = "gap-4",
}) => {

  useEffect(() => { 
    (async () => {
      try {
        const res = await fetch("/api/challenges");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(data);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        return;
      }
    })();
  }, []);

  const cells = items ?? Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="pointer-events-none text-xs text-neutral-400 select-none"
    >
      {`Box ${i + 1}`}
    </div>
  ));

  return (
    <div
      className={[
        // Grid with fixed column width of 300px; rows are 250px high.
        "grid",
        "[grid-template-columns:repeat(auto-fill,300px)]",
        "[grid-auto-rows:250px]",
        // Nice default spacing and alignment
        gapClass,
        "justify-center", // centers the grid if there’s leftover space
        className,
      ].join(" ")}
    >
      {cells.map((content, i) => (
        <div
          key={i}
          className={[
            // Fixed-size boxes (belt-and-suspenders in case template changes)
            "w-[300px] h-[250px]",
            // Styling — tweak to match your design system
            "rounded-xl border border-neutral-700 bg-neutral-800/60",
            "shadow-sm hover:shadow transition-shadow",
            "p-4 flex items-center justify-center text-neutral-100",
          ].join(" ")}
        >
          {content}
        </div>
      ))}
    </div>
  );
};

export default Challenges;

