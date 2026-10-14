import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCollections } from "../../services/collectionApi";
import CollectionCard from "../../components/cards/CollectionCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

const FILTERS = {
  category: [
    { value: "creative", label: "Creative Collection" },
    { value: "special-edition", label: "Special Editions" },
  ],
  style: [
    { value: "botanical", label: "Botanical" },
    { value: "abstract", label: "Abstract" },
    { value: "geometric", label: "Geometric" },
    { value: "artistic", label: "Artistic" },
    { value: "architectural", label: "Architectural" },
    { value: "textural", label: "Textural" },
  ],
  material: [
    { value: "linen", label: "Linen" },
    { value: "natural-fiber", label: "Natural Fiber" },
    { value: "vinyl", label: "Vinyl" },
    { value: "textile", label: "Textile" },
    { value: "acoustic", label: "Acoustic" },
    { value: "custom", label: "Custom" },
  ],
  application: [
    { value: "residential", label: "Residential" },
    { value: "hospitality", label: "Hospitality" },
    { value: "commercial", label: "Commercial" },
    { value: "retail", label: "Retail" },
    { value: "wellness", label: "Wellness" },
  ],
};

export default function Collections() {
  useSeo({
    title: "Collections",
    description:
      "Browse the Arcadia Surfaces Creative Collection and Special Editions by application, style and material.",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeFilters = {
    category: searchParams.get("category") || "",
    style: searchParams.get("style") || "",
    material: searchParams.get("material") || "",
    application: searchParams.get("application") || "",
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || "1",
  };

  const load = () => {
    setLoading(true);
    setError(null);
    const params = Object.fromEntries(
      Object.entries(activeFilters).filter(([, v]) => v)
    );
    fetchCollections(params)
      .then((data) => setState(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [searchParams.toString()]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next);
  }

  function goToPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="container-page py-16">
      <div className="mb-12">
        <h1 className="text-4xl">Collections</h1>
        <p className="mt-3 text-ink-soft max-w-prose">
          Browse the Creative Collection and Special Editions by application, style and material.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-64 shrink-0 space-y-8">
          <div>
            <label className="text-sm font-medium block mb-2" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              type="text"
              defaultValue={activeFilters.search}
              placeholder="Search collections…"
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilter("search", e.currentTarget.value);
              }}
              onBlur={(e) => updateFilter("search", e.currentTarget.value)}
              className="w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus:border-ink outline-none"
            />
          </div>

          {Object.entries(FILTERS).map(([key, options]) => (
            <div key={key}>
              <h3 className="text-sm font-medium mb-2 capitalize">{key}</h3>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => updateFilter(key, "")}
                    className={`text-sm ${
                      !activeFilters[key] ? "text-ink font-medium" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    All
                  </button>
                </li>
                {options.map((opt) => (
                  <li key={opt.value}>
                    <button
                      onClick={() => updateFilter(key, opt.value)}
                      className={`text-sm ${
                        activeFilters[key] === opt.value
                          ? "text-ink font-medium"
                          : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="flex-1">
          {error && <ErrorState message={error} onRetry={load} />}
          {!error && loading && <Loader label="Loading collections" />}
          {!error && !loading && state.items.length === 0 && (
            <p className="text-ink-soft py-16 text-center">
              No collections match those filters. Try clearing one.
            </p>
          )}
          {!error && !loading && state.items.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {state.items.map((c) => (
                  <CollectionCard key={c._id} collection={c} />
                ))}
              </div>

              {state.pages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  {Array.from({ length: state.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 text-sm border ${
                        p === state.page
                          ? "border-ink bg-ink text-stone-50"
                          : "border-ink/20 hover:border-ink"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
