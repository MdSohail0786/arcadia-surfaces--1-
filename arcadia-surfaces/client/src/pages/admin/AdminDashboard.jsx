import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminStats } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useSeo } from "../../hooks/useSeo";

export default function AdminDashboard() {
  useSeo({ title: "Dashboard", noindex: true });
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  return (
    <div className="container-page py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="text-sm text-ink-soft mt-1">Signed in as {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="text-sm border border-ink/30 px-4 py-2 hover:bg-ink hover:text-stone-50 transition-colors"
        >
          Log out
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !stats && <Loader label="Loading stats" />}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <Stat label="Collections" value={stats.collections} />
          <Stat label="Products" value={stats.products} />
          <Stat label="Projects" value={stats.projects} />
          <Stat label="Enquiries" value={stats.enquiries} />
          <Stat label="New enquiries" value={stats.newEnquiries} />
          <Stat label="Newsletter subscribers" value={stats.subscribers} />
        </div>
      )}

      <div className="border-t border-ink/10 pt-10">
        <h2 className="text-xl mb-4">Manage</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/collections"
            className="border border-ink/30 px-5 py-2.5 text-sm hover:bg-ink hover:text-stone-50 transition-colors"
          >
            Collections
          </Link>
          <Link
            to="/admin/products"
            className="border border-ink/30 px-5 py-2.5 text-sm hover:bg-ink hover:text-stone-50 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/admin/projects"
            className="border border-ink/30 px-5 py-2.5 text-sm hover:bg-ink hover:text-stone-50 transition-colors"
          >
            Projects
          </Link>
        </div>
        <p className="text-xs text-ink-soft mt-4 max-w-prose">
          Collections, Products and Projects have working CRUD UIs. The remaining 12+ admin
          modules from the spec (Diary, Materials, Catalogues, Brand Tools, Representatives, FAQ,
          Showroom, Careers, Awards, Media) would follow the same pattern — see the README.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-ink/10 p-6">
      <p className="text-3xl font-display">{value}</p>
      <p className="text-sm text-ink-soft mt-1">{label}</p>
    </div>
  );
}
