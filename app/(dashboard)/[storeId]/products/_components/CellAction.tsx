"use client";

import toast from "react-hot-toast";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@components/ui/button";
import { ProductColumn } from "./columns";
import {
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProduct } from "@actions/product";
import DeleteAlert from "@components/global/DeleteAlert";

interface CellActionProps {
  data: ProductColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Product ID copied to clipboard.");
  };

  const onDelete = async (id: string) => {
    startTransition(async () => {
      try {
        if (!id) return;

        const result = await deleteProduct(id, params.storeId as string);

        if (!result.success) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success("Product deleted");
        router.push(`/${params.storeId}/products`);
        setShowDeleteAlert(false);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onCopy(data.id)}
        >
          <Copy className="size-4 mr-2" />
          Copy ID
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            router.push(`/${params.storeId}/products/${data.id}`)
          }
        >
          <Edit className="size-4 mr-2" />
          Update
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setShowDeleteAlert(true)}
          onSelect={(e) => e.preventDefault()}
        >
          <Trash className="size-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DeleteAlert
          isPending={isDeleting}
          onDelete={() => onDelete(data.id)}
          open={showDeleteAlert}
          onOpenChange={setShowDeleteAlert}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default CellAction;
