import type { UseCasePage } from "@/lib/usecase";

// Primary keyword: "pantry meal planner" (claimed in references/used-keywords.md).
//
// WHY THIS CLUSTER EXISTS AT ALL: it is not in keyword-clusters.md. It came out
// of Search Console on 2026-08-11, where it was the ONLY non-brand query the
// site had received an impression for (1 impression, position 66). Real
// impression data beats an autocomplete seed, so it jumped the backlog.
//
// SERP check, 2026-08-11. Format is MIXED and mostly informational, which is
// the finding that shaped this page:
//
//   - Blog posts with sample plans: The Kitchn ("11 weeks' worth of meals you
//     can make with pantry staples"), Under the Median ("30-minute pantry meal
//     planning"), Smart In The Kitchen ("Pantry Meal Plan"). Roughly 800-1,500
//     words each.
//   - A Notion "Meal Planner & Digital Pantry" template.
//   - Penn State Extension, "Meal Planning with Food Pantry Boxes" (.edu).
//   - Two apps: KitchenPal (Google Play) and "Recipe by Pantry: Meal Planner"
//     (App Store).
//
// All three blog results cover the same three things: take stock first, keep
// pantry staples, here are sample meals. What NONE of them does is treat the
// pantry as a live input that the plan is continuously checked against; the
// plans are static lists, and the two ranking apps are inventory-first or
// recipe-first rather than planner-first. That gap is this page.
//
// Because the SERP leans informational, this page carries more METHOD than the
// other four use-case pages (see "what-a-planned-week-looks-like"). Measured on
// the built HTML it renders about 1,360 words against 870-1,010 for the other
// four, which puts it inside the 800-1,500 band the ranking blog posts occupy
// without padding past them.
//
// AMBIGUITY WORTH KNOWING: "food pantry" (the food-bank sense) is live in this
// SERP, which is what the Penn State result is. It is a different searcher and
// we should not chase it.
//
// BOUNDARIES, because this cluster sits between three pages that already exist:
//   /                                     -> `ai meal planner`, the generic
//                                            "decide my week for me" query
//   /pantry-tracker                       -> `pantry inventory app`, the
//                                            inventory ITSELF
//   /blog/how-to-meal-plan-from-your-pantry -> the METHOD, done by hand
//   this page                             -> the TOOL that runs that method
//
// NO OPINION IS USED. opinions.md #1 ("recipe-first apps solve the wrong half")
// fits this page exactly and is marked `TODO(trent: confirm)`, and an opinion
// Trent has not confirmed is worse than none. The recipe-first point is made
// below as a MECHANISM instead, which is inside voice.md's established
// positioning and needs no sign-off.
//
// The "no competitor uses 'pantry' in their App Store title" line from stats.md
// is deliberately NOT used: it is VERIFIED (volatile) as of 2026-07-06 and that
// file says re-check the App Store before building a page on it. Nobody has.
export const page: UseCasePage = {
  slug: "pantry-meal-planner",
  ct: "lp_pantry_planner",
  navLabel: "Pantry meal planner",

  title: "Pantry Meal Planner for iPhone: Cook What You Already Own",
  h1: "A pantry meal planner that starts with the food you already have",
  description:
    "A pantry meal planner that builds your week from the food already on your shelf, reserves what each meal claims, and writes the shopping list from the gap.",
  ogDescription:
    "Plan the week from what is already in your kitchen, then shop for the gap. Free on iPhone.",

  primaryKeyword: "pantry meal planner",
  secondaryKeywords: [
    "pantry meal planning",
    "meal planner using what i have",
    "plan meals from pantry",
    "pantry based meal plan",
  ],
  updatedAt: "2026-08-11",

  lede: [
    "A pantry meal planner works backwards from every other kind. Instead of picking seven recipes and handing you the shopping list they imply, PrepWise starts from the food already on your shelf and works out what that adds up to this week.",
    "The difference shows up on a Wednesday. A plan built from recipes needs a full shop before step one. A plan built from your kitchen needs four things from the corner shop and gets dinner cooked.",
  ],

  heroCta: {
    label: "Download on the App Store",
    note: "iPhone only, iOS 15.1 or later. Free to download.",
  },

  screenshot: {
    src: "/promo/C9.png",
    alt: "PrepWise week calendar showing planned meals and which ones still need ingredients",
    width: 1320,
    height: 2868,
  },

  sections: [
    {
      id: "the-plan-starts-with-the-shelf",
      heading: "The plan is checked against your kitchen, not written beside it",
      body: [
        "Most planners start from a recipe catalogue and work forwards. You choose, the app totals up the ingredients, and the list it produces assumes your kitchen is empty. It is a shopping app with a calendar attached.",
        "PrepWise runs the other direction. Your pantry is what every recipe gets measured against, so a recipe is green when you can cook it right now and tells you which two things are short when you cannot. Plan a meal and it reserves what that meal needs.",
        "That last part is what makes a week survive contact with Tuesday. Thursday's traybake cannot quietly claim the chicken thighs Tuesday already spent, so a plan that looks fine on paper is one you can actually cook. A plain list of seven recipes has no way to know it counted the same chicken twice.",
      ],
    },
    {
      id: "what-a-planned-week-looks-like",
      heading: "What a week planned from your pantry actually looks like",
      body: [
        "The method is the same one that works on paper, which is worth knowing before you decide an app is the answer. It runs in this order, and the order is the whole thing:",
      ],
      list: {
        ordered: true,
        items: [
          "Take stock of what is there, with rough quantities",
          "Push anything fresh, opened, or near its date to the top",
          "Pick two anchors, ingredients you have a lot of that several meals can hang off",
          "Fill the week in clock order, short-lived food first",
          "Write the shopping list last, from whatever the plan is still missing",
        ],
      },
    },
    {
      id: "why-the-order-matters",
      heading: "Sorting by the clock is what stops food going off",
      body: [
        "Once you can see everything you own, the useful ordering is time, not food group. Opened dairy, fresh herbs, and a bag of salad are on a short clock. Root vegetables and eggs have longer. Tins barely have one.",
        "Put the short-clock food into Monday and Tuesday and the long-clock food later, and most household waste stops happening on its own, because the food goes into a meal before it goes off. No one has to track a percentage for that to work.",
        "Two anchors is the number that makes the rest cheap. Chicken thighs and a bag of rice cover a traybake, a fried rice, and a soup, and the three share one shop instead of needing three. One anchor and you eat the same dinner four nights running. Three and you are back to a shopping list. The [five-step method](/blog/how-to-meal-plan-from-your-pantry) goes through this properly, including how to do the first stock-take without losing an afternoon.",
      ],
    },
    {
      id: "the-list-is-the-gap",
      heading: "The shopping list is the gap between the week and the shelf",
      body: [
        "Because the plan already knows what you own, the list writes itself by subtraction: everything the week needs, minus everything the kitchen already holds. It is normally much shorter than people expect, and that is the point rather than a side effect.",
        "It also kills the duplicate buy, which is the most expensive habit in a kitchen. Nobody buys a third jar of cumin deliberately. They buy it because the list came from recipes and the cupboard was never consulted. More on how that list is built on the [shopping list page](/grocery-list-app).",
      ],
    },
    {
      id: "keeping-the-pantry-honest",
      heading: "The stock-take is the part that has to stay cheap",
      body: [
        "Every pantry-first system dies the same way. The first stock-take goes fine, nobody updates it, and two weeks later the list is fiction. A plan built on a list you have stopped believing is worse than no plan.",
        "So getting food in has to cost almost nothing. Photograph a grocery receipt and the shelf updates from it. Add things by hand in a few seconds. Quantities can be rough, because \"most of a bag of rice\" is a useful entry and \"rice\" is not. After that the maintenance is only the moment food moves: in from a shop, out into a meal you cooked. The [pantry tracker page](/pantry-tracker) covers the inventory side in more detail.",
        "You notice quickly when it drifts, too, because the recipes go wrong with it. That is the one advantage a planner has over a notebook: the list has a job, so being wrong is visible.",
      ],
    },
    {
      id: "what-it-costs",
      heading: "What it costs, and what you get without paying",
      body: [
        "PrepWise is free to download, and planning is not the part behind the paywall. The free tier holds 15 saved recipes and 20 assistant messages a day.",
        "Pro is $6.99 a month or $39.99 a year, with a 7-day trial. iPhone only, iOS 15.1 or later. If you want the macro side of the week as well, that is on the [macro meal planner page](/macro-meal-planner).",
      ],
    },
  ],

  notFor: {
    heading: "When a pantry meal planner is the wrong tool",
    body: [
      "If you cook the same five meals on rotation and you are happy about it, you already have a plan and a stable list. Nothing here improves on that.",
      "If you shop daily for that evening, this trades a little admin for fewer trips, and you would be giving up the trips you like to save something you do not want.",
      "It also needs a kitchen you control. In a shared house where food arrives and disappears without a rule, the stock-take is unreliable, and an unreliable stock-take makes the plan worse rather than better.",
      "And it is iPhone only. There is no Android build.",
    ],
  },

  faqs: [
    {
      question: "Do I have to enter my whole pantry before I can plan anything?",
      answer:
        "No. Start with the things you actually cook with and plan around those. Receipts fill in the rest as you shop, so the record builds itself over the first couple of weeks instead of in one long sitting.",
    },
    {
      question: "Can it plan a week using only what I already have?",
      answer:
        "That is the default. PrepWise builds the week from your pantry first and then shows you what is still missing, so you can decide whether to shop for the gap or swap the meal for something you can already cook.",
    },
    {
      question: "What happens when the plan and the pantry disagree?",
      answer:
        "Trust the shelf and change the plan. A plan is a prediction and the pantry is a fact. Fix the record as soon as you notice, because a stock-take you have stopped believing is one you have stopped using.",
    },
    {
      question: "Is this different from a pantry inventory app?",
      answer:
        "An inventory tells you what you own. A planner decides what you eat and reserves the ingredients so two meals cannot claim the same food. PrepWise does both, and the inventory exists so the planning has something true to work from.",
    },
  ],

  footerCta: {
    heading: "Plan this week from what is already on the shelf",
    body: "PrepWise builds the week from your pantry, reserves what each meal needs, and writes the shopping list from whatever is left over.",
  },

  internalLinks: [
    {
      href: "/blog/how-to-meal-plan-from-your-pantry",
      label: "How to meal plan from your pantry",
      note: "The five-step method behind this page, written so it works on paper too.",
    },
    {
      href: "/pantry-tracker",
      label: "Pantry inventory app",
      note: "The tracking side: what is on the shelf, and what the plan has already claimed.",
    },
    {
      href: "/faq",
      label: "PrepWise FAQ",
      note: "Pantry, planning, macros, sharing, and billing questions, answered directly.",
    },
  ],
};
