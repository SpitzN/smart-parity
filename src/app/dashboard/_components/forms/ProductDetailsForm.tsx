"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { productDetailsSchema } from "@/schemas/products";
import { createProduct, updateProduct } from "@/server/actions/products";
import { useToast } from "@/hooks/use-toast";
import RequiredLabelIcon from "@/components/common/RequiredLabelIcon";

export default function ProductDetailsForm({
  product,
}: {
  product?: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: product
      ? { ...product, description: product?.description ?? "" }
      : {
          name: "",
          url: "",
          description: "",
        },
  });

  async function onSubmit(values: z.infer<typeof productDetailsSchema>) {
    const action =
      product == null ? createProduct : updateProduct.bind(null, product.id);
    const data = await action(values);

    if (data?.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {/* <FormErrorMessage>{form.errors.name?.message}</FormErrorMessage> */}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Enter your website URL
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Include the protocol (e.g. https://) and the full path of the
                  sales page
                </FormDescription>
                {/* <FormErrorMessage>{form.errors.name?.message}</FormErrorMessage> */}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                An optional description of your product to help you remember
                what it is
              </FormDescription>
              {/* <FormErrorMessage>
                  {form.errors.description?.message}
                </FormErrorMessage> */}
            </FormItem>
          )}
        />
        <div className="self-end">
          <button
            type="submit"
            className=""
            disabled={form.formState.isSubmitting}
          >
            Save
          </button>
        </div>
      </form>
    </Form>
  );
}
