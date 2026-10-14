import { Link } from "react-router-dom";

const columns = [
  {
    title: "Collections",
    links: [
      { label: "All Collections", to: "/collections" },
      { label: "Creative Collection", to: "/collections?category=creative" },
      { label: "Special Editions", to: "/collections?category=special-edition" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "All Projects", to: "/projects" },
    ],
  },
  {
    title: "Enquiries",
    links: [{ label: "Your Enquiry List", to: "/enquiry" }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="container-page py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-2">
          <Link to="/" className="font-display text-lg">
            Arcadia Surfaces
          </Link>
          <p className="text-sm text-ink-soft mt-3 max-w-[36ch]">
            Architectural wallcoverings shaped through art, material and craftsmanship. This is a
            focused product slice of a larger brand concept — collections, projects, journal,
            professional tools and admin CRUD are documented in the README as the next build
            phases.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-sans font-medium mb-4">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ink-soft hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ink/10">
        <div className="container-page py-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-ink-soft">
          <span>© {new Date().getFullYear()} Arcadia Surfaces. All rights reserved.</span>
          <Link to="/admin/login" className="hover:text-ink">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}
