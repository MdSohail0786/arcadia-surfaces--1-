import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import Project from "../models/Project.js";

function xmlEscape(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// GET /sitemap.xml
export async function getSitemap(req, res, next) {
  try {
    const base = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0];

    const staticRoutes = ["/", "/collections", "/projects", "/contact", "/enquiry"];

    const [collections, products, projects] = await Promise.all([
      Collection.find({ status: "published" }).select("slug updatedAt").lean(),
      Product.find({ status: "published" }).select("slug updatedAt").lean(),
      Project.find({ status: "published" }).select("slug updatedAt").lean(),
    ]);

    const urls = [
      ...staticRoutes.map((path) => ({ loc: `${base}${path}`, lastmod: null })),
      ...collections.map((c) => ({ loc: `${base}/collections/${c.slug}`, lastmod: c.updatedAt })),
      ...products.map((p) => ({ loc: `${base}/products/${p.slug}`, lastmod: p.updatedAt })),
      ...projects.map((p) => ({ loc: `${base}/projects/${p.slug}`, lastmod: p.updatedAt })),
    ];

    const body = urls
      .map(
        (u) =>
          `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>${
            u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""
          }\n  </url>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

// GET /robots.txt
export function getRobots(req, res) {
  const base = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0];
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /enquiry",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");

  res.type("text/plain").send(body);
}
