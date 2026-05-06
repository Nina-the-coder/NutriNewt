import { InventoryItem } from "../types/models";

export const DEFAULT_FOODS = [
  // ☕ DRINKS
  { name: "tea", keywords: ["chai", "chay", "chaii", "tea", "tee"] },
  { name: "coffee", keywords: ["coffee", "cofee", "kapi", "kaapi"] },
  { name: "milk", keywords: ["milk", "doodh", "dudh"] },
  { name: "lassi", keywords: ["lassi", "lassy"] },

  // 🍚 RICE & CARBS
  { name: "rice", keywords: ["rice", "chawal", "chaval", "chaawal"] },
  { name: "brown rice", keywords: ["brown rice"] },
  { name: "jeera rice", keywords: ["jeera rice", "jeera chawal"] },
  { name: "fried rice", keywords: ["fried rice"] },
  { name: "biryani", keywords: ["biryani", "biriyani", "biryanee"] },
  { name: "poha", keywords: ["poha"] },
  { name: "upma", keywords: ["upma"] },

  // 🫓 BREAD TYPES
  { name: "roti", keywords: ["roti", "chapati", "chapatti", "phulka"] },
  { name: "bread", keywords: ["bread", "slice", "loaf"] },
  { name: "naan", keywords: ["naan"] },
  { name: "paratha", keywords: ["paratha", "parantha"] },
  { name: "aloo paratha", keywords: ["aloo paratha", "potato paratha"] },

  // 🥚 PROTEIN
  { name: "egg", keywords: ["egg", "anda", "eggs"] },
  { name: "egg white", keywords: ["egg white"] },
  { name: "omelette", keywords: ["omelette", "omlet", "omelet"] },
  { name: "paneer", keywords: ["paneer", "cottage cheese"] },
  { name: "tofu", keywords: ["tofu"] },
  { name: "chicken", keywords: ["chicken", "murga"] },
  { name: "fish", keywords: ["fish", "machli"] },

  // 🥛 DAIRY
  { name: "curd", keywords: ["curd", "dahi", "yogurt", "yoghurt"] },
  { name: "cheese", keywords: ["cheese"] },
  { name: "butter", keywords: ["butter", "makhan"] },

  // 🥔 VEGGIES
  { name: "potato", keywords: ["potato", "aloo", "aalu", "aalo"] },
  { name: "onion", keywords: ["onion", "pyaz", "pyaaz", "kaanda"] },
  { name: "tomato", keywords: ["tomato", "tamatar"] },
  { name: "bhindi", keywords: ["bhindi", "okra"] },
  { name: "mix veg", keywords: ["mix veg", "mixed vegetables"] },

  // 🍎 FRUITS
  { name: "banana", keywords: ["banana", "kela"] },
  { name: "apple", keywords: ["apple", "seb"] },
  { name: "orange", keywords: ["orange", "santra"] },

  // 🥜 FATS
  { name: "peanut butter", keywords: ["peanut butter"] },
  { name: "almonds", keywords: ["almonds", "badam"] },

  // 🍛 INDIAN DISHES
  { name: "rajma", keywords: ["rajma"] },
  { name: "chole", keywords: ["chole", "chhole", "chana masala"] },
  { name: "dal", keywords: ["dal", "daal", "lentils"] },
  { name: "dal makhani", keywords: ["dal makhani"] },
  { name: "dal tadka", keywords: ["dal tadka"] },
  { name: "khichdi", keywords: ["khichdi", "khichri"] },

  // 🥪 QUICK FOOD
  { name: "sandwich", keywords: ["sandwich"] },
  { name: "burger", keywords: ["burger"] },
  { name: "pizza", keywords: ["pizza"] },
  { name: "maggi", keywords: ["maggi", "noodles"] },
  { name: "pasta", keywords: ["pasta"] },

  // 🥞 BREAKFAST
  { name: "idli", keywords: ["idli"] },
  { name: "dosa", keywords: ["dosa"] },
  { name: "masala dosa", keywords: ["masala dosa"] },
  { name: "pancakes", keywords: ["pancake", "pancakes"] },
  { name: "cornflakes", keywords: ["cornflakes"] },
  { name: "muesli", keywords: ["muesli"] },

  // 🍟 SNACKS
  { name: "samosa", keywords: ["samosa"] },
  { name: "kachori", keywords: ["kachori"] },
  { name: "pakora", keywords: ["pakoda", "pakora"] },
  { name: "fries", keywords: ["fries", "french fries"] },
  { name: "momos", keywords: ["momos"] },
  { name: "bhel puri", keywords: ["bhel puri"] },
  { name: "pani puri", keywords: ["golgappa", "pani puri"] },

  // 🍫 SWEETS
  { name: "chocolate", keywords: ["chocolate"] },
  { name: "ice cream", keywords: ["icecream", "ice cream"] },

  // 🛢️ BASICS
  { name: "oil", keywords: ["oil", "tel"] },
];

// -------------------------------------------------------------------------
const WORD_MAP: Record<string, string> = {};

DEFAULT_FOODS.forEach(food => {
  const canonical = food.name.toLowerCase();

  WORD_MAP[canonical] = canonical;

  food.keywords.forEach(keyword => {
    WORD_MAP[keyword.toLowerCase()] = canonical;
  });
});

export function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function resolveWord(word: string): string {
  return WORD_MAP[word] || word;
}

// ------------------------------
// 🔥 RESOLVE PHRASE
// ------------------------------

export function resolvePhrase(input: string): string {
  return normalize(input)
    .split(" ")
    .map(resolveWord)
    .join(" ");
}

// ------------------------------
// 🔥 SIMPLE FUZZY MATCH
// (No library needed)
// ------------------------------

function isFuzzyMatch(a: string, b: string): boolean {
  if (a.includes(b) || b.includes(a)) return true;

  // basic typo tolerance (1 char diff)
  let mismatches = 0;
  const minLen = Math.min(a.length, b.length);

  for (let i = 0; i < minLen; i++) {
    if (a[i] !== b[i]) mismatches++;
    if (mismatches > 1) return false;
  }

  return true;
}

// ------------------------------
// 🔍 MAIN SEARCH FUNCTION
// ------------------------------

// ------------------------------
// ⚡ PREPROCESS INVENTORY (CORE OPTIMIZATION)
// ------------------------------

export function preprocessInventory(inventory: InventoryItem[]) {
  return inventory.map(item => ({
    ...item,
    __normalizedName: normalize(item.name),
    __resolvedName: resolvePhrase(item.name),
  }));
}

// ------------------------------
// 🔍 FAST SEARCH FUNCTION
// ------------------------------

export function searchInventory(
  processedInventory: (InventoryItem & {
    __normalizedName: string;
    __resolvedName: string;
  })[],
  input: string
): InventoryItem[] {
  const normalizedInput = normalize(input);
  const resolvedInput = resolvePhrase(input);

  return processedInventory.filter(item => {
    return (
      // 🔥 resolved match
      item.__resolvedName.includes(resolvedInput) ||

      // 🔥 direct match
      item.__normalizedName.includes(normalizedInput)
    );
  });
}

// ------------------------------
// ➕ FIND SIMILAR ITEMS (FAST)
// ------------------------------

export function findSimilarItems(
  processedInventory: (InventoryItem & {
    __resolvedName: string;
  })[],
  input: string
): InventoryItem[] {
  const resolvedInput = resolvePhrase(input);

  return processedInventory.filter(item => {
    return item.__resolvedName === resolvedInput;
  });
}
