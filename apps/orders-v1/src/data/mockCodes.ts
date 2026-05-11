export type CodeItem = { code: string; description: string };
export type OrderItem = { id: string; label: string; baseLabel?: string; company?: string; detail: string; checked: boolean; relatedIcd?: string };

export type OrderSetChild = {
  id: string;
  label: string;       // base label, matches ordersPool baseLabel for company lookup
  company: string;
  relatedIcd?: string;
  checked: boolean;
};

export type OrderSetItem = {
  id: string;
  label: string;
  baseLabel?: string;   // name without company; used by Co.Title to compute display label
  defaultCompany: string;
  relatedIcd?: string;
  children: OrderSetChild[];
};

// Pool entry for the set-title picker (always has baseLabel)
export type OrderSetPoolItem = {
  id: string;
  baseLabel: string;
  defaultCompany: string;
  relatedIcd?: string;
  children: OrderSetChild[];
};

// ─── Code pools ───────────────────────────────────────────────────────────────

export const icd10Pool: CodeItem[] = [
  { code: "R07.9",  description: "Chest pain, unspecified" },
  { code: "R07.1",  description: "Chest pain on breathing" },
  { code: "R07.2",  description: "Precordial pain" },
  { code: "R07.89", description: "Other chest pain" },
  { code: "I10",    description: "Essential (primary) hypertension" },
  { code: "I11.9",  description: "Hypertensive heart disease without heart failure" },
  { code: "I20.9",  description: "Angina pectoris, unspecified" },
  { code: "I21.9",  description: "Acute myocardial infarction, unspecified" },
  { code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery" },
  { code: "E78.5",  description: "Hyperlipidemia, unspecified" },
  { code: "E78.00", description: "Pure hypercholesterolemia, unspecified" },
  { code: "E78.1",  description: "Pure hyperglyceridemia" },
  { code: "E11.9",  description: "Type 2 diabetes mellitus without complications" },
  { code: "Z82.49", description: "Family history of ischemic heart disease" },
  { code: "R00.0",  description: "Tachycardia, unspecified" },
  { code: "R00.1",  description: "Bradycardia, unspecified" },
  { code: "J18.9",  description: "Pneumonia, unspecified organism" },
  { code: "M54.6",  description: "Pain in thoracic spine" },
];

export const cptPool: CodeItem[] = [
  { code: "99213", description: "Office visit, low medical decision making" },
  { code: "99214", description: "Office visit, moderate medical decision making" },
  { code: "99215", description: "Office visit, high medical decision making" },
  { code: "93000", description: "Electrocardiogram, routine ECG with interpretation" },
  { code: "93010", description: "ECG, interpretation and report only" },
  { code: "71046", description: "Chest X-ray, 2 views" },
  { code: "93306", description: "Echocardiography, complete with Doppler" },
  { code: "80048", description: "Basic Metabolic Panel" },
  { code: "80053", description: "Comprehensive Metabolic Panel" },
  { code: "85025", description: "CBC with automated differential" },
  { code: "83036", description: "Hemoglobin A1c" },
];

// Codes to surface at the top when editing a given code
export const icd10Adjacent: Record<string, string[]> = {
  "R07.9":  ["R07.1", "R07.2", "R07.89", "I20.9", "I21.9"],
  "R07.1":  ["R07.9", "R07.2", "R07.89", "J18.9", "M54.6"],
  "I10":    ["I11.9", "I20.9", "I25.10"],
  "E78.5":  ["E78.00", "E78.1", "E11.9"],
  "Z82.49": ["I25.10", "I20.9", "I21.9"],
};

export const cptAdjacent: Record<string, string[]> = {
  "99214": ["99213", "99215"],
  "99213": ["99214", "99215"],
  "93000": ["93010", "71046", "93306"],
};

// ─── Orders pool ──────────────────────────────────────────────────────────────
// Company is a separate field; label uses "(Company)" parens format.
// baseLabel is the order name without company; facility orders have no company.

export const ordersPool: Array<{ id: string; label: string; baseLabel?: string; company?: string; detail: string; relatedIcd?: string }> = [
  // Imaging — in-house and external variants
  { id: "ecg-inhouse",        baseLabel: "ECG 12-lead",          company: "In-house",   label: "ECG 12-lead (In-house)",          detail: "In-office",          relatedIcd: "R07.9" },
  { id: "ecg-cardiology",     baseLabel: "ECG 12-lead",          company: "Cardiology", label: "ECG 12-lead (Cardiology)",         detail: "Cardiology referral", relatedIcd: "R07.9" },
  { id: "cxr-inhouse",        baseLabel: "Chest X-ray, 2-view",  company: "In-house",   label: "Chest X-ray, 2-view (In-house)",  detail: "In-office",          relatedIcd: "R07.9" },
  { id: "cxr-radiology",      baseLabel: "Chest X-ray, 2-view",  company: "Radiology",  label: "Chest X-ray, 2-view (Radiology)", detail: "Radiology referral",  relatedIcd: "R07.9" },
  { id: "echo-inhouse",       baseLabel: "Echocardiogram",       company: "In-house",   label: "Echocardiogram (In-house)",       detail: "In-office",          relatedIcd: "I25.10" },
  { id: "echo-cardiology",    baseLabel: "Echocardiogram",       company: "Cardiology", label: "Echocardiogram (Cardiology)",      detail: "Cardiology referral", relatedIcd: "I25.10" },
  { id: "stress-inhouse",     baseLabel: "Stress Test",          company: "In-house",   label: "Stress Test (In-house)",          detail: "Treadmill, In-office", relatedIcd: "I20.9" },
  { id: "stress-cardiology",  baseLabel: "Stress Test",          company: "Cardiology", label: "Stress Test (Cardiology)",         detail: "Treadmill, Cardiology referral", relatedIcd: "I20.9" },
  // Troponin
  { id: "trop-quest",   baseLabel: "Troponin I, High-Sensitivity", company: "Quest",   label: "Troponin I, High-Sensitivity (Quest)",    detail: "Quest Diagnostics", relatedIcd: "R07.9" },
  { id: "trop-labcorp", baseLabel: "Troponin I, High-Sensitivity", company: "Labcorp", label: "Troponin I, High-Sensitivity (Labcorp)",  detail: "Labcorp",           relatedIcd: "R07.9" },
  // BMP
  { id: "bmp-quest",    baseLabel: "Basic Metabolic Panel",        company: "Quest",   label: "Basic Metabolic Panel (Quest)",           detail: "Quest Diagnostics", relatedIcd: "I10" },
  { id: "bmp-labcorp",  baseLabel: "Basic Metabolic Panel",        company: "Labcorp", label: "Basic Metabolic Panel (Labcorp)",         detail: "Labcorp",           relatedIcd: "I10" },
  // CMP
  { id: "cmp-quest",    baseLabel: "Comprehensive Metabolic Panel", company: "Quest",  label: "Comprehensive Metabolic Panel (Quest)",   detail: "Quest Diagnostics", relatedIcd: "I10" },
  { id: "cmp-labcorp",  baseLabel: "Comprehensive Metabolic Panel", company: "Labcorp",label: "Comprehensive Metabolic Panel (Labcorp)", detail: "Labcorp",           relatedIcd: "I10" },
  // CBC
  { id: "cbc-quest",    baseLabel: "CBC with Differential",        company: "Quest",   label: "CBC with Differential (Quest)",           detail: "Quest Diagnostics" },
  { id: "cbc-labcorp",  baseLabel: "CBC with Differential",        company: "Labcorp", label: "CBC with Differential (Labcorp)",         detail: "Labcorp" },
  // Lipid
  { id: "lipid-quest",  baseLabel: "Lipid Panel",                  company: "Quest",   label: "Lipid Panel (Quest)",                     detail: "Quest Diagnostics", relatedIcd: "E78.5" },
  { id: "lipid-labcorp",baseLabel: "Lipid Panel",                  company: "Labcorp", label: "Lipid Panel (Labcorp)",                   detail: "Labcorp",           relatedIcd: "E78.5" },
  // A1c
  { id: "a1c-quest",    baseLabel: "Hemoglobin A1c",               company: "Quest",   label: "Hemoglobin A1c (Quest)",                  detail: "Quest Diagnostics", relatedIcd: "E11.9" },
  { id: "a1c-labcorp",  baseLabel: "Hemoglobin A1c",               company: "Labcorp", label: "Hemoglobin A1c (Labcorp)",                detail: "Labcorp",           relatedIcd: "E11.9" },
];

// Orders to surface at the top when editing a given order
// Same test with a different company always surfaces first, then similar tests.
export const ordersAdjacent: Record<string, string[]> = {
  "ecg-inhouse":       ["ecg-cardiology",   "stress-inhouse",    "echo-inhouse",    "cxr-inhouse"],
  "ecg-cardiology":    ["ecg-inhouse",      "stress-cardiology", "echo-cardiology", "cxr-radiology"],
  "cxr-inhouse":       ["cxr-radiology",    "ecg-inhouse",       "echo-inhouse"],
  "cxr-radiology":     ["cxr-inhouse",      "ecg-cardiology",    "echo-cardiology"],
  "echo-inhouse":      ["echo-cardiology",  "stress-inhouse",    "ecg-inhouse"],
  "echo-cardiology":   ["echo-inhouse",     "stress-cardiology", "ecg-cardiology"],
  "stress-inhouse":    ["stress-cardiology","echo-inhouse",      "ecg-inhouse"],
  "stress-cardiology": ["stress-inhouse",   "echo-cardiology",   "ecg-cardiology"],
  "trop-quest":    ["trop-labcorp", "bmp-quest", "cbc-quest"],
  "trop-labcorp":  ["trop-quest",   "bmp-labcorp", "cbc-labcorp"],
  "bmp-quest":     ["bmp-labcorp",  "cmp-quest",  "trop-quest"],
  "bmp-labcorp":   ["bmp-quest",    "cmp-labcorp", "trop-labcorp"],
  "cmp-quest":     ["cmp-labcorp",  "bmp-quest",  "a1c-quest"],
  "cmp-labcorp":   ["cmp-quest",    "bmp-labcorp", "a1c-labcorp"],
  "cbc-quest":     ["cbc-labcorp",  "bmp-quest",  "cmp-quest"],
  "cbc-labcorp":   ["cbc-quest",    "bmp-labcorp", "cmp-labcorp"],
  "lipid-quest":   ["lipid-labcorp","a1c-quest",  "cmp-quest"],
  "lipid-labcorp": ["lipid-quest",  "a1c-labcorp", "cmp-labcorp"],
  "a1c-quest":     ["a1c-labcorp",  "lipid-quest", "cmp-quest"],
  "a1c-labcorp":   ["a1c-quest",    "lipid-labcorp","cmp-labcorp"],
};

// ─── Initial screen state ─────────────────────────────────────────────────────

export const initialIcd10: CodeItem[] = [
  { code: "R07.9",  description: "Chest pain, unspecified" },
  { code: "I10",    description: "Essential (primary) hypertension" },
  { code: "E78.5",  description: "Hyperlipidemia, unspecified" },
  { code: "Z82.49", description: "Family history of ischemic heart disease" },
];

export const initialCpt: CodeItem[] = [
  { code: "99214", description: "Office visit, moderate medical decision making" },
  { code: "93000", description: "Electrocardiogram, routine ECG with interpretation" },
];

export const initialOrders: OrderItem[] = [
  { id: "ecg-inhouse", label: "ECG 12-lead (In-house)",        baseLabel: "ECG 12-lead",        company: "In-house", detail: "In-office", checked: true,  relatedIcd: "R07.9" },
  { id: "cxr-inhouse", label: "Chest X-ray, 2-view (In-house)", baseLabel: "Chest X-ray, 2-view", company: "In-house", detail: "In-office", checked: false, relatedIcd: "R07.9" },
];

export const initialOrderSets: OrderSetItem[] = [
  {
    id: "set-chest-pain-quest",
    label: "Chest Pain Workup",
    baseLabel: "Chest Pain Workup",
    defaultCompany: "Quest",
    relatedIcd: "R07.9",
    children: [
      { id: "set-trop",  label: "Troponin I, High-Sensitivity", company: "Quest", relatedIcd: "R07.9", checked: true },
      { id: "set-bmp",   label: "Basic Metabolic Panel",        company: "Quest", relatedIcd: "I10",   checked: true },
      { id: "set-cbc",   label: "CBC with Differential",        company: "Quest",                      checked: true },
      { id: "set-lipid", label: "Lipid Panel",                  company: "Quest", relatedIcd: "E78.5", checked: true },
    ],
  },
];

// ─── Order-set pool ───────────────────────────────────────────────────────────

export const orderSetsPool: OrderSetPoolItem[] = [
  {
    id: "set-chest-pain-quest",
    baseLabel: "Chest Pain Workup",
    defaultCompany: "Quest",
    relatedIcd: "R07.9",
    children: [
      { id: "set-trop",  label: "Troponin I, High-Sensitivity", company: "Quest", relatedIcd: "R07.9", checked: true },
      { id: "set-bmp",   label: "Basic Metabolic Panel",        company: "Quest", relatedIcd: "I10",   checked: true },
      { id: "set-cbc",   label: "CBC with Differential",        company: "Quest",                      checked: true },
      { id: "set-lipid", label: "Lipid Panel",                  company: "Quest", relatedIcd: "E78.5", checked: true },
    ],
  },
  {
    id: "set-chest-pain-labcorp",
    baseLabel: "Chest Pain Workup",
    defaultCompany: "Labcorp",
    relatedIcd: "R07.9",
    children: [
      { id: "set-trop-l",  label: "Troponin I, High-Sensitivity", company: "Labcorp", relatedIcd: "R07.9", checked: true },
      { id: "set-bmp-l",   label: "Basic Metabolic Panel",        company: "Labcorp", relatedIcd: "I10",   checked: true },
      { id: "set-cbc-l",   label: "CBC with Differential",        company: "Labcorp",                      checked: true },
      { id: "set-lipid-l", label: "Lipid Panel",                  company: "Labcorp", relatedIcd: "E78.5", checked: true },
    ],
  },
];

export const orderSetsAdjacent: Record<string, string[]> = {
  "set-chest-pain-quest":   ["set-chest-pain-labcorp"],
  "set-chest-pain-labcorp": ["set-chest-pain-quest"],
};
