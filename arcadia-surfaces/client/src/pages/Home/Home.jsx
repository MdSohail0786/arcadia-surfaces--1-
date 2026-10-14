import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchCollections } from "../../services/collectionApi";
import { fetchProjects } from "../../services/projectApi";
import CollectionCard from "../../components/cards/CollectionCard";
import ProjectCard from "../../components/cards/ProjectCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import NewsletterSignup from "../../components/forms/NewsletterSignup";
import { useSeo } from "../../hooks/useSeo";

export default function Home() {
  useSeo({
    title: "Architectural Wallcoverings",
    description:
      "Arcadia Surfaces: architectural wallcoverings shaped through art, material and craftsmanship. Explore the Creative Collection and Special Editions.",
  });
  const [featured, setFeatured] = useState(null);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState(null);
  const [projectsError, setProjectsError] = useState(null);

  const load = () => {
    setError(null);
    setFeatured(null);
    fetchCollections({ limit: 4, sort: "-featured -createdAt" })
      .then((data) => setFeatured(data.items))
      .catch((err) => setError(err.message));
  };

  const loadProjects = () => {
    setProjectsError(null);
    setProjects(null);
    fetchProjects({ limit: 3, sort: "-featured -year" })
      .then((data) => setProjects(data.items))
      .catch((err) => setProjectsError(err.message));
  };

  useEffect(load, []);
  useEffect(loadProjects, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[560px] flex items-end overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920"
          alt="Textured architectural wallcovering in a minimal interior"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

        <div className="container-page relative pb-16 text-stone-100">
          <motion.h1
            className="font-display text-4xl sm:text-6xl max-w-[16ch] leading-[1.05] text-stone-200"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            Surfaces with a sense of place.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[46ch] text-stone-100/90"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
          >
            Architectural wallcoverings shaped through art, material and
            craftsmanship — designed in Italy, installed everywhere.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <Link
              to="/collections"
              className="bg-stone-50 text-ink px-6 py-3 text-sm hover:bg-bronze hover:text-stone-50 transition-colors"
            >
              Explore Collections
            </Link>
            <Link
              to="/collections"
              className="border border-stone-50/60 px-6 py-3 text-sm hover:bg-stone-50/10 transition-colors"
            >
              Discover Our World
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="container-page py-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl">Featured collections</h2>
          <Link
            to="/collections"
            className="text-sm border-b border-ink/30 hover:border-ink"
          >
            View all collections
          </Link>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !featured && <Loader label="Loading collections" />}
        {!error && featured && featured.length === 0 && (
          <p className="text-ink-soft">No collections available yet.</p>
        )}
        {!error && featured && featured.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {featured.map((c, i) => (
              <div
                key={c._id}
                className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
              >
                <CollectionCard
                  collection={c}
                  size={i === 0 ? "large" : "default"}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Brand statement */}
      <section className="container-page py-24 border-t border-ink/10">
        <p className="font-display text-3xl md:text-5xl max-w-[20ch] leading-tight">
          Where architecture becomes atmosphere.
        </p>
        <p className="mt-8 max-w-prose text-ink-soft">
          Every Arcadia surface begins as a material study — a quarry face, a
          glaze test, a shipping manifest — before it becomes a pattern. We work
          with architects and designers to adapt scale, color and substrate to a
          single wall or an entire building, so the surface always answers to
          the space it's made for.
        </p>
      </section>

      {/* Featured projects */}
      <section className="container-page py-24 border-t border-ink/10">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl">Featured projects</h2>
          <Link
            to="/projects"
            className="text-sm border-b border-ink/30 hover:border-ink"
          >
            View all projects
          </Link>
        </div>

        {projectsError && (
          <ErrorState message={projectsError} onRetry={loadProjects} />
        )}
        {!projectsError && !projects && <Loader label="Loading projects" />}
        {!projectsError && projects && projects.length === 0 && (
          <p className="text-ink-soft">No projects published yet.</p>
        )}
        {!projectsError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="border-t border-ink/10 bg-ink text-stone-50">
        <div className="container-page py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h2 className="text-3xl max-w-[16ch]">Join the journal.</h2>
            <p className="mt-3 text-stone-200/80 max-w-[40ch]">
              New collections, project stories and material research, a few
              times a year.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="border-t border-ink/10">
        <div className="container-page py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl max-w-[18ch]">
              Building something specific?
            </h2>
            <p className="mt-3 text-ink-soft max-w-[44ch]">
              Add products to your enquiry list while you browse, then send it
              to our team in one step.
            </p>
          </div>
          <Link
            to="/enquiry"
            className="shrink-0 border border-ink px-6 py-3 text-sm hover:bg-ink hover:text-stone-50 transition-colors"
          >
            View Your Enquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
