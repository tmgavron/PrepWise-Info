export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Get Started", href: "#cta" },
] as const;

// TODO: Replace with real App Store URL when live
export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL || "#";

export const LEGAL_LINKS = {
  privacy: "https://legal.prepwise.app/privacy",
  terms: "https://legal.prepwise.app/terms",
} as const;

// TODO: Replace with real social URLs
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/prepwise.app",
  tiktok: "https://tiktok.com/@prepwise",
  twitter: "https://x.com/prepwise",
} as const;

// TODO: Replace with real support email
export const SUPPORT_EMAIL = "mailto:support@prepwise.app";

export const FEATURES = [
  {
    icon: "Sparkles" as const,
    title: "AI Meal Planning",
    description:
      "Chat with your AI assistant to plan meals based on what's in your pantry, your macros, and your preferences.",
  },
  {
    icon: "Package" as const,
    title: "Smart Pantry Tracking",
    description:
      "Track every ingredient. PrepWise knows what you have, what's reserved for planned meals, and what you need to buy.",
  },
  {
    icon: "CalendarDays" as const,
    title: "Weekly Meal Calendar",
    description:
      "Drag-and-drop meal scheduling with multi-day event support. See your whole week at a glance.",
  },
  {
    icon: "ShoppingCart" as const,
    title: "Auto Shopping Lists",
    description:
      "Shopping lists generated automatically from your meal plan, adjusted for what's already in your pantry.",
  },
] as const;

export const STEPS = [
  {
    number: 1,
    title: "Add Your Pantry",
    description: "Scan receipts or manually add what you have on hand.",
  },
  {
    number: 2,
    title: "Plan Your Meals",
    description:
      "Let AI suggest recipes or browse by what's available in your kitchen.",
  },
  {
    number: 3,
    title: "Shop & Cook",
    description:
      "Auto-generated shopping lists and step-by-step recipes — ready to go.",
  },
] as const;

export const STATS = [
  { value: "500+", label: "Recipes" },
  { value: "Smart", label: "Macro Tracking" },
  { value: "Offline", label: "Works Anywhere" },
] as const;
