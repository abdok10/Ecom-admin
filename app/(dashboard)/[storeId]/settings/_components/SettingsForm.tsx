"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

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
import { updateStore } from "@actions/store";

interface SettingsFormProps {
  initialData: {
    id: string;
    name: string;
  };
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .max(50, "Store name cannot exceed 50 characters"),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    startTransition(async () => {
      // Create FormData instance
      const formData = new FormData();
      formData.append("name", data.name);

      const result = await updateStore(initialData.id, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.message) {
        toast.success(result.message);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-sm text-gray-600">Manage store preferences</p>
        </div>
        <Button
          variant="destructive"
          disabled={isPending}
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Store Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending} className="ml-auto">
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
