import api from "./api";

export const createCategory = async (name: string, description: string) => {
  const res = await api.post("/categories", { name, description });
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// Update existing category
export const updateCategory = async (id: string, name: string, description: string) => {
  const res = await api.put(`/categories/${id}`, { name, description });
  return res.data;
};

// Toggle status (ACTIVE <-> INACTIVE)
export const toggleCategoryStatus = async (id: string) => {
  const res = await api.patch(`/categories/${id}/status`);
  return res.data;
};