import { Link } from "react-router-dom";

export default function CollectionCard({ collection, size = "default" }) {
  const isLarge = size === "large";

  return (
    <Link to={`/collections/${collection.slug}`} className="group block">
      <div
        className={`overflow-hidden bg-stone-200 ${isLarge ? "aspect-[4/5]" : "aspect-[3/4]"}`}
      >
        <img
          src={collection.heroImage?.url}
          alt={collection.heroImage?.alt || collection.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-display ${isLarge ? "text-2xl" : "text-lg"}`}>{collection.name}</h3>
          <p className="text-sm text-ink-soft mt-1 max-w-[38ch]">{collection.shortDescription}</p>
        </div>
      </div>
    </Link>
  );
}
