import api from "./api";

export async function fetchProjects(params = {}) {
  const { data } = await api.get("/projects", { params });
  return data.data;
}

export async function fetchProjectBySlug(slug) {
  const { data } = await api.get(`/projects/${slug}`);
  return data.data;
}
