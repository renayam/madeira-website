const XBACKBONE_DOMAIN = "xbackbone.madeira.eco";

export type GetProxiedImageUrl = (url: string) => string;

export function getProxiedImageUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === XBACKBONE_DOMAIN) {
      return `/api/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
  } catch {
    return url;
  }
}
