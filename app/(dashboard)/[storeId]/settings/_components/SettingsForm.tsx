"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { Store } from "@prisma/client";

import { deleteStore, updateStore } from "@actions/store";
import { useOrigin } from "@hooks/use-origin";

import { ApiAlert } from "@components/global/ApiAlert";
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

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .max(50, "Store name cannot exceed 50 characters"),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const origin = useOrigin();
  const params = useParams();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  const [isUpdating, startUpdateTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    startUpdateTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);

      const result = await updateStore(params.storeId as string, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success) {
        toast.success(result.success);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      const result = await deleteStore(params.storeId as string);

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
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-sm text-gray-600">Manage store preferences</p>
          </div>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              disabled={isDeleting || isUpdating}
            >
              <Trash className="size-4" />
            </Button>
          </AlertDialogTrigger>
        </div>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              store and remove all related data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
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

      <Separator className="my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdating}
                      placeholder="Store Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isUpdating} className="ml-auto">
            Save Changes
          </Button>
        </form>
      </Form>

      <Separator className="my-4" />

        <ApiAlert 
          title="NEXT_PUBLIC_API_URL" 
          description={`${origin}/api/${params.storeId}`} 
          variant="public"
        />
    </>
  );
};

export default SettingsForm;
