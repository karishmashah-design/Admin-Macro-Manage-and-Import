import React, { useState } from "react";
import {
  Button, IconButton, Icon, Checkbox, Chip, Switch, TextField, TextArea,
  Tabs, Badge, VisitStatus, Link, AmbientLogo, Spinner,
} from "@ds/ui";
import type { Tab } from "@ds/ui";

const tabs: Tab[] = [
  { id: "buttons", label: "Buttons" },
  { id: "form", label: "Form" },
  { id: "chips", label: "Chips & Badges" },
  { id: "icons", label: "Icons" },
];


const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-[11px] font-bold tracking-[0.22px] text-[var(--foreground-secondary,#666)] uppercase mb-4">{title}</h2>
    <div className="flex flex-wrap gap-3 items-center">{children}</div>
  </div>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="w-full mb-6">
    <p className="text-[11px] text-[var(--foreground-secondary,#666)] mb-2">{label}</p>
    <div className="flex flex-wrap gap-3 items-center">{children}</div>
  </div>
);

function ButtonsTab() {
  return (
    <div>
      <Section title="Button — Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="tertiary-neutral">Tertiary Neutral</Button>
      </Section>
      <Section title="Button — Sizes">
        <Button variant="primary" size="large">Large</Button>
        <Button variant="primary" size="medium">Medium</Button>
        <Button variant="primary" size="small">Small</Button>
      </Section>
      <Section title="Button — Disabled">
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="tertiary" disabled>Tertiary</Button>
      </Section>
      <Section title="Button — With Prefix / Suffix">
        <Button variant="primary" prefix={<Icon name="add" size={16} />}>Add item</Button>
        <Button variant="secondary" suffix={<Icon name="arrow_forward" size={16} />}>Next</Button>
        <Button variant="tertiary" prefix={<Icon name="download" size={16} />}>Download</Button>
      </Section>
      <Section title="Icon Button — Variants">
        <IconButton icon={<Icon name="edit" size={20} />} variant="tertiary" aria-label="Tertiary" />
        <IconButton icon={<Icon name="edit" size={20} />} variant="tertiary-neutral" aria-label="Tertiary Neutral" />
        <IconButton icon={<Icon name="edit" size={20} />} variant="accent" aria-label="Accent" />
        <IconButton icon={<Icon name="auto_awesome" size={20} />} variant="magic" aria-label="Magic" />
      </Section>
      <Section title="Icon Button — Sizes">
        <IconButton icon={<Icon name="home" size={14} />} size="small" variant="tertiary" aria-label="Small" />
        <IconButton icon={<Icon name="home" size={20} />} size="medium" variant="tertiary" aria-label="Medium" />
        <IconButton icon={<Icon name="home" size={24} />} size="large" variant="tertiary" aria-label="Large" />
      </Section>
    </div>
  );
}

function FormTab() {
  const [switchS, setSwitchS] = useState(false);
  const [switchXS, setSwitchXS] = useState(true);
  return (
    <div>
      <Row label="TextField — States">
        <TextField label="Default" placeholder="Enter value" onChange={() => {}} />
        <TextField label="With value" value="John Doe" onChange={() => {}} />
        <TextField label="Error" value="bad input" feedback={{ type: "error", message: "This is required" }} onChange={() => {}} />
        <TextField label="Disabled" value="Read only" disabled onChange={() => {}} />
      </Row>
      <Row label="TextArea">
        <TextArea label="Notes" placeholder="Enter notes..." rows={3} onChange={() => {}} />
      </Row>
      <Row label="Checkbox — States">
        <Checkbox label="Unchecked" state="unchecked" onChange={() => {}} />
        <Checkbox label="Checked" state="checked" onChange={() => {}} />
        <Checkbox label="Indeterminate" state="indeterminate" onChange={() => {}} />
        <Checkbox label="Disabled" state="unchecked" disabled onChange={() => {}} />
      </Row>
      <Row label="Switch — Sizes & States">
        <Switch checked={false} onChange={() => {}} size="S" />
        <Switch checked={true} onChange={() => {}} size="S" />
        <Switch checked={switchS} onChange={setSwitchS} size="S" />
        <span className="text-[11px] text-[var(--foreground-secondary,#666)] mx-2">XS:</span>
        <Switch checked={false} onChange={() => {}} size="XS" />
        <Switch checked={true} onChange={() => {}} size="XS" />
        <Switch checked={switchXS} onChange={setSwitchXS} size="XS" />
      </Row>
    </div>
  );
}

function ChipsBadgesTab() {
  return (
    <div>
      <Section title="Chip — Colors">
        <Chip label="Neutral" color="neutral" />
        <Chip label="Accent" color="accent" />
      </Section>
      <Section title="Chip — Interactive">
        <Chip label="Clickable" color="neutral" onClick={() => {}} />
        <Chip label="Clickable accent" color="accent" onClick={() => {}} />
        <Chip label="Dismissible" color="neutral" onDismiss={() => {}} />
        <Chip label="Dismissible accent" color="accent" onDismiss={() => {}} />
        <Chip label="Disabled" color="neutral" disabled />
      </Section>
      <Section title="Badge — Variants">
        <Badge label="Default" variant="default" />
        <Badge label="Success" variant="success" />
        <Badge label="Info" variant="info" />
        <Badge label="Warning" variant="warning" />
        <Badge label="Error" variant="error" />
      </Section>
      <Section title="Badge — With Icon">
        <Badge label="With icon" variant="success" icon={<Icon name="check_circle" size={14} filled />} />
        <Badge label="With icon" variant="warning" icon={<Icon name="warning" size={14} filled />} />
        <Badge label="With icon" variant="error" icon={<Icon name="error" size={14} filled />} />
      </Section>
      <Section title="Visit Status">
        <VisitStatus status="Generated" />
        <VisitStatus status="Uploading" />
        <VisitStatus status="Processing" />
        <VisitStatus status="Error" />
        <VisitStatus status="In Queue" />
      </Section>
      <Section title="Link">
        <Link href="#">Medium link (default)</Link>
        <Link href="#" size="small">Small link</Link>
        <Link href="#" size="large">Large link</Link>
      </Section>
    </div>
  );
}

function IconsTab() {
  const materialIcons = [
    "home", "search", "settings", "person", "add", "close", "arrow_back",
    "arrow_forward", "check", "edit", "delete", "refresh", "more_horiz",
    "calendar_today", "schedule", "warning", "info", "check_circle", "error",
  ];
  return (
    <div>
      <Section title="Custom Icons">
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center gap-1">
            <AmbientLogo />
            <span className="text-[10px] text-[var(--foreground-secondary,#666)]">AmbientLogo</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Spinner />
            <span className="text-[10px] text-[var(--foreground-secondary,#666)]">Spinner</span>
          </div>
        </div>
      </Section>
      <Section title="Icon — Sizes">
        {[14, 16, 20, 24, 32].map(size => (
          <div key={size} className="flex flex-col items-center gap-1">
            <Icon name="home" size={size} />
            <span className="text-[10px] text-[var(--foreground-secondary,#666)]">{size}</span>
          </div>
        ))}
      </Section>
      <Section title="Icon — Outlined vs Filled">
        {["favorite", "star", "bookmark", "check_circle"].map(name => (
          <div key={name} className="flex gap-2 items-center">
            <Icon name={name} size={24} />
            <Icon name={name} size={24} filled />
          </div>
        ))}
      </Section>
      <Section title="Material Symbols Rounded">
        <div className="flex flex-wrap gap-4">
          {materialIcons.map(name => (
            <div key={name} className="flex flex-col items-center gap-1 w-16">
              <Icon name={name} size={24} />
              <span className="text-[10px] text-[var(--foreground-secondary,#666)] text-center leading-tight">{name}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("buttons");
  const tabComponents: Record<string, React.ComponentType> = {
    buttons: ButtonsTab, form: FormTab, chips: ChipsBadgesTab, icons: IconsTab,
  };
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="min-h-screen bg-white font-['Lato',sans-serif]">
      <div className="border-b border-[var(--surface-3,#eee)] px-8 py-4 flex items-center gap-3">
        <AmbientLogo />
        <h1 className="text-[15px] font-bold text-[var(--foreground-primary,#1a1a1a)] tracking-[0.15px]">
          Design System Preview
        </h1>
      </div>
      <div className="px-8 pt-4 border-b border-[var(--surface-3,#eee)]">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="px-8 py-8 max-w-4xl">
        <ActiveComponent />
      </div>
    </div>
  );
}
