import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="group block">
      <div className="overflow-hidden bg-stone-200 aspect-[4/3]">
        <img
          src={project.coverImage?.url}
          alt={project.coverImage?.alt || project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4">
        <p className="text-xs text-ink-soft uppercase tracking-wide">
          {project.category} {project.year ? `· ${project.year}` : ""}
        </p>
        <h3 className="font-display text-lg mt-1">{project.title}</h3>
        <p className="text-sm text-ink-soft mt-1">{project.location}</p>
      </div>
    </Link>
  );
}
