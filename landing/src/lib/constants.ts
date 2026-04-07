export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Get Started", href: "#cta" },
] as const;

// TODO: Replace with real App Store URL when live
export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL || "#";

export const LEGAL_LINKS = {
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/prepwiseapp/",
  tiktok: "https://www.tiktok.com/@prepwiseapp",
  twitter: "https://x.com/PrepWiseApp",
} as const;

export const SUPPORT_EMAIL = "mailto:support@prepwise-app.com";

export const FEATURES = [
  {
    icon: "Sparkles" as const,
    title: "Recipes That Match Your Reality",
    description:
      "Every recipe shows a real-time availability indicator. Green means you have everything. You'll always know what you can cook tonight — not just what you wish you could.",
  },
  {
    icon: "Package" as const,
    title: "Your Kitchen, Perfectly Organized",
    description:
      "Track every ingredient. PrepWise reserves ingredients for planned meals so you never accidentally double-book your last chicken breast. When it's time to shop, your list is already written.",
  },
  {
    icon: "CalendarDays" as const,
    title: "AI That Actually Helps",
    description:
      'Ask PrepWise to "make a high-protein dinner with the chicken and sweet potatoes in my pantry" and it delivers. Custom recipes, full-week plans, and pantry suggestions — voice-powered.',
  },
  {
    icon: "ShoppingCart" as const,
    title: "Macros Without the Math",
    description:
      "Every recipe automatically calculates calories, protein, carbs, and fat. Nutrition tracking is built into your meal planning process — not bolted on as an afterthought.",
  },
] as const;

export const STEPS = [
  {
    number: 1,
    title: "Track Your Pantry",
    description:
      "Snap a grocery receipt and your pantry updates automatically — or add ingredients manually in seconds.",
  },
  {
    number: 2,
    title: "Plan Your Meals",
    description:
      "Browse recipes filtered by what's in your kitchen right now, or ask the AI to build your full week in seconds.",
  },
  {
    number: 3,
    title: "Shop & Cook",
    description:
      "Your shopping list writes itself — only what you actually need, based on your meal plan and what's already in your pantry.",
  },
] as const;

export const STATS = [
  { value: "Real-Time", label: "Recipe Availability" },
  { value: "Automatic", label: "Macro Tracking" },
  { value: "Offline", label: "Works Anywhere" },
] as const;
