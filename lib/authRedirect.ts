export const DEFAULT_AUTHENTICATED_ROUTE = "/workspace";
export const DEFAULT_ADMIN_ROUTE = "/admin";

export function getRoleDefaultRoute(role?: string | null, verificationStatus?: string | null): string {
  if (role === "admin") return DEFAULT_ADMIN_ROUTE;
  if (verificationStatus === "pending") return "/pending";
  if (verificationStatus === "rejected") return "/rejected";
  if (verificationStatus === "suspended") return "/suspended";
  return DEFAULT_AUTHENTICATED_ROUTE;
}

export function sanitizeReturnPath(
  value: string | null | undefined,
  defaultRoute: string = DEFAULT_AUTHENTICATED_ROUTE
): string {
  if (!value || value === "/" || !value.startsWith("/") || value.startsWith("//")) {
    return defaultRoute;
  }

  if (value.startsWith("/sign-in") || value.startsWith("/sign-up")) {
    return defaultRoute;
  }

  return value;
}

export function buildSignInUrl(returnPath: string): string {
  const safeReturnPath = sanitizeReturnPath(returnPath);
  return `/sign-in?redirect=${encodeURIComponent(safeReturnPath)}`;
}

