"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@components/global/Heading";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@components/global/DataTable";
import ApiList from "@components/global/ApiList";

interface ProductClientProps {
  products: ProductColumn[];
}

  const ProductClient = ({ products }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage products for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />

      <DataTable searchKey="name" columns={columns} data={products} />

      <Heading title="API" description="API calls for Products" />
      <Separator className="my-4" />
      
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
