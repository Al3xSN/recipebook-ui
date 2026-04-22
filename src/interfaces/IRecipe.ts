import type { Visibility, Difficulty } from '@generated/prisma/client';

export interface ICreateRecipeData {
  title: string;
  description?: string | null;
  ingredients?: IIngredient[];
  instructions?: IInstructionStep[];
  tags?: number[];
  category: number;
  visibility: Visibility;
  difficulty?: Difficulty | null;
  cuisine?: number | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  imageUrl?: string | null;
}

export type IUpdateRecipeData = ICreateRecipeData;

export interface IIngredient {
  name: string;
  amount: number;
  unit: number;
  order?: number;
}

export interface IInstructionStep {
  stepNumber: number;
  text: string;
}

export interface IRecipeAuthor {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface IRecipeDto {
  id: string;
  title: string;
  description: string | null;
  ingredients: IIngredient[];
  instructions: IInstructionStep[];
  tags: number[];
  category: number;
  visibility: Visibility;
  difficulty?: Difficulty | null;
  cuisine?: number | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  imageUrl: string | null;
  userId: string;
  author: IRecipeAuthor;
  createdAt: string;
  updatedAt: string;
  averageRating: number | null;
  ratingCount: number;
}
