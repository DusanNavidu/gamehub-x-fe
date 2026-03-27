import React, { useState, useEffect } from "react";
import { BiCategory } from "react-icons/bi";
import { Plus, List as ListIcon, Loader2, Edit2, Power, Check } from "lucide-react";
import { createCategory, getCategories, updateCategory, toggleCategoryStatus } from "../../service/category";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Edit logic states
  const [editId, setEditId] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      // Backend eken enne { data: [...] } nisa res.data danna
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateCategory(editId, name, description);
        toast.success("Category updated!");
      } else {
        await createCategory(name, description);
        toast.success("Category added!");
      }
      setName("");
      setDescription("");
      setEditId(null);
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (cat: any) => {
    setEditId(cat._id);
    setName(cat.name);
    setDescription(cat.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleCategoryStatus(id);
      toast.info("Status updated");
      loadCategories();
    } catch (err) {
      toast.error("Status change failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] flex items-center gap-3">
          <BiCategory className="text-green-500 w-8 h-8" />
          MODULE_CATEGORIES
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1 bg-black/50 border border-green-500/20 p-6 rounded-2xl h-fit sticky top-24">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-green-500/20 pb-3 flex items-center gap-2">
            {editId ? <Edit2 className="w-4 h-4 text-yellow-500" /> : <Plus className="w-4 h-4 text-green-500" />}
            {editId ? "Update Category" : "New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-green-500 uppercase font-bold">Category Name</label>
              <input
                type="text" required value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050505] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none"
                placeholder="e.g. Action RPG"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-green-500 uppercase font-bold">Description</label>
              <textarea
                rows={3} value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#050505] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none resize-none"
                placeholder="Short description..."
              />
            </div>
            <div className="flex gap-2">
                <button disabled={loading} type="submit" className={`flex-1 ${editId ? 'bg-yellow-600' : 'bg-green-600'} text-black font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all`}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editId ? "UPDATE" : "ADD CATEGORY"}
                </button>
                {editId && (
                    <button type="button" onClick={() => {setEditId(null); setName(""); setDescription("");}} className="bg-gray-800 text-white px-4 rounded-lg">Cancel</button>
                )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 bg-black/50 border border-green-500/20 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-green-500/20 pb-3 flex items-center gap-2">
            <ListIcon className="w-4 h-4 text-green-500" /> Existing Categories
          </h3>
          
          {fetching ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-green-500 animate-spin" /></div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No categories found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className={`group bg-[#050505] border ${cat.status === 'INACTIVE' ? 'border-red-900/20 opacity-60' : 'border-gray-800'} p-4 rounded-xl hover:border-green-500/30 transition-all flex justify-between items-center`}>
                  <div>
                    <div className="flex items-center gap-2">
                        <h4 className="text-green-400 font-bold">{cat.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${cat.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {cat.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{cat.description || "No description."}</p>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(cat)} className="p-2 hover:bg-green-500/10 rounded-lg text-gray-400 hover:text-green-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(cat._id)} className={`p-2 rounded-lg transition-colors ${cat.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-500/10' : 'text-green-500 hover:bg-green-500/10'}`}>
                        <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}