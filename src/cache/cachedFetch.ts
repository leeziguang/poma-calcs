import { staticCache } from "./index";

function urlToSlug(url: string): string {
  const parts = url.split("/");
  return parts.slice(-2).join("__");
}

export async function cachedFetch<T>(url: string): Promise<T> {
  const slug = urlToSlug(url);
  const cached = staticCache[slug];
  if (cached !== undefined) return cached as T;

  return fetch(url).then(r => r.json());
}
