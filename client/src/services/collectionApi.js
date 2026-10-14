import api from "./api";

export async function fetchCollections(params = {}) {
  const { data } = await api.get("/collections", { params });
  return data.data;
}

export async function fetchCollectionBySlug(slug) {
  const { data } = await api.get(`/collections/${slug}`);
  return data.data;
}
