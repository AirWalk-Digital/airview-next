export function isLinkInternal(url: string) {
  return /^\/(?!\/)/.test(url);
}
