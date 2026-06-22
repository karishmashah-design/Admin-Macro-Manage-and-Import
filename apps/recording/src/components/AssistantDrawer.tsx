import React from "react";
import { Icon } from "@ds/ui";
import { PrevisitContent } from "./PrevisitContent";
import { ChatInput } from "./ChatInput";

export type DrawerTab = "recording" | "assistant" | "previsit";

const SUGGESTIONS: { icon: string; label: string }[] = [
  { icon: "ink_highlighter", label: "What should I know before this visit?" },
  { icon: "chat_info", label: "Any risks or concerns I should be aware of?" },
  { icon: "fact_check", label: "What should I make sure to cover today?" },
  { icon: "trending_up", label: "Summarize trends in this patient's results." },
  { icon: "lightbulb", label: "Explain Carry Forward and how to use it." },
  { icon: "history", label: "Frequent question" },
  { icon: "history", label: "Recent question" },
];

const TABS: { id: DrawerTab; label: string }[] = [
  { id: "recording", label: "Recording" },
  { id: "assistant", label: "Assistant" },
  { id: "previsit", label: "Previsit" },
];


// The white assistant/previsit sheet that slides over the gradient. Contains
// the in-drawer tabs, suggested questions, and the chat input pinned at the
// bottom. The input is the last flow element, so when the drawer's height
// shrinks to sit above the keyboard, the input naturally rises with it.
export function AssistantDrawer({
  activeTab,
  onTabChange,
  inputValue,
  onInputChange,
  onInputFocus,
  onInputBlur,
  inputRef,
}: {
  activeTab: DrawerTab;
  onTabChange: (t: DrawerTab) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden border border-black/10 bg-white shadow-[0_-4px_16px_2px_rgba(0,0,0,0.07)]">
      {/* tabs */}
      <div className="flex items-center pl-[20px] pr-[8px] pt-[12px]">
        <div className="flex items-center gap-[8px]">
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-start px-[4px] py-[6px] ${
                  active ? "border-b-2 border-[var(--accent,#1132ee)]" : ""
                }`}
              >
                <span
                  className={`font-['Lato'] text-[13px] font-bold leading-[1.2] tracking-[0.13px] ${
                    active ? "text-[var(--accent,#1132ee)]" : "text-[#808080]"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* content + input */}
      <div className="flex min-h-px flex-1 flex-col gap-[8px] px-[20px] pb-[16px] pt-[8px]">
        {activeTab === "assistant" ? (
          <>
            <div className="flex min-h-px flex-1 flex-col gap-[12px] overflow-y-auto">
              <span className="font-['Lato'] text-[13px] font-bold leading-[1.2] tracking-[0.13px] text-[var(--foreground-primary,#1a1a1a)]">
                Get Started
              </span>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="flex h-[28px] shrink-0 items-center gap-[8px] self-start rounded-[8px] bg-[var(--surface-2,#f2f2f2)] px-[8px]"
                >
                  <Icon name={s.icon} size={16} />
                  <span className="font-['Lato'] text-[13px] font-normal leading-[1.4] tracking-[0.065px] text-[var(--foreground-primary,#1a1a1a)] whitespace-nowrap">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            <ChatInput
              value={inputValue}
              onChange={onInputChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              inputRef={inputRef}
            />
          </>
        ) : (
          <div className="flex min-h-px flex-1 flex-col overflow-y-auto">
            <PrevisitContent />
          </div>
        )}
      </div>
    </div>
  );
}
