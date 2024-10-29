"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import {
  createSize,
  updateSize,
  deleteSize,
} from "@/actions/size";
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
  value: z.string().min(1, "Value is required"),
});

interface SizeFormProps {
  initialData: Size | null;
}

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm = ({ initialData }: SizeFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit a Size" : "Add a new Size";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateSize(
              initialData.id,
              params.storeId as string,
              data
            )
          : await createSize(params.storeId as string, data);

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success(initialData ? "Size updated" : "Size created");
        router.push(`/${params.storeId}/sizes`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  const onDelete = async () => {
    startTransition(async () => {
      try {
        if (!initialData) return;

        const result = await deleteSize(
          initialData.id,
          params.storeId as string
        );

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success("Size deleted");
        router.push(`/${params.storeId}/sizes`);
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
                      placeholder="Size name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Size value"
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

export default SizeForm;
