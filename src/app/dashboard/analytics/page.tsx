import HasPermission from "@/components/common/HasPermission";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByDayChartData,
  getViewsByPPPChartData,
} from "@/server/db/productViews";
import { canAccessAnalytics } from "@/server/permissions";
import { auth } from "@clerk/nextjs/server";
import ViewsByCountryChart from "../_components/charts/ViewsByCountryChart";
import { ViewsByPurchasingPowerPrice } from "../_components/charts/ViewsByPurchasingPowerPriceChart";
import { ViewsByDayChart } from "../_components/charts/ViewsByDayChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import { getProducts } from "@/server/db/products";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: {
    interval?: string;
    timezone?: string;
    productId?: string;
  };
}) {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const timezone = searchParams.timezone ?? "UTC";
  const interval =
    CHART_INTERVALS[searchParams.interval as keyof typeof CHART_INTERVALS] ??
    CHART_INTERVALS.last7Days;
  const productId = searchParams.productId;

  return (
    <>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <HasPermission permission={canAccessAnalytics}>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {interval.label}
                  <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(CHART_INTERVALS).map(([key, value]) => (
                  <DropdownMenuItem asChild key={key}>
                    <Link
                      href={createUrl("/dashboard/analytics", searchParams, {
                        interval: key,
                      })}
                    >
                      {value.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ProductDropdown
              userId={userId}
              selectedProductId={productId}
              searchParams={searchParams}
            />
          </div>
        </HasPermission>
      </div>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard
            userId={userId}
            timezone={timezone}
            interval={interval}
            productId={productId}
          />
          <ViewsByCountryCard
            userId={userId}
            timezone={timezone}
            interval={interval}
            productId={productId}
          />
          <ViewsByPurchasingPowerPriceCard
            userId={userId}
            timezone={timezone}
            interval={interval}
            productId={productId}
          />
        </div>
      </HasPermission>
    </>
  );
}

async function ViewsByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0],
) {
  //
  const chartData = await getViewsByDayChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByCountryCard(
  props: Parameters<typeof getViewsByCountryChartData>[0],
) {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByPurchasingPowerPriceCard(
  props: Parameters<typeof getViewsByPPPChartData>[0],
) {
  const chartData = await getViewsByPPPChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per PPP Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByPurchasingPowerPrice chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ProductDropdown({
  userId,
  selectedProductId,
  searchParams,
}: {
  userId: string;
  selectedProductId?: string;
  searchParams: Record<string, string>;
}) {
  const products = await getProducts(userId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {products.find((p) => p.id === selectedProductId)?.name ??
            "All Products"}
          <ChevronDownIcon className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href={createUrl("/dashboard/analytics", searchParams, {
              productId: undefined,
            })}
          >
            All Products
          </Link>
        </DropdownMenuItem>
        {products.map((product) => (
          <DropdownMenuItem asChild key={product.id}>
            <Link
              href={createUrl("/dashboard/analytics", searchParams, {
                productId: product.id,
              })}
            >
              {product.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
