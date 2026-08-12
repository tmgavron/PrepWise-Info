import type { BlogPost } from "@/lib/blog";
import { OG_IMAGE } from "@/lib/constants";

// Cluster 1 (references/keyword-clusters.md). Primary from Google autocomplete
// 2026-07-26, claimed in references/used-keywords.md #8.
//
// SERP read 2026-07-26. The top results split two ways: TOOLS (Supercook,
// Tesco's "what can I make with" recipe finder) and RECIPE LISTICLES (Taste of
// Home "31 Easy Pantry Dinners", BuzzFeed "19 Easy Recipes To Make With Stuff
// You Already Have", cookwithwhatyouhave.com). Nobody on page one teaches the
// decision itself: they either take your ingredient list or hand you 31 photos.
// Length target 1,400-1,700 words, because the listicles run long on recipe
// cards and short on prose. This post matches their template-list shape in the
// middle and beats them on the part they skip, which is the ordering.
//
// Hero image: the shared social card. Text-first is fine and an honest
// placeholder beats an invented photograph of somebody else's fridge.
export const post: BlogPost = {
  slug: "what-can-i-make-with-what-i-have",
  title: "What Can I Make With What I Have? A Four-Step Method",
  h1: "What can I make with what I have? Work it in this order",
  description:
    "What can I make with what I have? Pull the protein, find the starch, pick a template that absorbs anything, and cook. Four steps, in the order that works.",
  ogDescription:
    "Four steps from a full fridge to dinner, without a shop and without a recipe you cannot cook.",
  primaryKeyword: "what can i make with what i have",
  secondaryKeywords: [
    "what can i make with what i have in my fridge",
    "what can i make with what i have in my pantry",
    "what can i cook with what i have",
    "what can i make with these ingredients",
    "what can i make with what i have in my kitchen",
  ],
  publishedAt: "2026-08-11",
  updatedAt: "2026-08-11",
  hero: {
    src: OG_IMAGE.url,
    alt: "PrepWise: recipes matched to the food already in your kitchen",
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
  },

  intro: [
    "What can I make with what I have? Work it in this order: take the protein out and put it on the counter, find a starch to carry it, pick one of a handful of templates that absorb almost anything, and use whatever is left as flavour. Four steps, and the order is the whole trick.",
    "Most people do it backwards. They stand at the open door reading the shelf like a list, waiting for a dish to arrive, and nothing does. A fridge is not a menu. It is a set of parts, and parts only turn into dinner once something decides the shape.",
  ],

  sections: [
    {
      id: "why-nothing-comes-to-mind",
      heading: "Nothing comes to mind because you are asking the wrong question",
      body: [
        "You are not short of food. You are short of a combination. Reading the shelf produces a list of nouns, and a list of nouns does not suggest a dish, because the dish is the relationship between them, not the items themselves.",
        "The recipe apps make it worse. Type in three things and most of them return something that needs six more, so the answer to \"what can I make with what I have\" turns into a shopping trip. That is a search engine with better manners, not help.",
        "The fix is to stop asking what dish these things are, and start asking what shape they can take. There are not many shapes. That is why this works.",
      ],
    },
    {
      id: "the-four-steps",
      heading: "The four steps, in the order that works",
      body: [
        "Each step narrows the next one. Doing them out of order is how you end up back at the open door.",
      ],
      list: {
        ordered: true,
        items: [
          "Pull the protein. Whatever is on the shortest clock goes on the counter first.",
          "Find the starch that carries it. Rice, pasta, bread, potatoes, tortillas, a tin of beans.",
          "Pick a template. A shape that absorbs almost anything, not a recipe.",
          "Spend everything else as flavour. The half onion, the tired herbs, the end of a jar.",
        ],
      },
    },
    {
      id: "start-with-the-protein",
      heading: "Start with the protein, because it decides the most",
      body: [
        "Protein is the item with the shortest clock, the highest price, and the strongest opinion about what goes with it. Decide it first and three quarters of the question is answered.",
        "Look in the fridge and the freezer, in that order. Half a pack of mince, four eggs, a tin of chickpeas, the last of a rotisserie chicken, two sausages. Any of those is a dinner. Frozen counts: two portions of something from six weeks ago is a better Tuesday than anything you were about to plan.",
        "If there is genuinely no protein, eggs and tinned beans are the two that turn up in nearly every kitchen, and both carry a meal on their own. If those are gone too, this is a shopping problem, not a cooking problem, and no method fixes it.",
      ],
    },
    {
      id: "find-the-starch",
      heading: "Find the starch that carries it",
      body: [
        "The starch is what turns a portion of protein into a meal for however many people are eating. It is also the cheapest lever in the kitchen, and the one most likely to already be there.",
        "Rice, pasta, potatoes, bread, tortillas, couscous, noodles, a tin of beans doing double duty. Pick the one with the shortest clock rather than the one you feel like: half a loaf going stale beats the bag of rice that will keep until March, because the rice is not going anywhere.",
        "This step is short on purpose. If you are deliberating over the starch you have skipped step one.",
      ],
    },
    {
      id: "pick-a-template",
      heading: "Pick a template, not a recipe",
      body: [
        "A template is a shape that works with a wide range of contents. A recipe is a fixed list. You cannot cook a recipe from a random fridge, and you almost always can cook a template.",
        "Six cover most of what a home kitchen throws at you. Learn them and the question stops being hard:",
      ],
      list: {
        items: [
          "Fried rice, for cooked grains plus any protein and any firm vegetable",
          "Frittata or omelette, for eggs plus small amounts of several things",
          "Soup, for the odds and ends and anything slightly past its best",
          "Traybake, for a protein plus root vegetables and one fat",
          "Stir fry, for something quick-cooking plus whatever is crunchy",
          "Grain bowl, for leftovers that do not want to be reheated together",
        ],
      },
    },
    {
      id: "spend-the-rest-as-flavour",
      heading: "Spend everything else as flavour, not as structure",
      body: [
        "Once the shape is chosen, the rest of the shelf stops being a problem and becomes the interesting part. Half an onion, a spoon of mustard, the last of a jar of olives, three tired spring onions, a wedge of hard cheese. None of them is a meal. All of them make one taste like it was intended.",
        "Work in the order fat, salt, acid, heat. Something to cook in, something salty, something sharp to cut it, something with a bit of bite. A traybake with olive oil, anchovies, a squeeze of lemon and chilli flakes is a dish. The same traybake with none of those is boiled vegetables.",
        "This is also where the food nearest its date gets used, which is the quiet reason the method saves money. Herbs, opened dairy, and salad go in as flavour on the day you notice them rather than into the bin on Thursday.",
      ],
    },
    {
      id: "when-the-answer-is-nothing",
      heading: "What to do when the honest answer is nothing",
      body: [
        "Sometimes there is no combination. It happens, and forcing it produces a meal nobody wants and food you have now wasted twice.",
        "Two questions settle it. Is there a protein and a starch, or two of either. And is anything about to go off, because if so it is worth cooking even without a plan for eating it: roast the vegetables now and they are a component tomorrow rather than a bin item on Friday.",
        "If the answer is still no, the useful move is to write down what was missing before you shop. The gap you found tonight is the most accurate shopping list you will ever have, and it is gone by tomorrow. Doing that deliberately, once a week, is the [weekly planning routine](/blog/how-to-meal-plan-for-the-week).",
      ],
    },
    {
      id: "how-long-things-actually-keep",
      heading: "Check the clock before you trust the date on the packet",
      body: [
        "This method runs on knowing what is closest to going off, and the printed date is a poor guide. Most of those dates are about quality rather than safety, which the [FDA explains directly on its date-labelling page](https://www.fda.gov/food/consumers/confused-date-labels-packaged-foods).",
        "For actual storage times, the USDA publishes them rather than estimating: the [FoodKeeper storage guide](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app) covers hundreds of foods in the fridge, the freezer and the cupboard. Cooked leftovers get their own guidance in the [USDA's leftovers and food safety page](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety), which is worth reading once and then not guessing about again.",
        "Use those for the edge cases. For everything else, the ordering is enough: fresh and opened first, sealed and dry last.",
      ],
    },
    {
      id: "where-prepwise-fits",
      heading: "Where PrepWise fits, honestly",
      body: [
        "Steps two through four are a skill. You get better at them by cooking, and no software does that part for you. Step one is the part that is genuinely tedious, because answering \"what do I have\" accurately means opening every door, and by the third evening you stop bothering.",
        "That is the part [PrepWise](/) holds. It keeps the pantry, so recipes carry a live availability indicator instead of you cross-checking a list in your head. It reserves ingredients when you plan a meal, so two dinners cannot both claim the same pack of mince. It writes the shopping list as the gap between the week and the shelf. You can load the pantry from a photo of a shelf or a grocery receipt, which is what stops step one rotting.",
        "The [pantry tracking side is a page of its own](/pantry-tracker) if that is the part you care about. PrepWise is on iPhone, it is free to download, and the free tier holds 15 saved recipes and 20 assistant messages a day. The [questions people ask before downloading](/faq) cover the rest.",
      ],
    },
    {
      id: "when-this-does-not-help",
      heading: "When this method is not worth running",
      body: [
        "If you cook the same five meals and you are happy, none of this applies. You are not asking what you can make. You already know, and your shopping list is stable.",
        "It also fails in a kitchen you do not control. In a shared house where food arrives and leaves without a rule, the shelf you surveyed at six is not the shelf at seven, and a method built on knowing what is there does not survive that.",
        "And if you shop for tonight most evenings, this is solving a problem you do not have. The method trades a small amount of thinking for fewer trips. If you like the trips, keep them.",
      ],
    },
  ],

  faqs: [
    {
      question: "What can I make with what I have if I only have eggs and bread?",
      answer:
        "That is a meal, not a shortage. Eggs plus a starch is the frittata and the omelette template, and bread is the starch. Add anything sharp or salty you have, even just mustard or a hard cheese end, and it stops tasting like a compromise.",
    },
    {
      question: "Do recipe-by-ingredient apps actually work?",
      answer:
        "They work if your list is accurate and complete, which is where most of them fall down. Typing in three ingredients gets you recipes that need six more. The useful version reads the whole kitchen rather than the three things you remembered.",
    },
    {
      question: "How do I know which food to cook first?",
      answer:
        "Sort by time left, not by food group. Fresh herbs, opened dairy and bagged salad are on a short clock. Root vegetables, eggs and hard cheese have longer. Dried and tinned goods barely have one, so they are never the reason to cook tonight.",
    },
    {
      question: "Is it worth cooking something I do not want to eat tonight?",
      answer:
        "Often yes, if it is about to go off. Roasted vegetables, a pot of soup, or browned mince keep for days and become the starting point of another meal. Cooking is a way of buying time on food that is running out of it.",
    },
    {
      question: "How do I stop ending up in this situation every week?",
      answer:
        "Plan from the shelf rather than from recipes, so the food you already own is the input instead of an afterthought. The five-step version of that is in our guide to meal planning from your pantry, and it turns this question into a Sunday job rather than a nightly one.",
    },
  ],

  internalLinks: [
    {
      href: "/blog/how-to-meal-plan-from-your-pantry",
      label: "How to meal plan from your pantry",
      note: "The weekly version of this: take stock, pick two anchors, shop for the gap.",
    },
    {
      href: "/pantry-tracker",
      label: "PrepWise pantry tracker",
      note: "Keeping the answer to \"what do I have\" current without opening every door.",
    },
    {
      href: "/faq",
      label: "PrepWise FAQ",
      note: "Pantry, planning, macros, sharing, and billing questions, answered directly.",
    },
  ],
};
