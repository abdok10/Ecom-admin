"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/global/DataTable";
import Heading from "@/components/global/Heading";
import ApiList from "@/components/global/ApiList";
import { Separator } from "@components/ui/separator";
import { CategoryColumn, columns } from "./columns";

interface CategoryClientProps {
  categories: CategoryColumn[];
}

const CategoryClient = ({ categories }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />

      <DataTable searchKey="name" columns={columns} data={categories} />

      <Heading title="API" description="API calls for Categories" />
      <Separator className="my-4" />
      
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoryClient; 