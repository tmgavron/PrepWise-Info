import type { UseCasePage } from "@/lib/usecase";
import { page as mealPrepApp } from "./meal-prep-app";
import { page as pantryTracker } from "./pantry-tracker";
import { page as pantryMealPlanner } from "./pantry-meal-planner";
import { page as macroMealPlanner } from "./macro-meal-planner";
import { page as groceryListApp } from "./grocery-list-app";

// The use-case landing page registry.
//
// Adding a page means three things: claim its primary keyword in
// references/used-keywords.md FIRST, write the content file, and add one line
// here. This list is hand-maintained and therefore DRIFT-CHECKED:
// `scripts/verify-seo.mjs` reads this directory and fails the build if a page
// file is not imported below, if a registered page produced no HTML, or if its
// campaign token never reached the rendered App Store link. Without those
// checks a new page is a file nobody ever sees, or a page whose installs report
// under someone else's token, and nothing anywhere reports either.
//
// Order is the order they appear in the footer's Solutions block.
export const USE_CASE_PAGES: readonly UseCasePage[] = [
  mealPrepApp,
  pantryTracker,
  pantryMealPlanner,
  macroMealPlanner,
  groceryListApp,
];
