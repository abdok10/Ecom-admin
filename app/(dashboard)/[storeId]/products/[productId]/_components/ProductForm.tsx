"use client";

import { useTransition } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Image, Product } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { createProduct, updateProduct, deleteProduct } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/global/Heading";
import ImageUpload from "@/components/global/ImageUpload";
import DeleteAlert from "@components/global/DeleteAlert";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1),
  images: z
    .object({
      url: z.string().url("Invalid image URL"),
    })
    .array()
    .min(1, "At least one product image is required"),
  categoryId: z.string().min(1, "Category is required"),
  sizeId: z.string().min(1, "Size is required"),
  colorId: z.string().min(1, "Color is required"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
}

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm = ({ initialData }: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a Product" : "Add a new Product";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData.price)),
        }
      : {
          name: "",
          price: 0,
          images: [],
          isFeatured: false,
          isArchived: false,
          categoryId: "",
          sizeId: "",
          colorId: "",
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateProduct(initialData.id, params.storeId as string, data)
          : await createProduct(params.storeId as string, data);

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success(initialData ? "Product updated" : "Product created");
        // router.refresh();
        router.push(`/${params.storeId}/products`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  const onDelete = async () => {
    startTransition(async () => {
      try {
        if (!initialData) return;

        const result = await deleteProduct(
          initialData.id,
          params.storeId as string
        );

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success("Product deleted");
        router.push(`/${params.storeId}/products`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <DeleteAlert isPending={isPending} onDelete={onDelete}>
            <Button variant="destructive" size="icon" disabled={isPending}>
              <Trash className="size-4" />
            </Button>
          </DeleteAlert>
        )}
      </div>

      <Separator className="my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={isPending}
                    // onChange={(url) => {
                    //   field.onChange([...field.value, { url }]);
                    // }}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Procut Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending} className="ml-auto">
            {isPending ? "Loading..." : action}
          </Button>
        </form>
      </Form>

      <Separator className="my-4" />
    </>
  );
};

export default ProductForm;
