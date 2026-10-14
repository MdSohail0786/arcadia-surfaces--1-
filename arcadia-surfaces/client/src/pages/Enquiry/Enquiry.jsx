import { Link } from "react-router-dom";
import { useEnquiry } from "../../context/EnquiryContext";
import { useSeo } from "../../hooks/useSeo";

export default function Enquiry() {
  useSeo({ title: "Your Enquiry", noindex: true });
  const { items, removeItem, clear } = useEnquiry();

  return (
    <div className="container-page py-16">
      <h1 className="text-4xl mb-3">Your enquiry</h1>
      <p className="text-ink-soft max-w-prose mb-10">
        Products you'd like more information on. Submit this list from the contact page and our
        team will follow up with samples, pricing and lead times.
      </p>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink-soft mb-6">Your enquiry list is empty.</p>
          <Link
            to="/collections"
            className="inline-block border border-ink/30 px-5 py-2.5 hover:bg-ink hover:text-stone-50 transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 py-4">
                <div className="w-16 h-16 bg-stone-200 overflow-hidden shrink-0">
                  {item.image && (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link to={`/products/${item.slug}`} className="hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-xs text-ink-soft">{item.productCode}</p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-ink-soft hover:text-ink underline underline-offset-4"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              state={{ products: items }}
              className="bg-ink text-stone-50 px-6 py-3 text-sm hover:bg-bronze transition-colors"
            >
              Continue to Contact Form
            </Link>
            <button
              onClick={clear}
              className="text-sm text-ink-soft hover:text-ink underline underline-offset-4"
            >
              Clear list
            </button>
          </div>
        </>
      )}
    </div>
  );
}
