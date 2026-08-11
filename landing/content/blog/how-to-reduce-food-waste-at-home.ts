import type { BlogPost } from "@/lib/blog";
import { OG_IMAGE } from "@/lib/constants";

// Cluster 6 (references/keyword-clusters.md). Primary from Google autocomplete
// 2026-07-26, claimed in references/used-keywords.md #13.
//
// SERP read 2026-07-26. Page one is unusually institution-heavy: EPA
// "Preventing Wasted Food At Home" (~2,800 words, sections on planning,
// storage, cooking, then diversion), FDA "Tips to Reduce Food Waste", Mayo
// Clinic "7 ways", NRDC "Eight tips for home cooks", plus StopWaste, USU
// Extension and UMaine. Topics all of them share: plan and shop with a list,
// store food properly, understand date labels, use up what is near its end, and
// compost the rest. The competitive bar here is CREDIBILITY, not novelty, so
// this page cites and links them rather than competing on statistics we do not
// have. Length target 1,800-2,200 words, inside 20% of their average.
//
// NO WASTE STATISTIC APPEARS ON THIS PAGE. Every ranking page prints one; the
// household-dollar figure is explicitly banned in references/stats.md unless
// sourced directly to USDA or ReFED. We link EPA's numbers instead of quoting
// ours. Composting is named and handed off, because it is a real part of the
// topic and nothing PrepWise knows anything about.
//
// Hero image: the shared social card. Text-first, no invented photography.
export const post: BlogPost = {
  slug: "how-to-reduce-food-waste-at-home",
  title: "How to Reduce Food Waste at Home: Eight Real Changes",
  h1: "How to reduce food waste at home, in eight changes",
  description:
    "How to reduce food waste at home: buy for the week you are having, store food properly, keep an eat-me-first shelf, and cook in the order things go off.",
  ogDescription:
    "Nobody buys spinach intending to bin it. Eight changes that deal with the reason it happens.",
  primaryKeyword: "how to reduce food waste at home",
  secondaryKeywords: [
    "how to stop wasting food at home",
    "how to avoid wasting food",
    "how to stop throwing away food",
    "how to prevent wasting food",
    "food waste app",
  ],
  publishedAt: "2026-07-26",
  updatedAt: "2026-07-26",
  hero: {
    src: OG_IMAGE.url,
    alt: "PrepWise: tracking what is in your kitchen so food gets cooked before it goes off",
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
  },

  intro: [
    "How to reduce food waste at home, in the order that matters: buy for the week you are actually having, store food so it keeps as long as it can, put the things nearest their end where you will see them, and cook in the order food goes off rather than in the order you fancy it. Everything else is a refinement of those four.",
    "Nobody buys spinach intending to throw it out. It gets thrown out because by Thursday nobody remembers it is there. That makes household food waste a memory problem before it is a discipline problem, and memory problems are fixed with systems rather than with resolve.",
  ],

  sections: [
    {
      id: "why-it-happens",
      heading: "Why food gets thrown away, specifically",
      body: [
        "Almost all of it comes from four moments, and none of them is the moment you binned anything.",
        "You bought for a week that did not happen, because nobody looked at the calendar. You bought something you already had, because nobody looked at the cupboard. You stored it in the wrong place, so it had days rather than weeks. Or you simply did not see it, because it was behind something taller.",
        "That is good news, because every one of those is upstream of the bin and fixable at the point it happens. The changes below are ordered by how much they move.",
        "If you want the scale of the problem and where it comes from, the EPA's [preventing wasted food at home guidance](https://www.epa.gov/recycle/preventing-wasted-food-home) has the figures and the sources behind them. Those are their numbers, worth reading directly rather than through a summary.",
      ],
    },
    {
      id: "the-eight",
      heading: "The eight changes, in order of how much they save",
      body: [
        "Do not attempt all eight this week. The first three cover most of it, and a change you keep beats a system you abandon.",
      ],
      list: {
        ordered: true,
        items: [
          "Buy for the week you are actually having, not a notional one.",
          "Check what you already own before you write the list.",
          "Store things where they last longest, not where they fit.",
          "Learn what the printed date actually means.",
          "Keep an eat-me-first shelf at eye level.",
          "Cook in clock order rather than in order of preference.",
          "Freeze on the day you notice, not the day it turns.",
          "Watch the bin for two weeks and change one thing.",
        ],
      },
    },
    {
      id: "buy-for-the-real-week",
      heading: "Buy for the week you are actually having",
      body: [
        "Open the calendar before the recipe app. Count the evenings you will genuinely cook, subtract the nights someone is out or getting home late, and plan one or two fewer meals than that number.",
        "Ingredients bought for a night that never happens are the most reliable waste in any household, and the plan is what generated them. This is not about buying less food in general. It is about buying food for real evenings.",
        "The same logic applies to fresh produce quantities. Two people rarely finish a bag of salad, and buying the bag because it is better value is how the value gets thrown away.",
      ],
    },
    {
      id: "check-what-you-own",
      heading: "Check what you already own before the list exists",
      body: [
        "Write the shopping list by subtraction: everything the plan needs, minus everything the shelf already holds. Written in that order the list is short, and the duplicate buy disappears.",
        "The freezer is where this matters most, because it is the part of the kitchen you cannot see. Food goes in there to be safe and stays there to be forgotten. Anything you cannot name without opening the door is a candidate for this week.",
        "Doing this by hand takes twenty minutes the first time and five after that. It is also the step that decays fastest, which is why a [pantry you do not have to re-survey](/pantry-tracker) is the part worth automating if you are going to automate anything.",
      ],
    },
    {
      id: "store-it-properly",
      heading: "Store things where they last longest, not where they fit",
      body: [
        "Storage buys days, sometimes weeks, for free. Herbs in water rather than in a bag. Bread in the freezer rather than the fridge, where it goes stale faster. Onions and potatoes apart rather than in the same basket. Berries dry and unwashed until you eat them.",
        "There are too many of these to memorise and no reason to. The USDA publishes real storage times instead of guesses, and the [FoodKeeper storage guide](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app) covers hundreds of foods across the fridge, the freezer and the cupboard. Look up the four or five things you buy every week, once.",
        "One rule does most of the work on its own: first in, first out. New shopping goes behind what is already there, not in front of it. Nothing else in this post costs less to implement.",
      ],
    },
    {
      id: "what-the-date-means",
      heading: "Learn what the date on the packet actually means",
      body: [
        "A large amount of edible food is binned on the strength of a date that was never about safety. Most of those labels are the manufacturer's estimate of peak quality, not a point at which food becomes unsafe.",
        "The FDA sets this out plainly on its [date-labelling page](https://www.fda.gov/food/consumers/confused-date-labels-packaged-foods), which is worth reading once and then not guessing about again. Infant formula is the notable exception, and the page says so.",
        "This is not a licence to ignore dates. It is a reason to look at the food. Something a day past its printed date and obviously fine is different from something with a use-by date that has passed, and the two get treated the same by most kitchens.",
      ],
    },
    {
      id: "eat-me-first",
      heading: "Keep an eat-me-first shelf at eye level",
      body: [
        "The single highest-return piece of furniture rearrangement available. Pick one shelf, or one box on a shelf, at the height you look first. Anything within a few days of its end goes there.",
        "It works because it converts a memory task into a visual one. Nobody has to remember the half pack of mushrooms. It is at eye level, in the box, and the question at six o'clock answers itself.",
        "Households with more than one cook benefit most, because the shelf is a message. It says these are the things to use, without anyone having to say it.",
      ],
    },
    {
      id: "cook-the-clock",
      heading: "Cook in clock order, and cook things you are not eating tonight",
      body: [
        "Order the week's meals by how long each ingredient has left rather than by what you fancy on which day. Bagged salad, opened dairy and fresh herbs early. Sealed meat, root vegetables and eggs later. Dried and tinned goods never need a day at all.",
        "Then the move most people miss: when something is about to go over and it is not on tonight's plan, cook it anyway. Roasted vegetables, a pot of soup, browned mince and stewed fruit all keep for days once cooked, and all of them become the start of another meal.",
        "Cooking is how you buy time on food that is running out of it. A tray of vegetables roasted on Wednesday is a component on Friday. The same vegetables left raw are a bin item.",
        "If the problem is that you cannot see what those things add up to, that is its own question with its own answer: [what can I make with what I have](/blog/what-can-i-make-with-what-i-have) is the four-step version.",
      ],
    },
    {
      id: "freeze-on-the-day-you-notice",
      heading: "Freeze on the day you notice, not the day it turns",
      body: [
        "The freezer only works as a save if you use it early. Food frozen on the day you realise you will not get to it comes out fine. Food frozen on its last evening comes out as something nobody wants.",
        "Freeze in portions you will actually use, and label them with what and when. An unlabelled bag is a future bin item with extra steps, because nobody defrosts a mystery on a Tuesday.",
        "Bread, milk, grated cheese, cooked rice, herbs in oil, and most cooked meals all freeze well. Check anything you are unsure about in the FoodKeeper guide rather than experimenting with a whole pack.",
      ],
    },
    {
      id: "measure-the-bin",
      heading: "Watch the bin for two weeks, then change one thing",
      body: [
        "Everyone has a theory about what they waste and most of the theories are wrong, which is why generic advice so often misses. The fix is embarrassingly cheap: a note on the fridge for a fortnight, and the name of anything that goes in the bin. Not weights. Names.",
        "Two weeks is enough for the pattern to show, and it is almost always three or four repeat offenders rather than everything equally. Bagged salad, milk, and bread are the usual suspects, but yours may not be.",
        "Then change one thing about the top item. Buy half as much, buy it frozen, or plan the meal that uses it earlier in the week. One measured change beats eight unmeasured ones, and you will believe this one because you collected the data.",
      ],
    },
    {
      id: "where-prepwise-fits",
      heading: "Where PrepWise fits, honestly",
      body: [
        "Nothing above requires software, and several of the changes are furniture and habits that no app can do for you. The eat-me-first shelf is a shelf.",
        "The parts that decay are knowing what is in the kitchen and remembering what is near its end, and those are the parts [PrepWise](/) holds. It keeps the pantry so recipes carry a live availability indicator, reserves ingredients when you plan a meal so two dinners cannot claim the same food, and writes the shopping list as the gap between your plan and your shelf, which is what stops the duplicate buy. The pantry can be loaded from a photo of a shelf or a grocery receipt rather than typed in.",
        "The [pantry tracking side](/pantry-tracker) and the [shopping list side](/grocery-list-app) each have a page. PrepWise is on iPhone, free to download, and the free tier holds 15 saved recipes and 20 assistant messages a day.",
      ],
    },
    {
      id: "what-this-does-not-cover",
      heading: "What this does not cover, and who it will not help",
      body: [
        "Composting is a real part of reducing household waste and none of it is here, because it is about what happens after the food is beyond eating and this page is about getting there less often. The EPA guidance linked above covers composting and local collection properly.",
        "If your household already throws away almost nothing, there is little to gain from this list and the remaining waste is probably peel and bone, which is a composting question rather than a planning one.",
        "And if you buy food most days for that evening, several of these changes do not apply to you. Shopping daily is itself a low-waste strategy. It costs trips instead, which is a trade some people are happy with.",
      ],
    },
  ],

  faqs: [
    {
      question: "What causes the most food waste at home?",
      answer:
        "Buying for a week that does not happen, and forgetting what you already have. Both occur before anything is thrown away, which is why they are the two worth fixing first. Storage mistakes come third.",
    },
    {
      question: "Does the date on the packet mean the food is unsafe?",
      answer:
        "Usually not. Most date labels are the manufacturer's estimate of peak quality rather than a safety cutoff, which the FDA explains directly on its date-labelling page. Use-by dates on certain products are different, and infant formula is a specific exception.",
    },
    {
      question: "What is the eat-me-first shelf?",
      answer:
        "One shelf or box at eye level holding everything within a few days of its end. It turns remembering into seeing, which is why it works. In a household with more than one cook it also communicates without anyone having to.",
    },
    {
      question: "Is it better to buy frozen vegetables to avoid waste?",
      answer:
        "For anything you cook, usually yes. Nothing in the freezer wilts by Thursday, so the portion you use is the portion you paid for. Fresh is worth it for the things you eat raw and will finish quickly.",
    },
    {
      question: "Can an app reduce food waste?",
      answer:
        "It can hold the two things that decay fastest: an accurate list of what is in the kitchen and a note of what is nearest its end. It cannot make you cook. The shelf, the storage and the habit are still yours.",
    },
    {
      question: "How do I stop buying food I already have?",
      answer:
        "Write the shopping list as the gap: everything the plan needs, minus everything already on the shelf. The duplicate buy is a symptom of writing the list from recipes without opening a cupboard.",
    },
  ],

  internalLinks: [
    {
      href: "/pantry-tracker",
      label: "PrepWise pantry tracker",
      note: "Knowing what is in the kitchen without re-surveying it every week.",
    },
    {
      href: "/blog/how-to-meal-plan-on-a-budget",
      label: "How to meal plan on a budget",
      note: "The same problem counted as money: duplicate buys and food never cooked.",
    },
    {
      href: "/blog/how-to-meal-plan-from-your-pantry",
      label: "How to meal plan from your pantry",
      note: "Planning that starts from the shelf, so the food you own gets used first.",
    },
  ],
};
