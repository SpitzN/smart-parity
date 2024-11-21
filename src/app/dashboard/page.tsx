import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProducts } from "./_components/NoProducts";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./_components/ProductGrid";
import HasPermission from "@/components/common/HasPermission";
import {
  CHART_INTERVALS,
  getViewsByDayChartData,
} from "@/server/db/productViews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canAccessAnalytics } from "@/server/permissions";
import { ViewsByDayChart } from "./_components/charts/ViewsByDayChart";

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const products = await getProducts(userId, { limit: 6 });

  if (products.length === 0) return <NoProducts />;
  return (
    <>
      <h2 className="mb-6 flex justify-between text-3xl font-semibold">
        <Link
          className="group flex items-center gap-2 hover:underline"
          href="/dashboard/products"
        >
          Products
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="mr-2 size-4" />
            New Product
          </Link>
        </Button>
      </h2>

      <ProductGrid products={products} />

      <h2 className="mb-6 mt-12 flex justify-between text-3xl font-semibold">
        <Link
          href="/dashboard/analytics"
          className="group flex items-center gap-2 hover:underline"
        >
          Analytics
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      </h2>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <AnalyticsChart userId={userId} />
      </HasPermission>
    </>
  );
}

async function AnalyticsChart({ userId }: { userId: string }) {
  const chartData = await getViewsByDayChartData({
    userId,
    interval: CHART_INTERVALS.last30Days,
    timezone: "UTC",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
