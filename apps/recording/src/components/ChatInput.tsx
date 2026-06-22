import React from "react";
import { Icon, IconButton } from "@ds/ui";

// Shared "Ask assistant" chat input. Mic + send are tertiary (brand-colored)
// icon buttons with filled glyphs. Optionally controlled (value/onChange) and
// focus-tracked (for the mobile keyboard behaviour).
export function ChatInput({
  value,
  onChange,
  onFocus,
  onBlur,
  inputRef,
}: {
  value?: string;
  onChange?: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="flex min-h-[48px] w-full items-center gap-[4px] rounded-[6px] border border-[#8044ff] px-[12px] py-[8px]">
      <input
        ref={inputRef}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Ask assistant"
        className="min-w-px flex-1 bg-transparent font-['Lato'] text-[15px] leading-[1.4] tracking-[0.15px] text-[var(--foreground-primary,#1a1a1a)] placeholder:text-[#808080] focus:outline-none"
      />
      <IconButton
        variant="tertiary"
        size="medium"
        aria-label="Voice input"
        icon={<Icon name="mic" size={20} filled />}
      />
      <IconButton
        variant="tertiary"
        size="medium"
        aria-label="Send"
        icon={<Icon name="send" size={20} filled />}
      />
    </div>
  );
}
