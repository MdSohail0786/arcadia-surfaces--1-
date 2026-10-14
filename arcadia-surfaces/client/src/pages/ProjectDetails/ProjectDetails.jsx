import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProjectBySlug } from "../../services/projectApi";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

export default function ProjectDetails() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const load = () => {
    setData(null);
    setError(null);
    fetchProjectBySlug(slug)
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(load, [slug]);

  useSeo({
    title: data?.project?.title,
    description: data?.project?.shortDescription,
    image: data?.project?.coverImage?.url,
  });

  const allImages = data
    ? [data.project.coverImage, ...(data.project.gallery || [])].filter(Boolean)
    : [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % allImages.length)),
    [allImages.length]
  );
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + allImages.length) % allImages.length
      ),
    [allImages.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, next, prev]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <Loader label="Loading project" />;

  const { project } = data;

  return (
    <div>
      <div className="relative h-[70vh] min-h-[440px]">
        <img
          src={project.coverImage?.url}
          alt={project.coverImage?.alt || project.title}
          className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
          onClick={() => setLightboxIndex(0)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="container-page relative h-full flex flex-col justify-end pb-12 text-stone-50">
          <nav className="text-xs mb-4 text-stone-200/80">
            <Link to="/projects" className="hover:text-stone-50">
              Projects
            </Link>{" "}
            / {project.title}
          </nav>
          <p className="text-sm uppercase tracking-wide text-stone-200/80 mb-2">
            {project.category} {project.year ? `· ${project.year}` : ""}
          </p>
          <h1 className="font-display text-4xl md:text-5xl max-w-[24ch]">{project.title}</h1>
          <p className="mt-2 text-stone-200/90">{project.location}</p>
        </div>
      </div>

      <div className="container-page py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-6">
          <p className="text-lg leading-relaxed">{project.description}</p>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-1">Location</h3>
            <p className="text-ink-soft">{project.location}</p>
          </div>
          {project.architect && (
            <div>
              <h3 className="font-medium mb-1">Architect / Designer</h3>
              <p className="text-ink-soft">{project.architect}</p>
            </div>
          )}
          {project.year && (
            <div>
              <h3 className="font-medium mb-1">Year</h3>
              <p className="text-ink-soft">{project.year}</p>
            </div>
          )}
        </div>
      </div>

      {allImages.length > 1 && (
        <div className="container-page pb-16">
          <h2 className="text-2xl mb-6">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allImages.map((img, i) => (
              <button
                key={img.url + i}
                onClick={() => setLightboxIndex(i)}
                className="aspect-[4/3] bg-stone-200 overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={img.alt || project.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {(project.relatedCollections?.length > 0 || project.relatedProducts?.length > 0) && (
        <div className="container-page pb-16 border-t border-ink/10 pt-12">
          {project.relatedCollections?.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl mb-4">Collections used</h2>
              <div className="flex flex-wrap gap-4">
                {project.relatedCollections.map((c) => (
                  <Link
                    key={c._id}
                    to={`/collections/${c.slug}`}
                    className="border border-ink/20 px-4 py-2 text-sm hover:border-ink transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center">
          <button
            aria-label="Close gallery"
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-stone-50 p-2"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-4 md:left-8 text-stone-50 p-2"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <img
            src={allImages[lightboxIndex]?.url}
            alt={allImages[lightboxIndex]?.alt || project.title}
            className="max-h-[85vh] max-w-[85vw] object-contain"
          />
          <button
            aria-label="Next image"
            onClick={next}
            className="absolute right-4 md:right-8 text-stone-50 p-2"
          >
            <ChevronRight size={28} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
