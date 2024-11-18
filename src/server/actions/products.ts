"use server";

import {
  productCountryDiscountsSchema,
  productCustomizationSchema,
  productDetailsSchema,
} from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
  updateProduct as updateProductDb,
  updateCountryDiscounts as updateCountryDiscountsDb,
  updateProductCustomization as updateProductCustomizationDb,
} from "@/server/db/products";
import { redirect } from "next/navigation";
import { canCreateProduct, canCustomizeBanner } from "@/server/permissions";

export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>,
): Promise<{ error: boolean; message: string } | undefined> {
  // validate the data
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);
  const errorMassage = "Error creating product";
  const canCreate = await canCreateProduct(userId);

  if (!success || userId == null || !canCreate) {
    return { error: true, message: errorMassage };
  }

  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?=tab=countries`);
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productDetailsSchema>,
): Promise<{ error: boolean; message: string } | undefined> {
  // validate the data
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);
  const errorMassage = "Error updating product";
  const successMessage = "Product updated successfully";

  if (!success || userId == null) {
    return { error: true, message: errorMassage };
  }

  const isSuccess = await updateProductDb({ ...data }, { id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? successMessage : errorMassage,
  };
}

export async function updateCountryDiscounts(
  id: string,
  unsafeData: z.infer<typeof productCountryDiscountsSchema>,
) {
  const { userId } = await auth();
  const { success, data } = productCountryDiscountsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error saving your country discounts",
    };
  }

  const insert: {
    countryGroupId: string;
    productId: string;
    coupon: string;
    discountPercentage: number;
  }[] = [];
  const deleteIds: { countryGroupId: string }[] = [];

  data.groups.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
        productId: id,
      });
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId });
    }
  });

  await updateCountryDiscountsDb(deleteIds, insert, { productId: id, userId });

  return { error: false, message: "Country discounts saved" };
}

export async function updateProductCustomization(
  productId: string,
  unsafeData: z.infer<typeof productCustomizationSchema>,
) {
  const errorMassage = "Error updating product customization";
  const successMessage = "Product customization updated successfully";

  const { userId } = await auth();
  const { success, data } = productCustomizationSchema.safeParse(unsafeData);
  const canCustomize = await canCustomizeBanner(userId);

  if (!success || userId == null || !canCustomize) {
    return { error: true, message: errorMassage };
  }

  await updateProductCustomizationDb(data, { productId, userId });

  return {
    error: !success,
    message: success ? successMessage : errorMassage,
  };
}

export async function deleteProduct(id: string) {
  const { userId } = await auth();
  const errorMassage = "Error deleting product";
  const successMessage = "Product deleted successfully";
  if (userId == null) return { error: true, message: errorMassage };

  const isSuccess = await deleteProductDb({ id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? successMessage : errorMassage,
  };
}
