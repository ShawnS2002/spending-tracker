export const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
export const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const STORAGE_KEY_SPACES = "spaces_index";
export const STORAGE_KEY_GLOBAL_SETTINGS = "global_settings";
export const spaceDataKey = (spaceId, name) => `space:${spaceId}:${name}`;

export const ICONS_MAP = null; // resolved in components/Icon.jsx to avoid circular imports

export const THEMES = {
  household: {
    id: "household", label: "Household", icon: "Home",
    blurb: "Shared family or roommate spending",
    categoryPool: [
      { id: "groceries", name: "Groceries", icon: "ShoppingCart" },
      { id: "dining", name: "Dining out", icon: "UtensilsCrossed" },
      { id: "transport", name: "Transport", icon: "Car" },
      { id: "bills", name: "Bills & utilities", icon: "Zap" },
      { id: "rent", name: "Rent / mortgage", icon: "Home" },
      { id: "healthcare", name: "Healthcare", icon: "HeartPulse" },
      { id: "insurance", name: "Insurance", icon: "Shield" },
      { id: "subscriptions", name: "Subscriptions", icon: "Repeat" },
      { id: "maintenance", name: "Home & maintenance", icon: "Wrench" },
      { id: "education", name: "Kids & education", icon: "GraduationCap" },
      { id: "pets", name: "Pets", icon: "PawPrint" },
      { id: "personalcare", name: "Personal care", icon: "Sparkle" },
      { id: "entertainment", name: "Entertainment", icon: "Gift" },
      { id: "shopping", name: "Shopping", icon: "ShoppingBag" },
      { id: "savings", name: "Savings", icon: "PiggyBank" },
      { id: "other", name: "Other", icon: "MoreHorizontal" },
    ],
    defaultSelected: ["groceries", "dining", "transport", "bills", "other"],
  },
  trip: {
    id: "trip", label: "Trip", icon: "Plane",
    blurb: "A vacation or travel budget",
    categoryPool: [
      { id: "flights", name: "Flights", icon: "Plane" },
      { id: "accommodation", name: "Accommodation", icon: "Hotel" },
      { id: "localtransport", name: "Local transport", icon: "Car" },
      { id: "food", name: "Food & drink", icon: "UtensilsCrossed" },
      { id: "activities", name: "Activities & tours", icon: "Map" },
      { id: "shopping", name: "Shopping & souvenirs", icon: "ShoppingBag" },
      { id: "travelinsurance", name: "Travel insurance", icon: "Shield" },
      { id: "visas", name: "Visas & documents", icon: "FileText" },
      { id: "carrental", name: "Car rental", icon: "Car" },
      { id: "other", name: "Other", icon: "MoreHorizontal" },
    ],
    defaultSelected: ["flights", "accommodation", "food", "activities", "other"],
  },
  business: {
    id: "business", label: "Business", icon: "Briefcase",
    blurb: "Freelance or small business expenses",
    categoryPool: [
      { id: "software", name: "Software & tools", icon: "Laptop" },
      { id: "officesupplies", name: "Office supplies", icon: "Package" },
      { id: "clienttravel", name: "Travel & client visits", icon: "Plane" },
      { id: "marketing", name: "Marketing", icon: "Megaphone" },
      { id: "contractors", name: "Contractors & freelancers", icon: "Users" },
      { id: "professional", name: "Professional services", icon: "Scale" },
      { id: "equipment", name: "Equipment", icon: "Package" },
      { id: "mealsent", name: "Meals & entertainment", icon: "UtensilsCrossed" },
      { id: "taxes", name: "Taxes", icon: "Receipt" },
      { id: "rentutil", name: "Rent & utilities", icon: "Zap" },
      { id: "other", name: "Other", icon: "MoreHorizontal" },
    ],
    defaultSelected: ["software", "marketing", "contractors", "equipment", "other"],
  },
  custom: {
    id: "custom", label: "Custom", icon: "Sparkles",
    blurb: "Start from scratch, build your own",
    categoryPool: [
      { id: "other", name: "Other", icon: "MoreHorizontal" },
    ],
    defaultSelected: ["other"],
  },
};

export const CURATED_CURRENCIES = [
  "USD", "EUR", "GBP", "ILS", "JPY", "CAD", "AUD", "CHF", "CNY", "INR",
  "MXN", "BRL", "SGD", "HKD", "NZD", "SEK", "NOK", "DKK", "PLN", "ZAR",
  "AED", "THB", "TRY", "KRW",
];

export const CURRENCY_NAMES = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound", ILS: "Israeli Shekel",
  JPY: "Japanese Yen", CAD: "Canadian Dollar", AUD: "Australian Dollar",
  CHF: "Swiss Franc", CNY: "Chinese Yuan", INR: "Indian Rupee",
  MXN: "Mexican Peso", BRL: "Brazilian Real", SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar", NZD: "New Zealand Dollar", SEK: "Swedish Krona",
  NOK: "Norwegian Krone", DKK: "Danish Krone", PLN: "Polish Złoty",
  ZAR: "South African Rand", AED: "UAE Dirham", THB: "Thai Baht",
  TRY: "Turkish Lira", KRW: "South Korean Won",
};
