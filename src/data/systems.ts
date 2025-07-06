export const SYSTEMS = [
  { label: "French", key: "fr" },
  { label: "YDS", key: "yds" },
  { label: "UIAA", key: "uiaa" },
  { label: "Ewbank", key: "ewbank" },
  { label: "Polish", key: "pl" },
  { label: "Brazilian", key: "br" },
  { label: "Nordic", key: "no" },
] as const;

export type SystemKey = (typeof SYSTEMS)[number]["key"];
