"use client";

import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import Heading from "@components/global/Heading";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

const BillboardClient = () => {
  const router = useRouter();
  const params = useParams();
  
  return (
    <>
      <div className="flex items-ceter justifu-between">
        <Heading
          title="Billboards (0)"
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 size-4" />
          Add Billboards
        </Button>
      </div>
      <Separator />
    </>
  );
};

export default BillboardClient;
