"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Billboard, Category } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/category";
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
import DeleteAlert from "@components/global/DeleteAlert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  billboardId: z.string().min(1, "Billboard id is required"),
});

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[]
}

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add a new Category";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateCategory(
              initialData.id,
              params.storeId as string,
              data
            )
          : await createCategory(params.storeId as string, data);

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success(initialData ? "Category updated" : "Category created");
        // router.refresh();
        router.push(`/${params.storeId}/categories`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  const onDelete = async () => {
    startTransition(async () => {
      try {
        if (!initialData) return;

        const result = await deleteCategory(
          initialData.id,
          params.storeId as string
        );

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success("Category deleted");
        router.push(`/${params.storeId}/categories`);
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Category name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                        placeholder="Select a billboard"

                    />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {billboards.map((billboard) => (
                            <SelectItem key={billboard.id} value={billboard.id}>
                                {billboard.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
