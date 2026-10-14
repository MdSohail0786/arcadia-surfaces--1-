import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

const emptyForm = {
  name: "",
  category: "creative",
  shortDescription: "",
  story: "",
  heroImageUrl: "",
  heroImageAlt: "",
};

export default function AdminCollections() {
  useSeo({ title: "Collections", noindex: true });
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setError(null);
    api
      .get("/collections", { params: { limit: 48 } })
      .then((res) => setItems(res.data.data.items))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  function startCreate() {
    setEditingId("new");
    setForm(emptyForm);
    setFormError("");
  }

  function startEdit(c) {
    setEditingId(c._id);
    setForm({
      name: c.name,
      category: c.category,
      shortDescription: c.shortDescription,
      story: c.story,
      heroImageUrl: c.heroImage?.url || "",
      heroImageAlt: c.heroImage?.alt || "",
    });
    setFormError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      name: form.name,
      category: form.category,
      shortDescription: form.shortDescription,
      story: form.story,
      heroImage: { url: form.heroImageUrl, alt: form.heroImageAlt },
    };

    try {
      if (editingId === "new") {
        await api.post("/collections", payload);
      } else {
        await api.put(`/collections/${editingId}`, payload);
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
    if (!confirm("Delete this collection? This can't be undone.")) return;
    try {
      await api.delete(`/collections/${id}`);
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
          <h1 className="text-3xl mt-2">Collections</h1>
        </div>
        <button
          onClick={startCreate}
          className="border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-stone-50 transition-colors"
        >
          New Collection
        </button>
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="border border-ink/10 p-6 mb-10 space-y-4 max-w-xl">
          <h2 className="text-lg">{editingId === "new" ? "Create collection" : "Edit collection"}</h2>
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
            <span className="text-sm font-medium block mb-1">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              <option value="creative">Creative</option>
              <option value="special-edition">Special Edition</option>
            </select>
          </label>
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
            <span className="text-sm font-medium block mb-1">Story</span>
            <textarea
              required
              rows={4}
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              className="input resize-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1">Hero image URL</span>
            <input
              required
              value={form.heroImageUrl}
              onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
              className="input"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1">Hero image alt text</span>
            <input
              required
              value={form.heroImageAlt}
              onChange={(e) => setForm({ ...form, heroImageAlt: e.target.value })}
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
      {!error && !items && <Loader label="Loading collections" />}
      {items && (
        <table className="w-full text-sm border-t border-ink/10">
          <thead>
            <tr className="text-left border-b border-ink/10">
              <th className="py-3 font-medium">Name</th>
              <th className="py-3 font-medium">Category</th>
              <th className="py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-b border-ink/10">
                <td className="py-3">{c.name}</td>
                <td className="py-3 text-ink-soft capitalize">{c.category.replace("-", " ")}</td>
                <td className="py-3 text-right space-x-4">
                  <button onClick={() => startEdit(c)} className="hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
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
