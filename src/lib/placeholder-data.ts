import type { IRecipeDto, IRecipeAuthor } from '@/interfaces/IRecipe';

const AUTHORS: Record<string, IRecipeAuthor> = {
  u1: { username: 'alex_cooks', displayName: 'Alex', avatarUrl: null },
  u2: { username: 'julia_eats', displayName: 'Julia', avatarUrl: null },
  u3: { username: 'priya_kitchen', displayName: 'Priya', avatarUrl: null },
};

export const PLACEHOLDER_RECIPES: IRecipeDto[] = [
  {
    id: 'r1',
    title: 'Spaghetti Bolognese',
    description: 'A rich, slow-cooked Italian meat sauce served over al dente spaghetti.',
    category: 2, // Dinner
    tags: [5, 9], // High-protein, Kid-friendly
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    servings: 4,
    imageUrl: null,
    userId: 'u1',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u1,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
    ingredients: [
      { name: 'spaghetti', amount: 400, unit: 3 },
      { name: 'ground beef', amount: 500, unit: 3 },
      { name: 'tomato passata', amount: 2, unit: 2 },
      { name: 'onion', amount: 1, unit: 10 },
      { name: 'garlic cloves', amount: 3, unit: 13 },
      { name: 'olive oil', amount: 2, unit: 0 },
    ],
    instructions: [
      {
        stepNumber: 1,
        text: 'Heat olive oil in a large pan over medium heat. Add finely diced onion and cook for 5 minutes until softened.',
      },
      { stepNumber: 2, text: 'Add minced garlic and cook for 1 minute until fragrant.' },
      { stepNumber: 3, text: 'Add ground beef and cook, breaking it up, until browned all over.' },
      {
        stepNumber: 4,
        text: 'Pour in the tomato passata, season with salt and pepper, and simmer on low for 30 minutes.',
      },
      {
        stepNumber: 5,
        text: 'Cook spaghetti according to package instructions. Drain and serve topped with the bolognese sauce.',
      },
    ],
  },
  {
    id: 'r2',
    title: 'Avocado Toast with Poached Egg',
    description:
      'Creamy mashed avocado on sourdough with a perfectly poached egg and chilli flakes.',
    category: 0, // Breakfast
    tags: [0, 10], // Vegetarian, Healthy
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 1,
    imageUrl: null,
    userId: 'u1',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u1,
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-01-15T08:30:00Z',
    ingredients: [
      { name: 'sourdough bread', amount: 2, unit: 12 },
      { name: 'ripe avocado', amount: 1, unit: 10 },
      { name: 'egg', amount: 1, unit: 10 },
      { name: 'lemon juice', amount: 1, unit: 1 },
      { name: 'chilli flakes', amount: 1, unit: 11 },
    ],
    instructions: [
      { stepNumber: 1, text: 'Toast the sourdough until golden and crisp.' },
      { stepNumber: 2, text: 'Mash avocado with lemon juice, salt, and pepper.' },
      {
        stepNumber: 3,
        text: 'Bring a pot of water to a gentle simmer. Crack the egg into a cup, swirl the water and drop in the egg. Poach for 3 minutes.',
      },
      {
        stepNumber: 4,
        text: 'Spread avocado on toast, top with the poached egg, and sprinkle chilli flakes.',
      },
    ],
  },
  {
    id: 'r3',
    title: 'Chocolate Lava Cake',
    description:
      'Individual warm chocolate cakes with a gooey molten centre — best served with vanilla ice cream.',
    category: 3, // Dessert
    tags: [7], // Sweet
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    servings: 2,
    imageUrl: null,
    userId: 'u2',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u2,
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z',
    ingredients: [
      { name: 'dark chocolate', amount: 100, unit: 3 },
      { name: 'butter', amount: 80, unit: 3 },
      { name: 'eggs', amount: 2, unit: 10 },
      { name: 'caster sugar', amount: 60, unit: 3 },
      { name: 'plain flour', amount: 30, unit: 3 },
    ],
    instructions: [
      {
        stepNumber: 1,
        text: 'Preheat oven to 200°C. Butter two ramekins and dust with cocoa powder.',
      },
      {
        stepNumber: 2,
        text: 'Melt chocolate and butter together in a heatproof bowl over simmering water. Stir until smooth.',
      },
      {
        stepNumber: 3,
        text: 'Whisk eggs and sugar until pale, then fold in the chocolate mixture and flour.',
      },
      {
        stepNumber: 4,
        text: 'Pour into ramekins and bake for 12 minutes. The edges should be set but the centre should wobble.',
      },
      {
        stepNumber: 5,
        text: 'Run a knife around the edge and invert onto a plate. Serve immediately.',
      },
    ],
  },
  {
    id: 'r4',
    title: 'Chicken Caesar Salad',
    description:
      'Crisp romaine lettuce, grilled chicken, parmesan shavings, and croutons in a classic Caesar dressing.',
    category: 7, // Salad
    tags: [5, 10], // High-protein, Healthy
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    imageUrl: null,
    userId: 'u2',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u2,
    createdAt: '2026-01-25T12:00:00Z',
    updatedAt: '2026-01-25T12:00:00Z',
    ingredients: [
      { name: 'romaine lettuce', amount: 1, unit: 10 },
      { name: 'chicken breast', amount: 300, unit: 3 },
      { name: 'parmesan', amount: 40, unit: 3 },
      { name: 'sourdough croutons', amount: 1, unit: 2 },
      { name: 'Caesar dressing', amount: 3, unit: 0 },
    ],
    instructions: [
      {
        stepNumber: 1,
        text: 'Season chicken breast with salt, pepper, and olive oil. Grill for 6–7 minutes per side.',
      },
      { stepNumber: 2, text: 'Let chicken rest for 5 minutes, then slice thinly.' },
      { stepNumber: 3, text: 'Tear romaine into large pieces and toss with Caesar dressing.' },
      { stepNumber: 4, text: 'Top with chicken slices, croutons, and parmesan shavings.' },
    ],
  },
  {
    id: 'r5',
    title: 'Vegetable Thai Green Curry',
    description:
      'Fragrant coconut milk curry packed with seasonal vegetables and aromatic Thai green paste.',
    category: 2, // Dinner
    tags: [0, 1, 6], // Vegetarian, Vegan, Spicy
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    servings: 4,
    imageUrl: null,
    userId: 'u1',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u1,
    createdAt: '2026-02-01T18:00:00Z',
    updatedAt: '2026-02-01T18:00:00Z',
    ingredients: [
      { name: 'coconut milk', amount: 400, unit: 6 },
      { name: 'Thai green curry paste', amount: 2, unit: 0 },
      { name: 'courgette', amount: 1, unit: 10 },
      { name: 'bell pepper', amount: 2, unit: 10 },
      { name: 'spinach', amount: 100, unit: 3 },
      { name: 'jasmine rice', amount: 2, unit: 2 },
    ],
    instructions: [
      {
        stepNumber: 1,
        text: 'Heat a wok or large pan over high heat. Add curry paste and fry for 1 minute until fragrant.',
      },
      { stepNumber: 2, text: 'Pour in coconut milk and bring to a simmer.' },
      { stepNumber: 3, text: 'Add courgette and pepper. Cook for 10 minutes.' },
      { stepNumber: 4, text: 'Stir in spinach and cook for 2 more minutes.' },
      { stepNumber: 5, text: 'Serve over steamed jasmine rice.' },
    ],
  },
  {
    id: 'r6',
    title: 'Blueberry Banana Smoothie',
    description: 'A thick, creamy smoothie loaded with antioxidants — ready in under 5 minutes.',
    category: 9, // Beverage
    tags: [0, 1, 8, 10], // Vegetarian, Vegan, Quick, Healthy
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    imageUrl: null,
    userId: 'u3',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u3,
    createdAt: '2026-02-05T07:00:00Z',
    updatedAt: '2026-02-05T07:00:00Z',
    ingredients: [
      { name: 'frozen blueberries', amount: 1, unit: 2 },
      { name: 'banana', amount: 1, unit: 10 },
      { name: 'almond milk', amount: 250, unit: 6 },
      { name: 'chia seeds', amount: 1, unit: 0 },
    ],
    instructions: [
      { stepNumber: 1, text: 'Add all ingredients to a blender.' },
      { stepNumber: 2, text: 'Blend on high for 60 seconds until completely smooth.' },
      { stepNumber: 3, text: 'Pour into a glass and serve immediately.' },
    ],
  },
  {
    id: 'r7',
    title: 'Hummus with Roasted Red Pepper',
    description:
      'Silky smooth homemade hummus topped with smoky roasted red pepper and a drizzle of olive oil.',
    category: 5, // Appetizer
    tags: [0, 1, 2, 3, 10], // Vegetarian, Vegan, Gluten-free, Dairy-free, Healthy
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    servings: 6,
    imageUrl: null,
    userId: 'u3',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u3,
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
    ingredients: [
      { name: 'chickpeas', amount: 400, unit: 3 },
      { name: 'tahini', amount: 3, unit: 0 },
      { name: 'lemon juice', amount: 2, unit: 0 },
      { name: 'garlic clove', amount: 1, unit: 13 },
      { name: 'roasted red pepper', amount: 1, unit: 10 },
      { name: 'olive oil', amount: 2, unit: 0 },
    ],
    instructions: [
      { stepNumber: 1, text: 'Drain and rinse chickpeas. Reserve a few for garnish.' },
      {
        stepNumber: 2,
        text: 'Blend chickpeas, tahini, lemon juice, and garlic until smooth. Add 2–3 tbsp ice water while blending.',
      },
      { stepNumber: 3, text: 'Season with salt and pepper.' },
      {
        stepNumber: 4,
        text: 'Spread into a bowl, top with sliced roasted pepper and a drizzle of olive oil.',
      },
    ],
  },
  {
    id: 'r8',
    title: 'Classic French Onion Soup',
    description:
      'Deep, caramelised onion broth topped with a toasted baguette crouton and melted Gruyère cheese.',
    category: 6, // Soup
    tags: [0], // Vegetarian
    prepTimeMinutes: 10,
    cookTimeMinutes: 60,
    servings: 4,
    imageUrl: null,
    userId: 'u2',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u2,
    createdAt: '2026-02-14T17:00:00Z',
    updatedAt: '2026-02-14T17:00:00Z',
    ingredients: [
      { name: 'brown onions', amount: 6, unit: 10 },
      { name: 'butter', amount: 50, unit: 3 },
      { name: 'vegetable stock', amount: 1, unit: 7 },
      { name: 'baguette slices', amount: 4, unit: 12 },
      { name: 'Gruyère cheese', amount: 100, unit: 3 },
      { name: 'dry white wine', amount: 100, unit: 6 },
    ],
    instructions: [
      {
        stepNumber: 1,
        text: 'Slice onions thinly. Melt butter in a large pot over low heat and add onions with a pinch of salt.',
      },
      {
        stepNumber: 2,
        text: 'Cook onions slowly, stirring occasionally, for 40–45 minutes until deeply caramelised and golden.',
      },
      {
        stepNumber: 3,
        text: 'Add wine and cook for 2 minutes, then pour in stock. Simmer for 15 minutes.',
      },
      {
        stepNumber: 4,
        text: 'Ladle into oven-safe bowls. Top each with a baguette slice and grated Gruyère.',
      },
      {
        stepNumber: 5,
        text: 'Grill under a broiler for 3–4 minutes until the cheese is bubbling and golden.',
      },
    ],
  },
  {
    id: 'r9',
    title: 'Peanut Butter Energy Balls',
    description:
      'No-bake oat and peanut butter balls rolled in coconut — the perfect pre-workout snack.',
    category: 4, // Snack
    tags: [0, 8, 9], // Vegetarian, Quick, Kid-friendly
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    servings: 12,
    imageUrl: null,
    userId: 'u3',
    visibility: 'PUBLIC' as const,
    author: AUTHORS.u3,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
    ingredients: [
      { name: 'rolled oats', amount: 1, unit: 2 },
      { name: 'peanut butter', amount: 0.5, unit: 2 },
      { name: 'honey', amount: 3, unit: 0 },
      { name: 'desiccated coconut', amount: 4, unit: 0 },
      { name: 'chocolate chips', amount: 4, unit: 0 },
    ],
    instructions: [
      {
        stepNumber: 1,
        text: 'Mix oats, peanut butter, honey, and chocolate chips together in a bowl until well combined.',
      },
      { stepNumber: 2, text: 'Refrigerate the mixture for 30 minutes to firm up.' },
      { stepNumber: 3, text: 'Roll into balls roughly the size of a golf ball.' },
      {
        stepNumber: 4,
        text: 'Roll each ball in desiccated coconut and place on a lined tray. Refrigerate for 1 hour before serving.',
      },
    ],
  },
];

export interface IPlaceholderProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  recipeCount: number;
  friendCount: number;
  importedCount: number;
}

export const PLACEHOLDER_PROFILE: IPlaceholderProfile = {
  username: 'alex_cooks',
  displayName: 'Alex',
  bio: 'Home cook & food lover. Always experimenting with new flavours.',
  avatarUrl: null,
  recipeCount: 9,
  friendCount: 34,
  importedCount: 5,
};

export interface IPlaceholderFriend {
  username: string;
  displayName: string;
  recipeCount: number;
  avatarUrl: string | null;
}

export const PLACEHOLDER_FRIENDS: IPlaceholderFriend[] = [
  { username: 'julia_eats', displayName: 'Julia', recipeCount: 8, avatarUrl: null },
  { username: 'marcelo_chef', displayName: 'Marcelo', recipeCount: 22, avatarUrl: null },
  { username: 'priya_kitchen', displayName: 'Priya', recipeCount: 15, avatarUrl: null },
  { username: 'tom_cooks', displayName: 'Tom', recipeCount: 4, avatarUrl: null },
];

export interface IPlaceholderRequest {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export const PLACEHOLDER_FRIEND_REQUESTS: IPlaceholderRequest[] = [
  { username: 'sarah_b', displayName: 'Sarah B.', avatarUrl: null },
];

export const PLACEHOLDER_SENT_REQUESTS: IPlaceholderRequest[] = [
  { username: 'tommy_c', displayName: 'Tommy C.', avatarUrl: null },
];

export interface IPlaceholderNotification {
  id: string;
  type: 'friend_request' | 'friend_accepted' | 'recipe_comment' | 'recipe_imported';
  message: string;
  read: boolean;
  createdAt: string;
}

export const PLACEHOLDER_NOTIFICATIONS: IPlaceholderNotification[] = [
  {
    id: 'n1',
    type: 'friend_request',
    message: 'sarah_b sent you a friend request.',
    read: false,
    createdAt: '2 hours ago',
  },
  {
    id: 'n2',
    type: 'recipe_comment',
    message: 'julia_eats commented on "Spaghetti Bolognese".',
    read: false,
    createdAt: '5 hours ago',
  },
  {
    id: 'n3',
    type: 'friend_accepted',
    message: 'marcelo_chef accepted your friend request.',
    read: false,
    createdAt: '1 day ago',
  },
  {
    id: 'n4',
    type: 'recipe_imported',
    message: 'priya_kitchen imported your "Chocolate Lava Cake".',
    read: true,
    createdAt: '2 days ago',
  },
  {
    id: 'n5',
    type: 'recipe_comment',
    message: 'tom_cooks commented on "Hummus with Roasted Red Pepper".',
    read: true,
    createdAt: '3 days ago',
  },
  {
    id: 'n6',
    type: 'friend_request',
    message: 'chef_maria sent you a friend request.',
    read: true,
    createdAt: '4 days ago',
  },
  {
    id: 'n7',
    type: 'recipe_imported',
    message: 'julia_eats imported your "Avocado Toast with Poached Egg".',
    read: true,
    createdAt: '1 week ago',
  },
];

export interface IPlaceholderPublicProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  recipeCount: number;
  friendCount: number;
}

export const PLACEHOLDER_PUBLIC_PROFILE: IPlaceholderPublicProfile = {
  username: 'julia_eats',
  displayName: 'Julia',
  bio: 'Pastry chef by day, home cook by night. Obsessed with all things sweet.',
  avatarUrl: null,
  recipeCount: 8,
  friendCount: 19,
};
