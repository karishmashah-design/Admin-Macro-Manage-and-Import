import React from "react";
import { VersionSwitcher } from "@ds/ui";
import type { ScreenDef } from "@ds/ui";

import R1Baseline from "./screens/R1-Baseline";
import R1DragDrop from "./screens/R1-DragDrop";
import R1CustomizeDrawer from "./screens/R1-CustomizeDrawer";

const screens: ScreenDef[] = [
  { round: "R1", direction: "Baseline", component: R1Baseline },
  { round: "R1", direction: "Drag & Drop", component: R1DragDrop },
  { round: "R1", direction: "Customize Drawer", component: R1CustomizeDrawer },
];

export default function App() {
  if (screens.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen font-sans text-[var(--foreground-secondary,#666)]">
        Add screens to App.tsx to get started.
      </div>
    );
  }
  return <VersionSwitcher screens={screens} />;
}
