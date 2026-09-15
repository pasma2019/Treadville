// Slice 12: the auth pages (/admin/login, forgot-password, reset-password) are
// client components that rely on hydration, so they must be dynamically
// rendered for the proxy nonce to be attached to their bootstrap scripts.
export const dynamic = "force-dynamic";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}