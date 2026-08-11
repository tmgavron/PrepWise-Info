import type { BlogPost } from "@/lib/blog";
import { post as howToMealPlanFromYourPantry } from "./how-to-meal-plan-from-your-pantry";
import { post as whatCanIMakeWithWhatIHave } from "./what-can-i-make-with-what-i-have";
import { post as howToMealPlanForTheWeek } from "./how-to-meal-plan-for-the-week";
import { post as mealPrepForBeginners } from "./meal-prep-for-beginners";
import { post as howToMealPlanOnABudget } from "./how-to-meal-plan-on-a-budget";
import { post as highProteinMealPrep } from "./high-protein-meal-prep";
import { post as howToReduceFoodWasteAtHome } from "./how-to-reduce-food-waste-at-home";

// The post registry.
//
// Adding a post means two edits: the content file, and one line here. That is a
// hand-maintained list, so it is DRIFT-CHECKED rather than trusted:
// `scripts/verify-seo.mjs` reads this directory and fails the build if a post
// file is not imported below, or if a registered post produced no HTML in the
// export. Without that check a new post is a file nobody ever sees, and nothing
// anywhere reports it.
export const POSTS: readonly BlogPost[] = [
  howToMealPlanFromYourPantry,
  whatCanIMakeWithWhatIHave,
  howToMealPlanForTheWeek,
  mealPrepForBeginners,
  howToMealPlanOnABudget,
  highProteinMealPrep,
  howToReduceFoodWasteAtHome,
];
