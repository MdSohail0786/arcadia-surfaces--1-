import { useEffect } from "react";

const SITE_NAME = "Arcadia Surfaces";
const DEFAULT_DESCRIPTION =
  "Arcadia Surfaces designs and manufactures architectural wallcoverings for residential, hospitality and commercial interiors.";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets document title + meta description + Open Graph/Twitter tags for the
 * current page. No external dependency (react-helmet, etc.) — just direct
 * DOM writes on mount/update, reverted implicitly when the next page's call
 * overwrites the same tags. Good enough for a client-rendered SPA; a real
 * deployment wanting these visible to crawlers before JS runs would want
 * SSR/prerendering, which is out of scope here.
 */
export function useSeo({ title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertCanonical(window.location.origin + window.location.pathname);
  }, [title, description, image, noindex]);
}
