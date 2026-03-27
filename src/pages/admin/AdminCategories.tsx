import React, { useState, useEffect } from "react";
import { BiCategory } from "react-icons/bi";
import { Plus, List as ListIcon, Loader2 } from "lucide-react";
import { createCategory, getCategories } from "../../service/category";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory(name, description);
      toast.success("Category added successfully!");
      setName("");
      setDescription("");
      loadCategories(); // Refresh the list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] flex items-center gap-3">
          <BiCategory className="text-green-500 w-8 h-8" />
          MODULE_CATEGORIES
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm tracking-widest mt-2 uppercase">
          Manage game classifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Category Form */}
        <div className="lg:col-span-1 bg-black/50 border border-green-500/20 p-6 rounded-2xl h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-green-500/20 pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-green-500" /> New Category
          </h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-green-500 uppercase font-bold">Category Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050505] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                placeholder="e.g. Action RPG"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-green-500 uppercase font-bold">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#050505] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 resize-none"
                placeholder="Short description..."
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ADD CATEGORY"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-black/50 border border-green-500/20 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-green-500/20 pb-3 flex items-center gap-2">
            <ListIcon className="w-4 h-4 text-green-500" /> Existing Categories
          </h3>
          
          {fetching ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-green-500 animate-spin" /></div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No categories found. Create one.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-[#050505] border border-gray-800 p-4 rounded-xl hover:border-green-500/30 transition-all">
                  <h4 className="text-green-400 font-bold mb-1">{cat.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{cat.description || "No description provided."}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}