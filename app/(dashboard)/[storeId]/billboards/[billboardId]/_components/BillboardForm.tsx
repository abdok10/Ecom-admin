"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import {
  createBillboard,
  updateBillboard,
  deleteBillboard,
} from "@/actions/billboard";
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
  label: z.string().min(1, "Label is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
});

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateBillboard(
              initialData.id,
              params.storeId as string,
              data
            )
          : await createBillboard(params.storeId as string, data);

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success(initialData ? "Billboard updated" : "Billboard created");
        // router.refresh();
        router.push(`/${params.storeId}/billboards`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  const onDelete = async () => {
    startTransition(async () => {
      try {
        if (!initialData) return;

        const result = await deleteBillboard(
          initialData.id,
          params.storeId as string
        );

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success("Billboard deleted");
        router.push(`/${params.storeId}/billboards`);
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isPending}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Billboard label"
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

export default BillboardForm;
