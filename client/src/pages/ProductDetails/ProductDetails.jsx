import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProductBySlug } from "../../services/productApi";
import { useEnquiry } from "../../context/EnquiryContext";
import ProductCard from "../../components/cards/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

export default function ProductDetails() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { items, addItem } = useEnquiry();
  const navigate = useNavigate();

  const load = () => {
    setData(null);
    setError(null);
    setActiveImage(0);
    fetchProductBySlug(slug)
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(load, [slug]);

  useSeo({
    title: data?.product?.name,
    description: data?.product?.technicalInfo || `${data?.product?.name} — Arcadia Surfaces`,
    image: data?.product?.images?.[0]?.url,
  });

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <Loader label="Loading product" />;

  const { product, related } = data;
  const inBasket = items.some((i) => i.productId === product._id);

  return (
    <div className="container-page py-16">
      <nav className="text-xs text-ink-soft mb-8">
        <Link to="/collections" className="hover:text-ink">
          Collections
        </Link>{" "}
        /{" "}
        <Link to={`/collections/${product.collectionRef?.slug}`} className="hover:text-ink">
          {product.collectionRef?.name}
        </Link>{" "}
        / {product.name}
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-stone-200 overflow-hidden">
            <img
              src={product.images?.[activeImage]?.url}
              alt={product.images?.[activeImage]?.alt || product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 overflow-hidden border ${
                    i === activeImage ? "border-ink" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-ink-soft">{product.productCode}</p>
          <h1 className="text-3xl mt-1">{product.name}</h1>
          <p className="text-sm text-ink-soft mt-2 capitalize">
            {product.material?.replace("-", " ")} · {product.collectionRef?.name}
          </p>

          {product.technicalInfo && (
            <p className="mt-6 leading-relaxed text-ink-soft">{product.technicalInfo}</p>
          )}

          <dl className="mt-6 grid grid-cols-3 gap-4 text-sm border-t border-ink/10 pt-6">
            {product.dimensions?.widthCm && (
              <div>
                <dt className="text-ink-soft">Width</dt>
                <dd>{product.dimensions.widthCm} cm</dd>
              </div>
            )}
            {product.dimensions?.rollLengthM && (
              <div>
                <dt className="text-ink-soft">Roll length</dt>
                <dd>{product.dimensions.rollLengthM} m</dd>
              </div>
            )}
            {Boolean(product.dimensions?.repeatCm) && (
              <div>
                <dt className="text-ink-soft">Repeat</dt>
                <dd>{product.dimensions.repeatCm} cm</dd>
              </div>
            )}
          </dl>

          {product.finishes?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-1">Available finishes</h3>
              <p className="text-sm text-ink-soft">{product.finishes.join(", ")}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => addItem(product)}
              disabled={inBasket}
              className="border border-ink px-5 py-3 text-sm hover:bg-ink hover:text-stone-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              {inBasket ? "Added to enquiry" : "Add to Enquiry"}
            </button>
            <button
              onClick={() => {
                addItem(product);
                navigate("/enquiry");
              }}
              className="border border-ink/30 px-5 py-3 text-sm text-center hover:border-ink transition-colors"
            >
              Request a Sample
            </button>
            <button
              onClick={() => {
                addItem(product);
                navigate("/enquiry");
              }}
              className="border border-ink/30 px-5 py-3 text-sm text-center hover:border-ink transition-colors"
            >
              Request Information
            </button>
            {product.technicalSheetUrl ? (
              <a
                href={product.technicalSheetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline underline-offset-4 text-ink-soft hover:text-ink"
              >
                Download Technical Sheet
              </a>
            ) : (
              <span className="text-sm text-ink-soft">Technical sheet available on request</span>
            )}
          </div>
        </div>
      </div>

      {related?.length > 0 && (
        <div className="mt-24 border-t border-ink/10 pt-16">
          <h2 className="text-2xl mb-8">More from this collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
