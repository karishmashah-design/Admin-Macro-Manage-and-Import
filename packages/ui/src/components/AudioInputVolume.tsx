import React from "react";

export type AudioInputVolumeProps = {
  /** Current audio level, 0–1. Determines how many bars are filled (left to right). */
  level?: number;
  /** Number of bars. Default 10. */
  barCount?: number;
  /** Whether the mic is actively listening. Accent bars when true, all gray when false. */
  active?: boolean;
  /** Show the mic icon to the left of the bars. Default true. */
  showMic?: boolean;
  /** Height of bars in px. Default 20. */
  barHeight?: number;
  /** Width of each bar in px. Default 8. */
  barWidth?: number;
  className?: string;
};

export function AudioInputVolume({
  level = 0,
  barCount = 10,
  active = true,
  showMic = true,
  barHeight = 20,
  barWidth = 8,
  className = "",
}: AudioInputVolumeProps) {
  // How many bars are "filled" based on level
  const filledCount = active ? Math.round(level * barCount) : 0;

  return (
    <div
      className={`inline-flex items-center gap-[8px] ${className}`}
      role="img"
      aria-label={active ? `Microphone level: ${Math.round(level * 100)}%` : "Microphone inactive"}
    >
      {showMic && (
        <span
          className={`material-symbols-rounded shrink-0 transition-colors ${
            active ? "text-[var(--accent,#1132ee)]" : "text-[var(--neutral-400,#999)]"
          }`}
          style={{ fontSize: 18, lineHeight: 1, fontVariationSettings: "'FILL' 1" }}
        >
          mic
        </span>
      )}

      <div className="inline-flex items-center gap-[4px]">
        {Array.from({ length: barCount }, (_, i) => {
          const filled = i < filledCount;
          return (
            <div
              key={i}
              className={`rounded-full transition-colors duration-100 ${
                filled
                  ? "bg-[var(--accent,#1132ee)]"
                  : active
                    ? "bg-[var(--neutral-200,#ccc)]"
                    : "bg-[var(--neutral-300,#b3b3b3)]"
              }`}
              style={{ width: barWidth, height: barHeight }}
            />
          );
        })}
      </div>
    </div>
  );
}
