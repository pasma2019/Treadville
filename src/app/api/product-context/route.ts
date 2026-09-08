import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  try {
    const product = await getProductBySlug(slug);
    if (!product || product.status !== "published") {
      return NextResponse.json({ name: null }, { status: 404 });
    }
    return NextResponse.json({ name: product.name, slug: product.slug });
  } catch {
    return NextResponse.json({ name: null }, { status: 500 });
  }
}
