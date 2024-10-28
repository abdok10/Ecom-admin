"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { getBillboardsCount } from "@actions/billboard";
import Heading from "@components/global/Heading";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import toast from "react-hot-toast";

const BillboardClient = () => {
  const [billboardsCount, setBillboardsCount] = useState(0);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchBillboardsCount = async () => {
      const count = await getBillboardsCount(params.storeId as string);
      if (count.error) {
        toast.error(count.error);
        return;
      } 
      setBillboardsCount(count?.data || 0);
    };
    fetchBillboardsCount();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboardsCount})`}
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
    </>
  );
};

export default BillboardClient;
