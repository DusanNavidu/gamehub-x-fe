import api from "./api"; // උඩ හදපු අලුත් axios instance එක

// 1. අලුත් Game එකක් Upload කිරීම
export const uploadGameProtocol = async (formData: FormData) => {
  const res = await api.post("/games/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 2. සියලුම Games ලබා ගැනීම
export const getAllGamesProtocol = async () => {
  const res = await api.get("/games");
  return res.data;
};

// 3. දැනට තියෙන Game එකක් Update කිරීම
export const updateGameProtocol = async (id: string, formData: FormData) => {
  const res = await api.put(`/games/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 4. Game එක Active/Inactive කිරීම
export const toggleGameStatusProtocol = async (id: string) => {
  const res = await api.patch(`/games/${id}/status`);
  return res.data;
};