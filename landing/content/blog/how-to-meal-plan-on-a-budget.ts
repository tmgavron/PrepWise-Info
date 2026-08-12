import type { BlogPost } from "@/lib/blog";
import { OG_IMAGE } from "@/lib/constants";

// Cluster 4 (references/keyword-clusters.md). Primary from Google autocomplete
// 2026-07-26 (returned verbatim), claimed in references/used-keywords.md #11.
//
// SERP read 2026-07-26. Good Cheap Eats (~2,100 words, nine H2 tactics plus a
// four-question FAQ) is the closest match and the strongest result; the rest of
// page one is institutional tip lists (Unlock Food, Commonwealth Care Alliance,
// USU Extension, Texas A&M). Topics shared across the top three: check what you
// already have before shopping, plan around your schedule, choose cheap staple
// ingredients, use leftovers deliberately, shop the sales, make a list and stick
// to it. Two nobody covers: pricing per MEAL rather than per pack, and measuring
// what gets thrown away. Length target 1,800-2,200 words, matching Good Cheap
// Eats' tactic-list format including the FAQ.
//
// No household spending figure appears anywhere on this page. The only honest
// source is the USDA Food Plans reports, which are linked rather than quoted.
// See references/stats.md.
//
// Hero image: the shared social card. Text-first, no invented photography.
export const post: BlogPost = {
  slug: "how-to-meal-plan-on-a-budget",
  title: "How to Meal Plan on a Budget: Shop Your Kitchen First",
  h1: "How to meal plan on a budget, starting with the food you own",
  description:
    "How to meal plan on a budget: shop your kitchen first, build the week on two cheap anchors, and write the list as the gap. Eight tactics, in priority order.",
  ogDescription:
    "The cheapest food in your week is the food you already paid for. Eight tactics that start there.",
  primaryKeyword: "how to meal plan on a budget",
  secondaryKeywords: [
    "how to meal plan on a budget for 2",
    "how to meal plan on a tight budget",
    "how to meal prep on a budget",
    "how to meal plan on a budget for 1",
    "grocery budget",
  ],
  publishedAt: "2026-08-11",
  updatedAt: "2026-08-11",
  hero: {
    src: OG_IMAGE.url,
    alt: "PrepWise: a budget meal plan built from the food already in your kitchen",
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
  },

  intro: [
    "How to meal plan on a budget: shop your own kitchen before you shop anywhere else, build the week around two cheap ingredients you can repeat, price meals rather than packs, and write the shopping list last as the gap between the plan and the shelf. The cheapest food in your week is food you have already paid for.",
    "Most budget advice starts at the shop, with coupons and own-brand swaps. Those help at the margin. The bigger money is upstream, in the food you buy twice and the food you throw away, and both of those are decided before you leave the house.",
  ],

  sections: [
    {
      id: "where-the-money-goes",
      heading: "The money is not going where you think it is",
      body: [
        "Two lines in a food budget are almost pure loss, and neither is about the price of anything. The first is the duplicate buy: the third jar of cumin, the second bag of rice, the onions bought because nobody checked. The second is food that goes off before it gets cooked.",
        "Nobody buys either on purpose. They are both the same failure, which is that the shopping list was written from recipes and the cupboard was never consulted. Swapping to a cheaper brand of something you were going to throw away does not help.",
        "So the tactics below are ordered by how much they actually move. Everything about the shop itself comes last, because that is where the least of it is.",
      ],
    },
    {
      id: "the-order",
      heading: "The order that saves the most, first",
      body: [
        "Run these in sequence rather than picking favourites. The first three are worth more than the other five combined.",
      ],
      list: {
        ordered: true,
        items: [
          "Shop your own kitchen before you plan anything.",
          "Build the week on two cheap anchors you are willing to repeat.",
          "Write the list as the gap, then shop once.",
          "Price the meal, not the pack.",
          "Plan one or two meals with no meat in them.",
          "Plan fewer dinners than there are nights.",
          "Cook the thing that is about to go off, whether or not you want it tonight.",
          "Watch what you bin for two weeks, then change the list.",
        ],
      },
    },
    {
      id: "shop-your-kitchen",
      heading: "Shop your own kitchen first",
      body: [
        "Before a single recipe, open the fridge, the freezer and the cupboards and write down what is there with rough quantities. This takes twenty minutes the first time and five minutes after that.",
        "The freezer is where this pays. It is the part of the kitchen you cannot see, so it is where money goes to be forgotten: two portions of something from six weeks ago is a free dinner sitting in a drawer, and it stays free only if you know it is there.",
        "Every ingredient the plan needs and the shelf already holds is money you do not spend this week. That is the entire mechanism, and it is why this step is first. The [pantry-first method has its own guide](/blog/how-to-meal-plan-from-your-pantry) if you want the full stock-take routine.",
      ],
    },
    {
      id: "two-cheap-anchors",
      heading: "Build the week on two cheap anchors",
      body: [
        "An anchor is an ingredient you buy in quantity that several different meals are built around. On a budget, pick two that are cheap per portion and that you are genuinely willing to eat more than once: a large pack of chicken thighs rather than breasts, dried lentils, eggs, a bag of rice, frozen vegetables.",
        "Two anchors covering four dinners is one shop instead of four. Three or more and each meal starts pulling its own ingredients again, and the bill goes back up.",
        "Frozen vegetables deserve a specific mention because the price gap is real and the waste gap is bigger: nothing in the freezer wilts on Thursday. Buying fresh and binning half of it is more expensive than buying frozen and using all of it.",
      ],
    },
    {
      id: "list-as-the-gap",
      heading: "Write the list as the gap, then shop once",
      body: [
        "The list is everything the plan needs, minus everything you already have. Written in that order it is short, and a short list is the strongest defence against the trolley filling up on its own.",
        "Group it by where things sit in the shop rather than by which meal they belong to, so you walk the shop once. Two laps past the same aisles is two more chances to add something.",
        "One shop a week beats three small ones for the same reason. Every trip has a fixed cost in impulse buys that has nothing to do with what you went in for. If this is the part you would rather not do by hand, a [shopping list generated from your plan and your pantry](/grocery-list-app) is exactly that subtraction, done for you.",
      ],
    },
    {
      id: "price-the-meal",
      heading: "Price the meal, not the pack",
      body: [
        "The cheap pack and the cheap meal are different things, and shelf prices only tell you about the first one. A large pack of chicken thighs costs more at the till and less per dinner than a small pack of breasts. Dried lentils cost pennies per portion and look like nothing on the shelf.",
        "The number that matters is roughly what one serving costs, and you only need it to be approximate. Do it once for the six or seven meals you cook most, write the numbers down, and you will not need to do it again.",
        "Then use it to choose, not to feel bad. If two meals are equally welcome and one is half the price per serving, the plan should lean on that one. That is the whole use of the number.",
        "If you want a reference point for what a household of your size typically spends on food, the USDA publishes [monthly food plan cost reports](https://www.fns.usda.gov/cnpp/usda-food-plans-cost-food-monthly-reports) at four spending levels. Those are their figures and worth reading directly, rather than any number a meal-planning site quotes at you.",
      ],
    },
    {
      id: "one-meatless-meal",
      heading: "Plan one or two meals with no meat in them",
      body: [
        "This is the single biggest per-meal lever available, and it does not require anyone to change what they think of themselves. It is one dinner.",
        "Beans, lentils, eggs, tinned fish and peanut butter all carry a meal at a fraction of the cost of meat, and every one of them keeps for a long time, so they are also low-waste. The USDA's [healthy eating on a budget guidance](https://www.myplate.gov/eat-healthy/healthy-eating-budget) covers the swaps and the shopping side without selling you anything.",
        "Put it on a night when nobody has strong opinions. A lentil dish on a Tuesday goes unremarked. The same dish on a Friday becomes a discussion.",
      ],
    },
    {
      id: "fewer-dinners-and-the-clock",
      heading: "Plan fewer dinners than nights, and cook the clock",
      body: [
        "Count the evenings you will genuinely cook and plan one or two fewer. Ingredients bought for a night that does not happen are the most reliable waste in a household, and the plan is what generated them.",
        "Then order the meals by how long the food has left rather than by preference. Bagged salad and opened dairy go early in the week. Sealed meat and root vegetables go later. Dried and tinned things do not need a day at all.",
        "When something is about to go over and it is not on tonight's plan, cook it anyway. Roasted vegetables, a pot of soup, browned mince: all of them keep for days and all of them become the start of another meal. Cooking is how you buy time on food that is running out of it. The [full food waste version of this](/blog/how-to-reduce-food-waste-at-home) goes further, and waste and budget are the same problem counted twice.",
      ],
    },
    {
      id: "measure-the-bin",
      heading: "Watch what you throw away for two weeks",
      body: [
        "Nobody knows what they waste. Everybody has a theory, and the theory is usually wrong, which is why generic advice about buying less produce often misses.",
        "Keep a note on the fridge for a fortnight and write down what goes in the bin. Not weights, just names. Two weeks is enough for the pattern to be obvious, and it is almost always three or four repeat offenders rather than everything.",
        "Then change one thing: buy half as much of the top item, or buy it frozen, or plan the meal that uses it earlier in the week. That single change is worth more than a month of coupon clipping, and you will have measured it yourself rather than taken it on faith.",
      ],
    },
    {
      id: "where-prepwise-fits",
      heading: "Where PrepWise fits, honestly",
      body: [
        "None of these tactics needs an app, and the pen-and-paper version works. The step that decays is the first one. Keeping an accurate picture of the kitchen by hand is the chore people abandon, and once it is stale the plan quietly goes back to being written from recipes, which is where the duplicate buys come from.",
        "[PrepWise](/) holds the pantry so recipes carry a live availability indicator, reserves ingredients when you plan a meal so two dinners cannot claim the same pack, and writes the shopping list as the gap between your week and your shelf. The pantry can be loaded from a photo of a shelf or a grocery receipt rather than typed.",
        "The [shopping list side](/grocery-list-app) and the [pantry tracking side](/pantry-tracker) each have a page. PrepWise is on iPhone, free to download, and the free tier holds 15 saved recipes and 20 assistant messages a day. Pro is $6.99 a month or $39.99 a year with a 7-day trial, and if the budget is the reason you are here, the free tier is a reasonable place to stay.",
      ],
    },
    {
      id: "when-this-does-not-help",
      heading: "When this will not move your bill much",
      body: [
        "If you already cook cheaply from staples and throw almost nothing away, there is little left here. The remaining savings are at the shop, in own-brand swaps and sales, and they are small.",
        "If your food spending is mostly meals bought out, this is the wrong page. The lever there is the number of those, not how the groceries are planned.",
        "And if the constraint is time rather than money, be careful with this list. Cheap ingredients often cost more preparation, and a plan that is too demanding gets abandoned, at which point it costs more than the expensive version you were actually cooking.",
      ],
    },
  ],

  faqs: [
    {
      question: "What is the cheapest way to meal plan?",
      answer:
        "Plan from what you already own, repeat two cheap anchor ingredients across several meals, and write the shopping list as the gap. Buying nothing you already have and throwing nothing away beats every swap you can make at the shelf.",
    },
    {
      question: "How much should I budget for groceries?",
      answer:
        "There is no single right number, and any site that gives you one without knowing your household is guessing. The USDA publishes monthly food plan cost reports at four spending levels by household size, which is the reference worth using.",
    },
    {
      question: "Does meal planning actually save money?",
      answer:
        "It saves money when it reduces duplicate buying and food waste. A plan built from recipes without checking the cupboard can easily cost more than no plan at all, because it buys things you already had.",
    },
    {
      question: "How do I meal plan on a budget for one person?",
      answer:
        "Cook in batches and eat the same base more than once, because pack sizes are built for four. Lean on things that freeze well, and treat the freezer as portion storage rather than long-term storage you forget about.",
    },
    {
      question: "Is it cheaper to meal prep or to cook every night?",
      answer:
        "Prepping is usually cheaper because it uses whole packs and produces fewer half-used ingredients. That only holds if the food gets eaten, so prep three or four days rather than seven and freeze anything you are unsure about.",
    },
    {
      question: "Are frozen vegetables cheaper than fresh?",
      answer:
        "Usually, and the gap widens once waste is counted. Nothing in the freezer wilts by Thursday, so the portion you use is the portion you paid for. Fresh is worth the premium for the things you eat raw.",
    },
  ],

  internalLinks: [
    {
      href: "/grocery-list-app",
      label: "Shopping lists that subtract your pantry",
      note: "The list written as the gap, so you stop buying what you already own.",
    },
    {
      href: "/blog/how-to-reduce-food-waste-at-home",
      label: "How to reduce food waste at home",
      note: "The other half of the budget: the food you paid for and never cooked.",
    },
    {
      href: "/blog/how-to-meal-plan-for-the-week",
      label: "How to meal plan for the week",
      note: "The seven-step weekly routine these budget tactics slot into.",
    },
  ],
};
