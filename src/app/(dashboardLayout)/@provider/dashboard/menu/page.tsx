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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, Power } from "lucide-react";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
      toast.success(`${meal.name} is now ${!meal.isAvailable ? 'available' : 'unavailable'}`);
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

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMeals = filtered.slice(startIndex, startIndex + itemsPerPage);

  const availableCount = meals.filter((m) => m.isAvailable).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 p-4 md:p-8 space-y-6">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Menu Management</h1>
          <p className="text-gray-500 font-medium">Control your offerings and availability</p>
        </div>
        <Button 
          onClick={() => setModal({ type: "add" })}
          className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold px-6 py-6 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={18} className="mr-2" />
          Add New Meal
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name or cuisine..."
            className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-orange-500/50 transition-all focus:ring-4 focus:ring-orange-500/5"
          />
        </div>

        <div className="flex items-center gap-4">
           <Badge variant="outline" className="px-4 py-1.5 rounded-full border-gray-800 text-gray-400 bg-gray-900/50">
             {availableCount} Active Items
           </Badge>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-xl">
        <Table>
          <TableHeader className="bg-gray-900/60">
            <TableRow className="border-gray-800/60 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Meal Info</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Category</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Status</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Price</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-gray-800/40">
                  <TableCell colSpan={5} className="py-8 px-8"><div className="h-12 w-full bg-gray-800/50 animate-pulse rounded-xl" /></TableCell>
                </TableRow>
              ))
            ) : currentMeals.length === 0 ? (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <p className="text-6xl font-black">🍽</p>
                    <p className="text-lg font-bold">No meals found in your kitchen</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentMeals.map((meal) => {
                const categoryName = categories.find((c) => c.id === meal.categoryId)?.name;
                return (
                  <TableRow key={meal.id} className={`border-gray-800/40 hover:bg-white/5 transition-colors group ${!meal.isAvailable && 'opacity-60'}`}>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden shrink-0 border border-gray-700/50">
                          {meal.images && meal.images.length > 0 ? (
                            <img src={meal.images[0]} alt={meal.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🍽</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-200">{meal.name}</span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{meal.cuisine || "Generic"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge variant="secondary" className="rounded-lg bg-gray-800 text-gray-400 border-none font-bold text-[10px]">
                        {categoryName || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                       <button
                        onClick={() => toggleAvailability(meal)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all ${
                          meal.isAvailable 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-gray-800 text-gray-500 border-gray-700"
                        }`}
                      >
                        <Power size={10} />
                        {meal.isAvailable ? "Active" : "Hidden"}
                      </button>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <span className="text-sm font-black text-orange-400 tabular-nums">৳{meal.price}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setModal({ type: "edit", meal })}
                          className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-blue-500/10 hover:text-blue-400 transition-all"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteMeal(meal.id)}
                          className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={`rounded-xl border-gray-800 font-bold ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`rounded-xl border-gray-800 font-bold ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'cursor-pointer'}`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={`rounded-xl border-gray-800 font-bold ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
      {meal.images && meal.images.length > 0 ? (
        <img src={meal.images[0]} alt={meal.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
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
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(meal?.images || []);
  const [form, setForm] = useState({
    name:        meal?.name ?? "",
    description: meal?.description ?? "",
    price:       meal?.price ?? "",
    categoryId:  meal?.categoryId ?? "",
    cuisine:     meal?.cuisine ?? "",
    dietaryType: (meal?.dietaryType ?? "") as DietaryType | "",
    isAvailable: meal?.isAvailable ?? true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + previews.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    // If it was a new file, remove from files array too
    // This is tricky because previews includes existing images.
    // Let's just track which ones are new files.
    // For simplicity, if index >= existingImages.length, it's a new file.
    const existingCount = meal?.images?.length || 0;
    if (index >= existingCount) {
        setFiles(prev => prev.filter((_, i) => i !== (index - existingCount)));
    }
  };

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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("categoryId", form.categoryId);
      formData.append("isAvailable", String(form.isAvailable));
      if (form.cuisine) formData.append("cuisine", form.cuisine);
      if (form.dietaryType) formData.append("dietaryType", form.dietaryType);
      
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Filter and append kept existing image URLs (Cloudinary images that start with http/https)
      const existingImages = previews.filter(url => url.startsWith("http") || url.startsWith("https"));
      existingImages.forEach((url) => {
        formData.append("existingImages", url);
      });

      const mealData = isNew
        ? await providerServices.createMeal(formData)
        : await providerServices.updateMeal(meal!.id, formData);

      onSave(mealData, isNew);
      toast.success(isNew ? "Meal added!" : "Meal updated!");
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-[2.5rem] w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-black text-white">{isNew ? "Add New Creation" : "Refine Recipe"}</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Fill in the details for your culinary masterpiece</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white w-10 h-10 rounded-full hover:bg-gray-800 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          
          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Meal Gallery (Max 5)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-800 bg-gray-800/50">
                  <img src={src} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-800 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                  <Plus size={24} className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                  <span className="text-[10px] font-bold text-gray-600 mt-1">Upload</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Meal Name *</label>
              <input name="name" required value={form.name} onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition-all"
                placeholder="e.g. Signature Truffle Pasta" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Price (৳) *</label>
              <input name="price" type="number" required min={1} step="0.01" value={form.price} onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Category *</label>
              <select name="categoryId" required value={form.categoryId} onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition-all appearance-none">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Dietary Type</label>
              <select name="dietaryType" value={form.dietaryType} onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition-all appearance-none">
                <option value="">Not Specified</option>
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
                <option value="VEGAN">Vegan</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Cuisine Style</label>
            <input name="cuisine" value={form.cuisine} onChange={handleChange}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition-all"
              placeholder="Bengali, Fusion, Mediterranean..." />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition-all resize-none"
              placeholder="Share the story behind this dish..." />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-950 rounded-2xl border border-gray-800">
             <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg ${form.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-500'}`}>
                  <Power size={18} />
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-200">Available for Order</p>
                  <p className="text-[10px] text-gray-500 font-medium">Instantly show/hide from customers</p>
               </div>
             </div>
             <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, isAvailable: !p.isAvailable }))}
              className={`w-12 h-6 rounded-full transition-all relative ${form.isAvailable ? "bg-orange-500" : "bg-gray-800"}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all ${form.isAvailable ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={onClose} variant="ghost"
              className="flex-1 h-14 rounded-2xl border border-gray-800 text-gray-400 hover:bg-gray-800 font-bold transition-all">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}
              className="flex-1 h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20 text-white font-black transition-all active:scale-95 disabled:opacity-50">
              {loading ? "Syncing..." : isNew ? "Launch Meal" : "Update Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
