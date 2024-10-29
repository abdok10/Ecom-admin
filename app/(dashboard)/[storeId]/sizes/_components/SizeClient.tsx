"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@components/global/Heading";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@components/global/DataTable";
import ApiList from "@components/global/ApiList";

interface SizeClientProps {
  sizes: SizeColumn[];
}

const BillboardClient = ({ sizes }: SizeClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Manage sizes for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />

      <DataTable searchKey="name" columns={columns} data={sizes} />

      <Heading title="API" description="API calls for Sizes" />
      <Separator className="my-4" />
      
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default BillboardClient;
