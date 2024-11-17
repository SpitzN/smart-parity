import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

export const productDetailsSchema = z.object({
  name: z.string().min(3, "required").max(255, "max 255 characters"),
  url: z
    .string()
    .url("invalid url")
    .min(3, "required")
    .transform(removeTrailingSlash),
  description: z.string().optional(),
});

export const productCountryDiscountsSchema = z.object({
  groups: z.array(
    z
      .object({
        countryGroupId: z.string().min(3, "Required"),
        discountPercentage: z
          .number()
          .int()
          .max(100, "Max 100")
          .min(1, "Min 1")
          .or(z.nan().transform((n) => (isNaN(n) ? undefined : n)))
          .optional(),
        coupon: z.string().optional(),
      })
      .refine(
        (value) => {
          const hasCoupon = value.coupon != null && value.coupon.length > 0;
          const hasDiscount = value.discountPercentage != null;
          return !(hasCoupon && !hasDiscount);
        },
        {
          message: "A discount is required if a coupon code is provided",
          path: ["root"],
        },
      ),
  ),
});
