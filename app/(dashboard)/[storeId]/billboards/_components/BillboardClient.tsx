"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@components/global/Heading";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@components/global/DataTable";
import ApiList from "@components/global/ApiList";

interface BillbordClientProps {
  billboards: BillboardColumn[];
}

const BillboardClient = ({ billboards }: BillbordClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />

      <DataTable searchKey="label" columns={columns} data={billboards} />

      <Heading title="API" description="API calls for Billboards" />
      <Separator className="my-4" />
      
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};

export default BillboardClient;
