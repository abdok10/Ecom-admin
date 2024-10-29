"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@components/global/Heading";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@components/global/DataTable";
import ApiList from "@components/global/ApiList";

interface ColorClientProps {
  colors: ColorColumn[];
}

const ColorClient = ({ colors }: ColorClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage colors for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />

      <DataTable searchKey="name" columns={columns} data={colors} />

      <Heading title="API" description="API calls for Colors" />
      <Separator className="my-4" />
      
      <ApiList entityName="colors" entityIdName="ColorId" />
    </>
  );
};

export default ColorClient;
