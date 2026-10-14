import api from "./api";

export async function loginRequest(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data.user;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data.data.user;
}

export async function fetchAdminStats() {
  const { data } = await api.get("/admin/stats");
  return data.data;
}
