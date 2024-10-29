import { format } from "date-fns";
import db from "@/lib/db";
import { CategoryColumn } from "./_components/columns";
import CategoryClient from "./_components/CategoryClient";

interface CategoriesPageProps {
  params: { storeId: string };
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <CategoryClient categories={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
