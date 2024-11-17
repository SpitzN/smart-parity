import PageWithBackButton from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductDetailsForm from "@/app/dashboard/_components/forms/ProductDetailsForm";

export default function NewProductPage() {
  return (
    <div>
      <PageWithBackButton title="New Product" backHref="/products">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailsForm />
          </CardContent>
        </Card>
      </PageWithBackButton>
    </div>
  );
}
