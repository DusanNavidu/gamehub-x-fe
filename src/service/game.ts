import api from "./api";

// 1. Upload Game (FormData use karanne files nisa)
export const uploadGameProtocol = async (formData: FormData) => {
  const res = await api.post("/games", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 2. Get All Games
export const getAllGamesProtocol = async () => {
  const res = await api.get("/games");
  return res.data; // Backend eken enne { data: [...] }
};

// 3. Update Game
export const updateGameProtocol = async (id: string, formData: FormData) => {
  const res = await api.put(`/games/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 4. Toggle Status
export const toggleGameStatusProtocol = async (id: string) => {
  const res = await api.patch(`/games/${id}/status`);
  return res.data;
};