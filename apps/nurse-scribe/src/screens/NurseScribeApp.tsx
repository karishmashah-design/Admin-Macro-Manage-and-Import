import React, { useState } from "react";
import { PrimaryNav, Icon } from "@ds/ui";
import { NurseScribeLogo } from "../components/NurseScribeLogo";
import { FeedbackIcon } from "../components/FeedbackIcon";
import VisitsPage from "./VisitsPage";
import ScribesPage from "./ScribesPage";
import ScribeDetailPage from "./ScribeDetailPage";

type Page = "visits" | "scribes" | "detail";

export default function NurseScribeApp() {
  const [page, setPage] = useState<Page>("visits");
  const [selectedScribeId, setSelectedScribeId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  function handleNav(id: string) {
    if (id === "visits") setPage("visits");
    if (id === "scribes") setPage("scribes");
  }

  function handleSelectScribe(id: string, template: string) {
    setSelectedScribeId(id);
    setSelectedTemplate(template);
    setPage("detail");
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "white" }}>
      <PrimaryNav
        activeItem={page === "visits" ? "visits" : "scribes"}
        onItemClick={handleNav}
        logo={<NurseScribeLogo size={36} />}
        bottomItems={[
          { id: "help", label: "Help", icon: <Icon name="help" size={20} /> },
          { id: "settings", label: "Feedback", icon: <FeedbackIcon size={20} color="var(--foreground-secondary,#666)" /> },
        ]}
      />
      {page === "visits" && <VisitsPage />}
      {page === "scribes" && (
        <ScribesPage onSelectScribe={handleSelectScribe} />
      )}
      {page === "detail" && selectedScribeId && (
        <ScribeDetailPage scribeId={selectedScribeId} template={selectedTemplate} />
      )}
    </div>
  );
}
