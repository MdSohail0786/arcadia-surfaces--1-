import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden bg-stone-200 aspect-square">
        <img
          src={product.images?.[0]?.url}
          alt={product.images?.[0]?.alt || product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h4 className="text-sm">{product.name}</h4>
        <p className="text-xs text-ink-soft mt-1">{product.productCode}</p>
      </div>
    </Link>
  );
}
