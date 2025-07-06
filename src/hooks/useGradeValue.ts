import { SYSTEMS } from "../data/systems";
import { Grade } from "../data/grades";

export function valueFor(systemLabel: string, g: Grade) {
  const found = SYSTEMS.find((s) => s.label === systemLabel);
  return found ? g[found.key as keyof Grade] : "";
}
