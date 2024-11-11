"use client";

import Heading from "@components/global/Heading";
import { Separator } from "@components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@components/global/DataTable";

interface OrderClientProps {
  orders: OrderColumn[];
}

const OrderClient = ({ orders }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage orders for your store"
      />
      <Separator className="my-4" />

      <DataTable searchKey="products" columns={columns} data={orders} />
    </>
  );
};

export default OrderClient;
