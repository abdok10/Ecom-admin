"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Billboard } from "@prisma/client";
import { useParams } from "next/navigation";

import { createBillboard, updateBillboard, deleteBillboard } from "@actions/billboard";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Heading from "@components/global/Heading";
import ImageUpload from "@components/global/ImageUpload";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  const [isUpdating, startUpdateTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    startUpdateTransition(async () => {
      const formData = new FormData();
      formData.append("label", data.label);
      formData.append("imageUrl", data.imageUrl);
      
      let result;
      if (initialData) {
        result = await updateBillboard(params.storeId as string, formData);
      } else {
        result = await createBillboard(params.storeId as string, formData);
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        toast.success(result.success);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      const result = await deleteBillboard(params.storeId as string);

      if (result.error) {
        toast.error(result.error);
        setShowDeleteAlert(false);
        return;
      }

      if (result.success) {
        toast.success(result.success);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
          <Heading
            title={title}
            description={description} 
          />
        {initialData && (
        
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              disabled={isDeleting || isUpdating}
            >
              <Trash className="size-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                billboard and remove all related data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
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
                    disabled={isUpdating}
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
                      disabled={isUpdating}
                      placeholder="Billboard label"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isUpdating} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>

      <Separator className="my-4" />
    </>
  );
};

export default BillboardForm;
