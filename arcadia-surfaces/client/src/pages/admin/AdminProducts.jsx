import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

const MATERIALS = ["linen", "natural-fiber", "vinyl", "textile", "acoustic", "custom"];
const CATEGORIES = ["creative", "special-edition"];
const APPLICATIONS = ["residential", "hospitality", "commercial", "retail", "wellness"];

const emptyForm = {
  name: "",
  productCode: "",
  collectionRef: "",
  material: MATERIALS[0],
  category: CATEGORIES[0],
  applications: [],
  color: "",
  imageUrl: "",
  imageAlt: "",
};

export default function AdminProducts() {
  useSeo({ title: "Products", noindex: true });
  const [items, setItems] = useState(null);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setError(null);
    Promise.all([
      api.get("/products", { params: { limit: 100 } }),
      api.get("/collections", { params: { limit: 48 } }),
    ])
      .then(([productsRes, collectionsRes]) => {
        setItems(productsRes.data.data.items);
        setCollections(collectionsRes.data.data.items);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  function startCreate() {
    setEditingId("new");
    setForm({ ...emptyForm, collectionRef: collections[0]?._id || "" });
    setFormError("");
  }

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      productCode: p.productCode,
      collectionRef: p.collectionRef?._id || p.collectionRef || "",
      material: p.material,
      category: p.category,
      applications: p.applications || [],
      color: p.color || "",
      imageUrl: p.images?.[0]?.url || "",
      imageAlt: p.images?.[0]?.alt || "",
    });
    setFormError("");
  }

  function toggleApplication(app) {
    setForm((f) => ({
      ...f,
      applications: f.applications.includes(app)
        ? f.applications.filter((a) => a !== app)
        : [...f.applications, app],
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      name: form.name,
      productCode: form.productCode,
      collectionRef: form.collectionRef,
      material: form.material,
      category: form.category,
      applications: form.applications,
      color: form.color,
      images: [{ url: form.imageUrl, alt: form.imageAlt }],
    };

    try {
      if (editingId === "new") {
        await api.post("/products", payload);
      } else {
        await api.put(`/products/${editingId}`, payload);
      }
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="container-page py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link to="/admin" className="text-sm text-ink-soft hover:text-ink">
            ← Dashboard
          </Link>
          <h1 className="text-3xl mt-2">Products</h1>
        </div>
        <button
          onClick={startCreate}
          disabled={collections.length === 0}
          className="border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-stone-50 transition-colors disabled:opacity-40"
        >
          New Product
        </button>
      </div>

      {collections.length === 0 && items && (
        <p className="text-sm text-ink-soft mb-8">
          Create a collection first — every product must belong to one.
        </p>
      )}

      {editingId && (
        <form onSubmit={handleSave} className="border border-ink/10 p-6 mb-10 space-y-4 max-w-xl">
          <h2 className="text-lg">{editingId === "new" ? "Create product" : "Edit product"}</h2>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Product code</span>
            <input
              required
              value={form.productCode}
              onChange={(e) => setForm({ ...form, productCode: e.target.value })}
              className="input"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Collection</span>
            <select
              required
              value={form.collectionRef}
              onChange={(e) => setForm({ ...form, collectionRef: e.target.value })}
              className="input"
            >
              {collections.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium block mb-1">Material</span>
              <select
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="input"
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m.replace("-", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium block mb-1">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("-", " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <span className="text-sm font-medium block mb-2">Applications</span>
            <div className="flex flex-wrap gap-3">
              {APPLICATIONS.map((app) => (
                <label key={app} className="flex items-center gap-1.5 text-sm capitalize">
                  <input
                    type="checkbox"
                    checked={form.applications.includes(app)}
                    onChange={() => toggleApplication(app)}
                  />
                  {app}
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Colorway</span>
            <input
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="input"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Image URL</span>
            <input
              required
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Image alt text</span>
            <input
              required
              value={form.imageAlt}
              onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
              className="input"
            />
          </label>

          {formError && <p className="text-sm text-red-700">{formError}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-ink text-stone-50 px-5 py-2.5 text-sm hover:bg-bronze transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <Loader label="Loading products" />}
      {items && (
        <table className="w-full text-sm border-t border-ink/10">
          <thead>
            <tr className="text-left border-b border-ink/10">
              <th className="py-3 font-medium">Name</th>
              <th className="py-3 font-medium">Code</th>
              <th className="py-3 font-medium">Collection</th>
              <th className="py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b border-ink/10">
                <td className="py-3">{p.name}</td>
                <td className="py-3 text-ink-soft">{p.productCode}</td>
                <td className="py-3 text-ink-soft">{p.collectionRef?.name || "—"}</td>
                <td className="py-3 text-right space-x-4">
                  <button onClick={() => startEdit(p)} className="hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
