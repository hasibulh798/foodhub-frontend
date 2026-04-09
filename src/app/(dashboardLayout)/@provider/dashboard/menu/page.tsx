"use client";

import type { Category, CreateMealInput, DietaryType, Meal } from "@/constants/allType";
import { categoryServices } from "@/services/category.service";
import { providerServices } from "@/services/provider.service";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DIETARY_META: Record<DietaryType, { label: string; color: string }> = {
  VEG:     { label: "Veg",     color: "bg-green-500/10 text-green-400 border-green-500/20" },
  NON_VEG: { label: "Non-Veg", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  VEGAN:   { label: "Vegan",   color: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
};

type ModalState =
  | { type: "add" }
  | { type: "edit"; meal: Meal }
  | null;

export default function ProviderMenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mealsRes, catsRes] = await Promise.all([
        providerServices.getMyMeals(),
        categoryServices.getAllCategories()

      ]);
     
      setMeals(mealsRes);
      setCategories(catsRes);
      
    } catch {
      toast.error("Load failed");
    } finally {
      setLoading(false);
    }
  };
  const toggleAvailability = async (meal: Meal) => {
    try {
      await providerServices.toggleMealAvailability(meal.id);
      setMeals((prev) =>
        prev.map((m) => (m.id === meal.id ? { ...m, isAvailable: !m.isAvailable } : m))
      );
    } catch {
      toast.error("Update failed");
    }
  };


  const deleteMeal = async (mealId: string) => {
    if (!confirm("Delete this meal?")) return;
    try {
      await providerServices.deleteMeal(mealId);
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
      toast.success("Meal deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSave = (saved: Meal, isNew: boolean) => {
    if (isNew) {
      setMeals((prev) => [saved, ...prev]);
    } else {
      setMeals((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
    }
    setModal(null);
  };

  const filtered = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.cuisine?.toLowerCase().includes(search.toLowerCase())
  );

  const availableCount = meals.filter((m) => m.isAvailable).length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">Menu</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {availableCount} available · {meals.length - availableCount} unavailable
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "add" })}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Add Meal
          </button>
        </div>
      </header>

      <div className="px-8 py-6 flex-1">
        {/* Search */}
        <div className="mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meals..."
            className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-orange-500/50 transition"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-900 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <p className="text-4xl mb-3 opacity-30">🍽</p>
            <p className="text-sm mb-4">No meals yet</p>
            <button
              onClick={() => setModal({ type: "add" })}
              className="text-xs text-orange-400 border border-orange-500/20 px-4 py-2 rounded-lg hover:bg-orange-500/5 transition"
            >
              Add your first meal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((meal) => (
              <MealRow
                key={meal.id}
                meal={meal}
                categories={categories}
                onToggle={toggleAvailability}
                onEdit={() => setModal({ type: "edit", meal })}
                onDelete={() => deleteMeal(meal.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <MealModal
          meal={modal.type === "edit" ? modal.meal : undefined}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ─── Meal Row ─────────────────────────────────────────────────────────────────

function MealRow({
  meal, categories, onToggle, onEdit, onDelete,
}: {
  meal: Meal;
  categories: Category[];
  onToggle: (meal: Meal) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const categoryName = categories.find((c) => c.id === meal.categoryId)?.name;

  return (
    <div className={`bg-gray-900 border rounded-xl p-4 flex gap-3 transition hover:border-gray-700 ${
      meal.isAvailable ? "border-gray-800" : "border-gray-800 opacity-50"
    }`}>
      {/* Image */}
      {meal.imageUrl ? (
        <img src={meal.imageUrl} alt={meal.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl shrink-0">
          🍽
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-gray-200 text-sm truncate">{meal.name}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {categoryName && (
                <span className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
                  {categoryName}
                </span>
              )}
              {meal.dietaryType && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${DIETARY_META[meal.dietaryType].color}`}>
                  {DIETARY_META[meal.dietaryType].label}
                </span>
              )}
              {meal.cuisine && (
                <span className="text-[10px] text-gray-600">{meal.cuisine}</span>
              )}
            </div>
          </div>
          <p className="text-orange-400 font-bold font-mono text-sm shrink-0">৳{meal.price}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onToggle(meal)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
              meal.isAvailable
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15"
                : "bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${meal.isAvailable ? "bg-emerald-400" : "bg-gray-600"}`} />
            {meal.isAvailable ? "Available" : "Unavailable"}
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1 rounded-lg text-xs border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 rounded-lg text-xs border border-gray-800 text-gray-600 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Meal Modal ───────────────────────────────────────────────────────────────

function MealModal({
  meal, categories, onSave, onClose,
}: {
  meal?: Meal;
  categories: Category[];
  onSave: (saved: Meal, isNew: boolean) => void;
  onClose: () => void;
}) {
  const isNew = !meal;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:        meal?.name ?? "",
    description: meal?.description ?? "",
    price:       meal?.price ?? "",
    categoryId:  meal?.categoryId ?? "",
    cuisine:     meal?.cuisine ?? "",
    dietaryType: (meal?.dietaryType ?? "") as DietaryType | "",
    imageUrl:    meal?.imageUrl ?? "",
    isAvailable: meal?.isAvailable ?? true,
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreateMealInput = {
        name:        form.name,
        description: form.description,
        price:       Number(form.price),
        categoryId:  form.categoryId,
        imageUrl:    form.imageUrl,
        isAvailable: form.isAvailable,
        cuisine:     form.cuisine || undefined,
        dietaryType: form.dietaryType || undefined,
      };

      const mealData = isNew
        ? await providerServices.createMeal(payload)
        : await providerServices.updateMeal(meal!.id, payload);


      onSave(mealData, isNew);
      toast.success(isNew ? "Meal added!" : "Meal updated!");
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">{isNew ? "Add New Meal" : "Edit Meal"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 w-8 h-8 rounded-lg hover:bg-gray-800 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meal Name *</label>
              <input name="name" required value={form.name} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition"
                placeholder="e.g. Chicken Biryani" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Price (Tk) *</label>
              <input name="price" type="number" required min={1} step="0.01" value={form.price} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Category *</label>
              <select name="categoryId" required value={form.categoryId} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition">
                <option value="">Select...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Dietary Type</label>
              <select name="dietaryType" value={form.dietaryType} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition">
                <option value="">Not specified</option>
                <option value="VEG">Veg</option>
                <option value="NON_VEG">Non-Veg</option>
                <option value="VEGAN">Vegan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition"
              placeholder="https://example.com/image.jpg" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Cuisine</label>
            <input name="cuisine" value={form.cuisine} onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition"
              placeholder="e.g. Bengali, Chinese, Italian" />
          </div>


          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Description</label>
            <textarea name="description" rows={2} value={form.description} onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition resize-none"
              placeholder="Describe this meal..." />
          </div>

          {/* Availability Toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForm((p) => ({ ...p, isAvailable: !p.isAvailable }))}
              className={`w-9 h-5 rounded-full transition-colors relative ${form.isAvailable ? "bg-orange-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isAvailable ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-gray-300">Available for ordering</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium text-sm transition">
              {loading ? "Saving..." : isNew ? "Add Meal" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}