import { Link } from "react-router-dom";
import { useSeo } from "../../hooks/useSeo";

export default function NotFound() {
  useSeo({ title: "Page Not Found", noindex: true });
  return (
    <div className="container-page py-32 text-center">
      <p className="text-sm text-ink-soft mb-4">404</p>
      <h1 className="text-4xl mb-6">This page doesn't exist.</h1>
      <Link
        to="/"
        className="inline-block border border-ink/30 px-5 py-2.5 hover:bg-ink hover:text-stone-50 transition-colors"
      >
        Return home
      </Link>
    </div>
  );
}
