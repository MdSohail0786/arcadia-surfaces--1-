import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProjects } from "../../services/projectApi";
import ProjectCard from "../../components/cards/ProjectCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "hospitality", label: "Hospitality" },
  { value: "commercial", label: "Commercial" },
  { value: "retail", label: "Retail" },
  { value: "workplace", label: "Workplace" },
  { value: "wellness", label: "Wellness" },
];

export default function Projects() {
  useSeo({
    title: "Projects",
    description:
      "Residential, hospitality, commercial, retail, workplace and wellness projects specified with Arcadia Surfaces.",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get("category") || "";
  const page = searchParams.get("page") || "1";

  const load = () => {
    setLoading(true);
    setError(null);
    const params = { page };
    if (category) params.category = category;
    fetchProjects(params)
      .then(setState)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [category, page]);

  function setCategory(cat) {
    const next = new URLSearchParams(searchParams);
    if (cat) {
      next.set("category", cat);
    } else {
      next.delete("category");
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
      <div className="mb-10">
        <h1 className="text-4xl">Projects</h1>
        <p className="mt-3 text-ink-soft max-w-prose">
          Residential, hospitality, commercial, retail, workplace and wellness projects specified
          with Arcadia surfaces.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10 border-b border-ink/10 pb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`text-sm px-4 py-2 border ${
              category === c.value
                ? "border-ink bg-ink text-stone-50"
                : "border-ink/20 hover:border-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && loading && <Loader label="Loading projects" />}
      {!error && !loading && state.items.length === 0 && (
        <p className="text-ink-soft py-16 text-center">No projects in this category yet.</p>
      )}
      {!error && !loading && state.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
            {state.items.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>

          {state.pages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: state.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 text-sm border ${
                    p === state.page ? "border-ink bg-ink text-stone-50" : "border-ink/20 hover:border-ink"
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
  );
}
