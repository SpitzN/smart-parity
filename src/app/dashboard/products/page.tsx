import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProducts } from "../_components/NoProducts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ProductGrid } from "../_components/ProductGrid";

export default async function ProductsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const products = await getProducts(userId);

  if (products.length === 0) return <NoProducts />;

  return (
    <>
      <h1 className="mb-6 flex justify-between text-3xl font-semibold">
        Products
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="mr-2 size-4" />
            New Product
          </Link>
        </Button>
      </h1>
      <ProductGrid products={products} />
    </>
  );
}
