"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

import SubmitBtn from "@components/SubmitBtn";
import { Modal } from "@components/ui/modal";
import { useStoreModal } from "@hooks/use-store-modal";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import toast from "react-hot-toast";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Store Name must be at least 2 characters.",
  }),
});

export const StoreModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useStoreModal();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await axios.post("/api/stores", values);

      // hard reload in case the modal is stuck open
      // window.location.assign(`/${response.data.id}`);
      router.push(`/${response.data.id}`);
      onClose();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E-commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-5 flex justify-end items-center gap-2">
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <SubmitBtn pendingLabel="creating..." loading={loading}>Create</SubmitBtn>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
