import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import { getCategories } from "@/lib/queries";

// Slice 12: nonce-based CSP requires dynamic SSR so Next.js can apply the
// per-request nonce to inline bootstrap scripts. The storefront routes are
// already dynamically rendered (ƒ); this keeps the otherwise-static /checkout
// and /contact pages (client components, so they cannot opt out themselves)
// on the same nonce path instead of being prerendered without one.
export const dynamic = "force-dynamic";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <>
      <SiteHeader categories={categories} />
      {children}
      <SiteFooter />
      <CartDrawer />
    </>
  );
}