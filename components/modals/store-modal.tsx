"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { createStore } from "@actions/store";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Store Name must be at least 2 characters.",
  }),
});

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createStore(values)
      .then((data) => {
        // if (data?.error) toast.error(data.error);
        if (data) toast.success("Store Created");
        console.log("Store created", { data });
      })
      .catch((error) => {
        console.error("Error creating store", { error });
        toast.error("Something went wrong!");
      });
    form.reset();
    onClose();
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
                    <Input placeholder="E-commerce" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-5 flex justify-end items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast("Calcel clicked!");
                  onClose();
                }}
              >
                Cancel
              </Button>
              <SubmitBtn pendingLabel="creating...">Create</SubmitBtn>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
