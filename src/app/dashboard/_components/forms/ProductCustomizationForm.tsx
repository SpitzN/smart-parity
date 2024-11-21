"use client";

import Banner from "@/components/common/Banner";
import NoPermissionCard from "@/components/common/NoPermissionCard";
import RequiredLabelIcon from "@/components/common/RequiredLabelIcon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { productCustomizationSchema } from "@/schemas/products";
import { updateProductCustomization } from "@/server/actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ProductCustomizationFormProps = {
  customization: {
    productId: string;
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    bannerContainer: string;
    isSticky: boolean;
    classPrefix: string | null;
  };
  canRemoveBranding: boolean;
  canCustomizeBanner: boolean;
};

export default function ProductCustomizationForm({
  customization,
  canRemoveBranding,
  canCustomizeBanner,
}: ProductCustomizationFormProps) {
  const form = useForm<z.infer<typeof productCustomizationSchema>>({
    resolver: zodResolver(productCustomizationSchema),
    defaultValues: {
      ...customization,
      classPrefix: customization.classPrefix ?? "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof productCustomizationSchema>) {
    const data = await updateProductCustomization(
      customization.productId,
      values,
    );

    if (data?.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  const formValues = form.watch();

  return (
    <>
      <div>
        <Banner
          canRemoveBranding={canRemoveBranding}
          message={formValues.locationMessage}
          mappings={{
            country: "United States",
            coupon: "COUPON",
            discount: "10",
          }}
          customization={formValues}
        />
      </div>
      {!canCustomizeBanner && (
        <div className="mt-8">
          <NoPermissionCard />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              name="locationMessage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Smart Discount Message <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!canCustomizeBanner}
                      className="min-h-20 resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    {"Data Parameters: {country}, {coupon}, {discount}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="backgroundColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Background Color <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="textColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Text Color <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="fontSize"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Font Size <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="isSticky"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sticky?</FormLabel>
                    <FormControl>
                      <Switch
                        disabled={!canCustomizeBanner}
                        className="block"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bannerContainer"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner Container <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormDescription>
                      The container where the banner will be displayed, HTML
                      selector. Ex: #container , .container , body
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                name="classPrefix"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Prefix</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormDescription>
                      An optional prefix to add to the classes in the banner
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {canCustomizeBanner && (
            <div className="self-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
