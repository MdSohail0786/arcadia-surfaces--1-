import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCollectionBySlug } from "../../services/collectionApi";
import ProductCard from "../../components/cards/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

export default function CollectionDetails() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setData(null);
    setError(null);
    fetchCollectionBySlug(slug)
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(load, [slug]);

  useSeo({
    title: data?.collection?.name,
    description: data?.collection?.shortDescription,
    image: data?.collection?.heroImage?.url,
  });

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <Loader label="Loading collection" />;

  const { collection, products } = data;

  return (
    <div>
      <div className="relative h-[60vh] min-h-[420px]">
        <img
          src={collection.heroImage?.url}
          alt={collection.heroImage?.alt || collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="container-page relative h-full flex flex-col justify-end pb-12 text-stone-50">
          <nav className="text-xs mb-4 text-stone-200/80">
            <Link to="/collections" className="hover:text-stone-50">
              Collections
            </Link>{" "}
            / {collection.name}
          </nav>
          <h1 className="font-display text-4xl md:text-5xl max-w-[20ch]">{collection.name}</h1>
        </div>
      </div>

      <div className="container-page py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-6">
          <p className="text-lg leading-relaxed">{collection.story}</p>
          {collection.designPhilosophy && (
            <p className="text-ink-soft italic border-l-2 border-bronze pl-4">
              {collection.designPhilosophy}
            </p>
          )}
        </div>
        <div className="space-y-6 text-sm">
          {collection.applications?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Applications</h3>
              <p className="text-ink-soft capitalize">{collection.applications.join(", ")}</p>
            </div>
          )}
          {collection.materials?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Materials</h3>
              <p className="text-ink-soft capitalize">
                {collection.materials.map((m) => m.replace("-", " ")).join(", ")}
              </p>
            </div>
          )}
          <Link
            to="/enquiry"
            className="inline-block border border-ink/30 px-5 py-2.5 hover:bg-ink hover:text-stone-50 transition-colors"
          >
            View Your Enquiry List
          </Link>
        </div>
      </div>

      <div className="container-page py-16 border-t border-ink/10">
        <h2 className="text-2xl mb-8">Products in this collection</h2>
        {products.length === 0 ? (
          <p className="text-ink-soft">No products published in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
