import moment from "moment";
import { staticCache } from "./index";

function urlToSlug(url: string): string {
  const parts = url.split("/");
  return parts.slice(-2).join("__");
}

function isStaticCacheFresh(): boolean {
  const ts = localStorage.getItem("poma_ts");
  if (!ts) return false;
  return moment().diff(moment(Number(ts)), "hours") < 24;
}

export async function cachedFetch<T>(url: string): Promise<T> {
  const slug = urlToSlug(url);
  const cached = staticCache[slug];
  if (cached !== undefined && isStaticCacheFresh()) return cached as T;

  return fetch(url)
    .then(r => r.json())
    .then(data => {
      localStorage.setItem("poma_ts", String(moment().valueOf()));
      return data;
    });
}
