import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEnquiry } from "../../context/EnquiryContext";

const navLinks = [
  { to: "/collections", label: "Collections" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { items } = useEnquiry();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-stone-50/95 border-ink/10 backdrop-blur"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-20">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-xl tracking-tight"
        >
          <img
            src="/images/moraqqa-logo.png.png"
            alt="Moraqqa Logo"
            className="w-16 h-16 object-contain"
          />
          <span>MORAQQA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `pb-1 border-b transition-colors ${
                  isActive
                    ? "border-ink"
                    : "border-transparent hover:border-ink/40"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            to="/enquiry"
            className="hidden sm:inline-flex items-center gap-2 text-sm border border-ink/30 px-4 py-2 hover:bg-ink hover:text-stone-50 transition-colors"
          >
            Enquiry {items.length > 0 && `(${items.length})`}
          </Link>
          <button
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            className="md:hidden p-1"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            {drawerOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-stone-50 z-30 flex flex-col">
          <nav className="flex flex-col gap-6 p-8 text-2xl font-display">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setDrawerOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/enquiry" onClick={() => setDrawerOpen(false)}>
              Enquiry {items.length > 0 && `(${items.length})`}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
