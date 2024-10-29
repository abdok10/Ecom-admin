"use client";

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
import { usePathname } from "next/navigation";

interface DeleteAlertProps {
  children?: React.ReactNode;
  isPending: boolean;
  onDelete: () => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

enum COMPONENT_TYPES {
  "billboards",
  "categories",
  "orders",
  "settings",
}

const DeleteAlert = ({
  children,
  isPending,
  onDelete,
  open,
  onOpenChange,
}: DeleteAlertProps) => {
  const pathname = usePathname();

  const getComponentType = () => {
    if (pathname.includes("billboards")) return "billboard";
    if (pathname.includes("categories")) return "category";
    if (pathname.includes("products")) return "product";
    if (pathname.includes("orders")) return "order";
    return "item";
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onDelete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your {getComponentType()} and remove all related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteAlert;
