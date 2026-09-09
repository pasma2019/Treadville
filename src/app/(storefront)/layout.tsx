import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import { getCategories } from "@/lib/queries";

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