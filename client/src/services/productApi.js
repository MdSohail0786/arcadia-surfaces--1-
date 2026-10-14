import api from "./api";

export async function fetchProducts(params = {}) {
  const { data } = await api.get("/products", { params });
  return data.data;
}

export async function fetchProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
}

export async function searchProducts(params = {}) {
  const { data } = await api.get("/products/search", { params });
  return data.data;
}
