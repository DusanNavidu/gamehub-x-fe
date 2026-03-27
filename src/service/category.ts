import api from "./api";

export const createCategory = async (name: string, description: string) => {
  const res = await api.post("/categories", { name, description });
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};