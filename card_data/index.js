import { marvelGroups } from "./marvelCardData.js";
import { dcGroups } from "./dcCardData.js";
import { ninjagoGroups } from "./ninjagoCardData.js";
import { starWarsGroups } from "./starWarsCardData.js";
import { miscGroups } from "./miscCardData.js";

// Every group, in display order. Used by the checklist, rankings and scripts.
export const allGroups = [
  ...marvelGroups,
  ...dcGroups,
  ...ninjagoGroups,
  ...starWarsGroups,
  ...miscGroups
];
