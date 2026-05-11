import React from "react";
import { Button } from "@ds/ui";

export default function App() {
  return (
    <div className="min-h-screen bg-background p-12 font-sans">
      <h1 className="text-3xl font-bold text-text mb-8">Project One</h1>
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  );
}
