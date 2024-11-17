import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NoProducts() {
  return (
    <div className="mt-32 text-balance text-center">
      <h1 className="mb-2 text-4xl font-semibold">You have no products</h1>
      <p className="mb-4">
        Get started with PPP discounts by creating a product
      </p>
      <Button size="lg" asChild>
        <Link href="/dashboard/products/new">Add Product</Link>
      </Button>
    </div>
  );
}
