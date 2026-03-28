import React, { useState, useEffect } from "react";
import { 
  UploadCloud, Image as ImageIcon, FileArchive, 
  AlertCircle, Gamepad2, Loader2, List, Edit, Power, PowerOff, X
} from "lucide-react";
import { 
  uploadGameProtocol, getAllGamesProtocol, 
  updateGameProtocol, toggleGameStatusProtocol 
} from "../../service/game"; 
import { getCategories } from "../../service/category"; 
import { toast } from "react-toastify";

export default function AdminUpload() {
  const [activeTab, setActiveTab] = useState<"form" | "table">("form");
  
  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // Data States
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [gamesList, setGamesList] = useState<any[]>([]);
  
  // Loading & Messages
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Initialize Data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Handle Thumbnail Preview Generation
  useEffect(() => {
    if (thumbnail) {
      const objectUrl = URL.createObjectURL(thumbnail);
      setThumbnailPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [thumbnail]);

  const fetchInitialData = async () => {
    setFetchingData(true);
    try {
      const catRes = await getCategories();
      const cats = catRes.data || [];
      setCategoriesList(cats);
      // Backend eken dena ID eka _id nisa eka set karanna
      if (cats.length > 0 && !categoryId) setCategoryId(cats[0]._id);

      await fetchGames(); 
    } catch (err) {
      toast.error("Failed to initialize system data");
    } finally {
      setFetchingData(false);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await getAllGamesProtocol();
      // Express backend eken enne { data: [...] } structure eka
      setGamesList(res.data || []);
    } catch (error) {
      console.error("Error fetching games", error);
      setGamesList([]);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setThumbnail(null);
    setGameFile(null);
    setThumbnailPreview(null);
    if (categoriesList.length > 0) setCategoryId(categoriesList[0]._id);
  };

  const handleEditClick = (game: any) => {
    setEditingId(game._id); // MongoDB ID eka _id
    setTitle(game.title);
    setDescription(game.description);
    // Populated category object ekak nam _id eka gannawa
    setCategoryId(game.categoryId?._id || game.categoryId); 
    
    // Cloudinary URL eka direct preview ekata danna puluwan
    setThumbnailPreview(game.thumbnailUrl);
    
    setThumbnail(null); 
    setGameFile(null);
    
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleGameStatusProtocol(id);
      toast.success("Module status overridden");
      await fetchGames(); 
    } catch (err) {
      toast.error("Status override failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !categoryId) {
      setErrorMsg("All text fields are strictly required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    
    // Backend controller eke thiyena field names ma use karanna: 'thumbnail' saha 'gameFile'
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (gameFile) formData.append("gameFile", gameFile);

    try {
      if (editingId) {
        await updateGameProtocol(editingId, formData);
        toast.success("Update successful!");
      } else {
        // Aluth ekak deploy karaddi files dekama oni
        if (!thumbnail || !gameFile) {
          setErrorMsg("Payload and Cover Image are required for new deployments.");
          setLoading(false);
          return;
        }
        await uploadGameProtocol(formData);
        toast.success("Upload successful!");
      }
      
      resetForm();
      await fetchGames(); 
      setActiveTab("table"); 
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Transmission failed.");
      toast.error("Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10 font-mono">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] flex items-center gap-3">
            <UploadCloud className="text-green-500 w-8 h-8" />
            NEXUS_CORE_COMMAND
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm tracking-widest mt-2 uppercase">
            Manage interactive module deployments
          </p>
        </div>

        <div className="flex bg-[#111] border border-green-500/20 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab("form")}
            className={`px-6 py-2 rounded text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'form' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-500 hover:text-green-500'}`}
          >
            <UploadCloud className="w-4 h-4" /> {editingId ? "EDIT_MODULE" : "DEPLOY_MODULE"}
          </button>
          <button 
            onClick={() => { setActiveTab("table"); fetchGames(); }}
            className={`px-6 py-2 rounded text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'table' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-500 hover:text-green-500'}`}
          >
            <List className="w-4 h-4" /> MODULE_LIBRARY
          </button>
        </div>
      </div>

      {activeTab === "form" && (
        <div className="bg-black/50 border border-green-500/20 p-6 sm:p-10 rounded-2xl relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {editingId && (
            <div className="mb-6 flex items-center justify-between border-b border-yellow-500/30 pb-3">
              <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <Edit className="w-4 h-4" /> OVERRIDE_MODE_ACTIVE : Editing Module
              </span>
              <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs">
                <X className="w-4 h-4" /> CANCEL_OVERRIDE
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 relative z-10">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-green-500 uppercase tracking-widest font-bold">Module Designation (Title)</label>
                <div className="relative group">
                  <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#050505] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all"
                    placeholder="Neon Racer v1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-green-500 uppercase tracking-widest font-bold flex items-center gap-2">
                  Classification (Category) {fetchingData && <Loader2 className="w-3 h-3 animate-spin text-green-500" />}
                </label>
                <select
                  required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={fetchingData || categoriesList.length === 0}
                  className="w-full bg-[#050505] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 cursor-pointer disabled:opacity-50"
                >
                  {categoriesList.length === 0 ? <option value="">No Categories Found</option> : categoriesList.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-green-500 uppercase tracking-widest font-bold">Mission Brief (Description)</label>
              <textarea
                required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#050505] border border-gray-800 rounded-lg p-4 text-white focus:outline-none focus:border-green-500 resize-none"
                placeholder="Enter game details, controls, and objectives here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800/50">
              <div className="space-y-2">
                <label className="text-xs text-green-500 uppercase tracking-widest font-bold flex justify-between">
                  Cover Image
                  {editingId && !thumbnail && <span className="text-yellow-600 text-[10px]">(Optional for Update)</span>}
                </label>
                <div className="relative border-2 border-dashed border-gray-800 rounded-xl bg-[#050505] hover:border-green-500/50 transition-all group cursor-pointer overflow-hidden h-40">
                  <input
                    type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  {thumbnailPreview ? (
                    <div className="absolute inset-0 w-full h-full z-10">
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                        <ImageIcon className="w-8 h-8 text-green-400 mb-1" />
                        <span className="text-xs font-bold text-white">CHANGE_COVER</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-10 h-10 mb-3 text-gray-600 group-hover:text-green-500" />
                      <span className="text-sm text-gray-400 font-bold">Drop image or Click</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-green-500 uppercase tracking-widest font-bold flex justify-between">
                  Payload (Game File)
                  {editingId && !gameFile && <span className="text-yellow-600 text-[10px]">(Optional for Update)</span>}
                </label>
                <div className="relative border-2 border-dashed border-gray-800 rounded-xl bg-[#050505] hover:border-green-500/50 transition-all group cursor-pointer overflow-hidden h-40">
                  <input
                    type="file" onChange={(e) => setGameFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                    <FileArchive className={`w-10 h-10 mb-3 ${gameFile ? 'text-green-500' : 'text-gray-600'}`} />
                    {gameFile ? (
                      <span className="text-sm text-green-400 font-bold truncate max-w-full px-4">{gameFile.name}</span>
                    ) : (
                      <span className="text-sm text-gray-400 font-bold">{editingId ? "Current Payload Active." : "Drop source or Click"}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                disabled={loading} type="submit" 
                className={`w-full text-white font-bold py-4 rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${editingId ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'}`}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "TRANSMITTING DATA..." : (editingId ? "EXECUTE OVERRIDE" : "DEPLOY MODULE")}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "table" && (
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-gray-800 text-green-500 text-xs tracking-widest uppercase">
                  <th className="p-4 font-bold">Cover</th>
                  <th className="p-4 font-bold">Module Designation</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm">
                {gamesList.length > 0 ? (
                  gamesList.map((game) => (
                    <tr key={game._id} className="border-b border-gray-800/50 hover:bg-[#111]/50 group">
                      <td className="p-4">
                        <div className="w-16 h-10 rounded overflow-hidden border border-gray-700">
                          <img 
                            src={game.thumbnailUrl} 
                            alt={game.title} 
                            className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white tracking-wide">{game.title}</td>
                      <td className="p-4 text-gray-400">{game.categoryId?.name || 'N/A'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest ${game.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                          {game.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleToggleStatus(game._id)}
                            className={`p-2 rounded border transition-colors ${game.status === 'ACTIVE' ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-green-500/30 text-green-500 hover:bg-green-500/10'}`}
                          >
                            {game.status === 'ACTIVE' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleEditClick(game)}
                            className="p-2 rounded border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 uppercase tracking-widest">
                      {fetchingData ? "SYNCHRONIZING_WITH_NEXUS..." : "NO_MODULES_FOUND_IN_SYSTEM"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}