import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

const CATEGORIES = ["residential", "hospitality", "commercial", "retail", "workplace", "wellness"];

const emptyForm = {
  title: "",
  category: CATEGORIES[0],
  location: "",
  architect: "",
  year: new Date().getFullYear(),
  shortDescription: "",
  description: "",
  coverImageUrl: "",
  coverImageAlt: "",
};

export default function AdminProjects() {
  useSeo({ title: "Projects", noindex: true });
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setError(null);
    api
      .get("/projects", { params: { limit: 48 } })
      .then((res) => setItems(res.data.data.items))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  function startCreate() {
    setEditingId("new");
    setForm(emptyForm);
    setFormError("");
  }

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      title: p.title,
      category: p.category,
      location: p.location,
      architect: p.architect || "",
      year: p.year || new Date().getFullYear(),
      shortDescription: p.shortDescription,
      description: p.description,
      coverImageUrl: p.coverImage?.url || "",
      coverImageAlt: p.coverImage?.alt || "",
    });
    setFormError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      title: form.title,
      category: form.category,
      location: form.location,
      architect: form.architect,
      year: Number(form.year) || undefined,
      shortDescription: form.shortDescription,
      description: form.description,
      coverImage: { url: form.coverImageUrl, alt: form.coverImageAlt },
    };

    try {
      if (editingId === "new") {
        await api.post("/projects", payload);
      } else {
        await api.put(`/projects/${editingId}`, payload);
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
    if (!confirm("Delete this project? This can't be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
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
          <h1 className="text-3xl mt-2">Projects</h1>
        </div>
        <button
          onClick={startCreate}
          className="border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-stone-50 transition-colors"
        >
          New Project
        </button>
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="border border-ink/10 p-6 mb-10 space-y-4 max-w-xl">
          <h2 className="text-lg">{editingId === "new" ? "Create project" : "Edit project"}</h2>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium block mb-1">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium block mb-1">Year</span>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="input"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium block mb-1">Location</span>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium block mb-1">Architect</span>
              <input
                value={form.architect}
                onChange={(e) => setForm({ ...form, architect: e.target.value })}
                className="input"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Short description</span>
            <input
              required
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="input"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Full description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Cover image URL</span>
            <input
              required
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
              className="input"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium block mb-1">Cover image alt text</span>
            <input
              required
              value={form.coverImageAlt}
              onChange={(e) => setForm({ ...form, coverImageAlt: e.target.value })}
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
      {!error && !items && <Loader label="Loading projects" />}
      {items && (
        <table className="w-full text-sm border-t border-ink/10">
          <thead>
            <tr className="text-left border-b border-ink/10">
              <th className="py-3 font-medium">Title</th>
              <th className="py-3 font-medium">Category</th>
              <th className="py-3 font-medium">Year</th>
              <th className="py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b border-ink/10">
                <td className="py-3">{p.title}</td>
                <td className="py-3 text-ink-soft capitalize">{p.category}</td>
                <td className="py-3 text-ink-soft">{p.year || "—"}</td>
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
