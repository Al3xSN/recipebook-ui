export interface Ingredient {
  name: string;
  amount: number;
  unit: number;
}

export interface InstructionStep {
  stepNumber: number;
  text: string;
}

export interface RecipeAuthor {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface RecipeDto {
  id: string;
  title: string;
  description: string | null;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  tags: number[];
  category: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  visibility: number;
  imageUrl: string | null;
  userId: string;
  author: RecipeAuthor;
  createdAt: string;
  updatedAt: string;
}
