import PageWithBackButton from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductDetailsForm from "@/app/dashboard/_components/forms/ProductDetailsForm";
import HasPermission from "@/components/common/HasPermission";
import { canCreateProduct } from "@/server/permissions";

export default function NewProductPage() {
  return (
    <PageWithBackButton title="Create Product" backHref="/dashboard/products">
      <HasPermission
        permission={canCreateProduct}
        renderFallback
        fallbackText="You do not have permission to create a product. Try upgrading your account or contact support."
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailsForm />
          </CardContent>
        </Card>
      </HasPermission>
    </PageWithBackButton>
  );
}
