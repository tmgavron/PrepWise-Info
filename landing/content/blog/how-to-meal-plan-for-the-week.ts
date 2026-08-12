import type { BlogPost } from "@/lib/blog";
import { OG_IMAGE } from "@/lib/constants";

// Cluster 2 (references/keyword-clusters.md). Primary from Google autocomplete
// 2026-07-26, claimed in references/used-keywords.md #9.
//
// SERP read 2026-07-26. Every page on page one is a numbered step guide: The
// Girl on Bloor (~2,800 words, five steps plus recipe round-ups), Harvard's
// Nutrition Source, Brown University Health, The Kitchn's beginner guide, Taste
// of Home's 32 tips. Shared topics across all three of the top results:
// pick a planning day, check what you already have before shopping, plan around
// your actual schedule, batch and repurpose, store it properly. Two nobody
// covers: what to do when the plan breaks mid-week, and planning FEWER dinners
// than there are nights. Length target 2,000-2,400 words, inside 20% of the
// top-three average. Long enough that the template renders a table of contents.
//
// Hero image: the shared social card. Text-first, no invented photography.
export const post: BlogPost = {
  slug: "how-to-meal-plan-for-the-week",
  title: "How to Meal Plan for the Week: A Seven-Step Routine",
  h1: "How to meal plan for the week, in seven steps",
  description:
    "How to meal plan for the week: count the nights you will actually cook, plan from the shelf, and shop for the gap. Seven steps, and what to do when it breaks.",
  ogDescription:
    "A weekly planning routine that survives a Wednesday, built around the food you already own.",
  primaryKeyword: "how to meal plan for the week",
  secondaryKeywords: [
    "how to meal plan for the week on a budget",
    "how to meal plan and prep",
    "how to meal plan for a family",
    "meal planning for the week",
    "weekly meal planning",
  ],
  publishedAt: "2026-08-11",
  updatedAt: "2026-08-11",
  hero: {
    src: OG_IMAGE.url,
    alt: "PrepWise: a week of meals planned around what is already in your kitchen",
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
  },

  intro: [
    "How to meal plan for the week: count the nights you will genuinely cook, look at what is already in the kitchen, choose meals that share ingredients, put them against days in the order the food will go off, and write the shopping list last. Seven steps, and the last two are the ones people skip.",
    "A plan is not a list of seven dinners. It is a set of decisions made on Sunday so that Wednesday does not need any. Most weekly plans fail because they were built as a menu rather than as a decision, and a menu cannot absorb a late meeting.",
  ],

  sections: [
    {
      id: "why-the-week-falls-apart",
      heading: "Why the week falls apart on Wednesday",
      body: [
        "Almost every abandoned meal plan dies the same way. Sunday produced seven dinners. Monday and Tuesday went fine. Wednesday something ran late, nobody cooked, and now Thursday's ingredients are competing with Wednesday's for the same evening. By Friday the plan is a list of food that has already gone off.",
        "That is not a discipline problem. It is a design problem. The plan had no slack, assumed a shopping trip that may not happen, and treated the kitchen as empty when it was not.",
        "The steps below fix those three things in order: fewer meals than nights, the shelf before the shop, and a written rule for what happens when a night is missed.",
      ],
    },
    {
      id: "the-seven-steps",
      heading: "The seven steps, in order",
      body: [
        "Half an hour, once a week, and the order matters more than the effort. Steps two and seven are what separate this from writing out a menu.",
      ],
      list: {
        ordered: true,
        items: [
          "Count the nights you will actually cook. Not the nights in the week.",
          "Take stock of the kitchen before you look at a single recipe.",
          "Pick two anchors that several meals can share.",
          "Choose meals in the order the food will go off, not in order of preference.",
          "Write the shopping list last, as the gap between the plan and the shelf.",
          "Prep the two or three things that everything else waits on.",
          "Decide now what happens when a night gets missed.",
        ],
      },
    },
    {
      id: "count-the-nights",
      heading: "Count the nights you will actually cook, not the nights in the week",
      body: [
        "Open the calendar first. Not the recipe app. Look for the evenings that are already spoken for: the late finish, the school thing, the night someone is out, the night you know from experience nobody will want to start chopping at eight.",
        "What is left is the real number, and for most households it is four or five, not seven. Planning seven dinners into a five-dinner week guarantees two sets of unused ingredients, which is the exact mechanism that makes the plan feel like a failure.",
        "Then give the hardest night the easiest meal. Something that goes in one tray, or something that reheats. The night you are most likely to abandon the plan is the night the plan should ask least of you.",
      ],
    },
    {
      id: "take-stock-first",
      heading: "Look at the shelf before you look at recipes",
      body: [
        "This is the step that changes the outcome, and it is the one nearly every weekly planning guide puts fourth, after the recipes are already chosen. By then it is not planning, it is checking.",
        "Open the fridge, the freezer, and the cupboards and write down what is there with rough quantities. \"Most of a bag of rice\" is a useful entry. \"Rice\" is not, because it does not tell you whether Thursday works. The freezer matters most: the food most likely to be forgotten is the food you cannot see, and two portions of chili in there change the week.",
        "The full method is worth its own read if you have never done it: [how to meal plan from your pantry](/blog/how-to-meal-plan-from-your-pantry) covers the stock-take properly. For the weekly routine, you need it accurate enough to answer one question, which is what you would be buying twice.",
      ],
    },
    {
      id: "pick-the-anchors",
      heading: "Pick two anchors and let the week hang off them",
      body: [
        "An anchor is an ingredient you have or will buy in quantity that several different meals can be built around. A pack of chicken thighs. A bag of rice. A block of feta. A bag of frozen peas.",
        "Two is the number. One leaves you eating the same dinner four nights running. Three or more and each meal starts pulling its own ingredients, which is a shopping list wearing a plan's clothes.",
        "Anchors do the structural work: chicken thighs and rice cover a traybake, a fried rice and a soup, and the three share one shop. The variety comes from the small things you already own, the spices and the sauces and the half onion. This is also what makes leftovers deliberate rather than accidental: cook the anchor once in quantity, then let two different meals come out of the same pot.",
      ],
    },
    {
      id: "meals-against-days",
      heading: "Put meals against days in clock order, not in order of preference",
      body: [
        "Now assign the meals, and sort by how long the food has rather than by what you fancy. The bagged salad and the opened yoghurt take Monday and Tuesday. The sealed chicken can wait until Thursday. The dried lentils will keep until March and do not need a day at all.",
        "Check each meal against the shelf as you add it rather than at the end. A week that looks fine on paper and turns out to need three onions you do not have is a week you will quietly stop following on Tuesday, and that correction is far cheaper made one meal at a time.",
        "Repeat on purpose. Two nights of the same base is not a failure of imagination, it is the reason the plan is cheap and fast. Nobody notices that Tuesday and Thursday came out of one pot if Thursday has a different sauce on it.",
      ],
    },
    {
      id: "the-list-is-the-gap",
      heading: "Write the shopping list last, as the gap",
      body: [
        "The list is everything the plan needs, minus everything the shelf already holds. Written in that order it is normally much shorter than expected, and that is the point of doing the stock-take first.",
        "This is also what kills the duplicate buy, which is the most expensive habit in a kitchen. Nobody buys a third jar of cumin on purpose. They buy it because the list was written from recipes and the cupboard was never consulted.",
        "Group the list by where things are in the shop rather than by which meal they belong to. You walk the shop once, not once per dinner. If you would rather this wrote itself, that is exactly what a [shopping list built from your plan](/grocery-list-app) is for.",
      ],
    },
    {
      id: "prep-the-waited-on-things",
      heading: "Prep the two or three things that everything else waits on",
      body: [
        "Planning and prepping are different jobs and it is worth being clear about which one you are doing. The plan is the decisions. The prep is a small amount of cooking done early so the decisions are cheap to act on.",
        "You do not need to cook the week. You need to cook the two or three things that several meals wait on: the grain, the protein, and one sauce or dressing. Rice and a tray of chicken thighs on Sunday means Monday and Thursday are assembly rather than cooking.",
        "Harvard's Nutrition Source has a [practical meal prep guide](https://nutritionsource.hsph.harvard.edu/meal-prep/) covering the food-handling side of cooking ahead, and the USDA's [FoodKeeper storage guide](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app) gives real storage times rather than the date printed on the packet, which is usually about quality rather than safety.",
        "If prepping is the part you actually want, the [beginner's version of the routine](/blog/meal-prep-for-beginners) is a separate post, and starting there is reasonable.",
      ],
    },
    {
      id: "decide-what-happens-when-it-breaks",
      heading: "Decide now what happens when a night gets missed",
      body: [
        "Every plan gets broken. The ones that survive are the ones where the answer was decided in advance rather than at seven o'clock with the fridge open.",
        "Two rules cover almost everything. First, a missed night moves to the front of the queue, it does not get dropped, because its ingredients are now the oldest thing in the plan. Second, if the missed meal's food will not last, cook it anyway and eat it later: roasted vegetables and a browned pack of mince keep for days and become the start of another meal.",
        "Leave two nights unassigned from the start. Not a meal, not a plan, just space for leftovers and for whatever comes up. Slack is not laziness in a weekly plan. It is the thing that makes the other five happen.",
      ],
    },
    {
      id: "where-prepwise-fits",
      heading: "Where PrepWise fits, honestly",
      body: [
        "Every step above works on paper, and plenty of people run it on paper for years. What breaks is step two around week three. Keeping the stock-take current by hand is the chore people quit, and once it is stale the whole routine collapses back into planning from recipes.",
        "That is the part [PrepWise](/) automates. It holds the pantry, so recipes carry a live availability indicator rather than you cross-checking a list. It reserves ingredients when you plan a meal, so two dinners cannot claim the same chicken. It writes the shopping list as the gap between your week and your shelf, and it can load the pantry from a photo of the shelf or a grocery receipt instead of typing.",
        "The [weekly planning and batch cooking side](/meal-prep-app) is a page of its own. PrepWise is on iPhone, free to download, and the free tier holds 15 saved recipes and 20 assistant messages a day. Pro is $6.99 a month or $39.99 a year with a 7-day trial.",
      ],
    },
    {
      id: "when-not-to-plan-weekly",
      heading: "When weekly planning is the wrong tool",
      body: [
        "If you cook the same five meals on rotation and you are happy about it, you already have a plan. Adding a planning ritual on top of a stable rotation adds admin and removes nothing.",
        "If your week is genuinely unpredictable, plan components rather than meals: cook a grain, a protein and a sauce, and decide dinners on the night. That is still planning, it just resolves later.",
        "And if you shop most days for that evening, weekly planning is solving a problem you do not have. It trades a little admin for fewer trips. If the trips are the part you like, keep them.",
      ],
    },
  ],

  faqs: [
    {
      question: "How long should meal planning for the week take?",
      answer:
        "About half an hour once you have done it a few times, and most of that is the stock-take. If it is taking two hours you are choosing recipes rather than making decisions, which is the difference between planning a week and browsing one.",
    },
    {
      question: "What day should I meal plan on?",
      answer:
        "Whichever day comes before your shop, so the list is fresh when you use it. Sunday is the common answer only because Sunday shopping is common. Planning three days before you shop means the plan is already out of date.",
    },
    {
      question: "Should I plan breakfast and lunch as well?",
      answer:
        "Start with dinners. They carry the most variety and the most waste, and they are where the kitchen actually gets spent. Breakfast and lunch are usually a short rotation you already run without thinking, and adding them in week one is how a plan turns into a chore.",
    },
    {
      question: "How many meals should I plan for a week?",
      answer:
        "Fewer than there are nights. Count the evenings you will genuinely cook, then plan one or two fewer than that. The gap absorbs leftovers and the night that goes sideways, and a plan with no slack is one you abandon on Wednesday.",
    },
    {
      question: "How do I meal plan for a family with different tastes?",
      answer:
        "Plan components rather than finished plates. One grain, one protein, two or three toppings, and let people build. That is one cooking job instead of three, and it lets you keep the anchor ingredients that make the week cheap.",
    },
    {
      question: "Do I need an app to meal plan for the week?",
      answer:
        "No. A sheet of paper works, and the method is the same. An app earns its place at the stock-take, which is the step most people give up on by week three and the one everything else depends on.",
    },
  ],

  internalLinks: [
    {
      href: "/blog/how-to-meal-plan-from-your-pantry",
      label: "How to meal plan from your pantry",
      note: "The five-step method underneath this routine: stock-take, anchors, then the gap.",
    },
    {
      href: "/meal-prep-app",
      label: "PrepWise for weekly meal prep",
      note: "Planning a week and batch cooking it, around the food you already own.",
    },
    {
      href: "/grocery-list-app",
      label: "Shopping lists that subtract your pantry",
      note: "The list as the gap between the week you planned and the shelf you have.",
    },
  ],
};
