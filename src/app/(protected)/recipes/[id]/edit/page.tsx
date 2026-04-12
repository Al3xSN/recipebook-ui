'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PLACEHOLDER_RECIPES } from '@/lib/placeholder-data';
import { CATEGORY_LABELS, TAG_LABELS, UNIT_LABELS } from '@/lib/recipe-enums';

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const seed = PLACEHOLDER_RECIPES.find((r) => r.id === params.id) ?? PLACEHOLDER_RECIPES[0];

  const [title, setTitle] = useState(seed.title);
  const [description, setDescription] = useState(seed.description ?? '');
  const [category, setCategory] = useState(seed.category);
  const [tags, setTags] = useState<number[]>(seed.tags);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(String(seed.prepTimeMinutes));
  const [cookTimeMinutes, setCookTimeMinutes] = useState(String(seed.cookTimeMinutes));
  const [servings, setServings] = useState(String(seed.servings));
  const [imageUrl, setImageUrl] = useState(seed.imageUrl ?? '');
  const [ingredients, setIngredients] = useState(
    seed.ingredients.map((ing) => ({ name: ing.name, amount: String(ing.amount), unit: ing.unit })),
  );
  const [instructions, setInstructions] = useState(
    seed.instructions.map((s) => ({ text: s.text })),
  );

  function toggleTag(tag: number) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { name: '', amount: '', unit: 0 }]);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function updateIngredient(
    index: number,
    field: 'name' | 'amount' | 'unit',
    value: string | number,
  ) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    );
  }

  function addInstruction() {
    setInstructions((prev) => [...prev, { text: '' }]);
  }

  function removeInstruction(index: number) {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateInstruction(index: number, value: string) {
    setInstructions((prev) => prev.map((inst, i) => (i === index ? { text: value } : inst)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No-op for placeholder UI — navigate back to detail page
    router.push(`/recipes/${params.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit recipe</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
        {/* Basic info */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-900">Basic info</h2>
          <Input
            id="title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
            />
          </div>
          <Input
            id="imageUrl"
            label="Image URL (optional)"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </section>

        {/* Details */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-900">Details</h2>
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="prepTime"
              label="Prep time (min)"
              type="number"
              min="0"
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(e.target.value)}
              required
            />
            <Input
              id="cookTime"
              label="Cook time (min)"
              type="number"
              min="0"
              value={cookTimeMinutes}
              onChange={(e) => setCookTimeMinutes(e.target.value)}
              required
            />
            <Input
              id="servings"
              label="Servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
            />
          </div>
        </section>

        {/* Tags */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TAG_LABELS).map(([value, label]) => {
              const tagNum = Number(value);
              const active = tags.includes(tagNum);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleTag(tagNum)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Ingredients */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900">Ingredients</h2>
          <div className="flex flex-col gap-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  {index === 0 && (
                    <label
                      htmlFor={`ing-name-${index}`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                  )}
                  <input
                    id={`ing-name-${index}`}
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    placeholder="e.g. flour"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                  />
                </div>
                <div className="w-24">
                  {index === 0 && (
                    <label
                      htmlFor={`ing-amount-${index}`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Amount
                    </label>
                  )}
                  <input
                    id={`ing-amount-${index}`}
                    type="number"
                    min="0"
                    step="any"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    placeholder="1"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                  />
                </div>
                <div className="w-28">
                  {index === 0 && (
                    <label
                      htmlFor={`ing-unit-${index}`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Unit
                    </label>
                  )}
                  <select
                    id={`ing-unit-${index}`}
                    value={ing.unit}
                    onChange={(e) => updateIngredient(index, 'unit', Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                  >
                    {Object.entries(UNIT_LABELS).map(([val, lbl]) => (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Remove ingredient"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-orange-400 hover:text-orange-500"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add ingredient
          </button>
        </section>

        {/* Instructions */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900">Instructions</h2>
          <div className="flex flex-col gap-3">
            {instructions.map((inst, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="mt-2.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                  {index + 1}
                </span>
                <textarea
                  value={inst.text}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  rows={2}
                  placeholder={`Step ${index + 1}…`}
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={instructions.length === 1}
                  className="mt-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Remove step"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addInstruction}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-orange-400 hover:text-orange-500"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add step
          </button>
        </section>

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <Button type="submit">Save changes</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/recipes/${params.id}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
