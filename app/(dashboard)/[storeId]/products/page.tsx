import { format } from "date-fns";

import { formatPrice } from "@/lib/utils";
import { getProducts } from "@actions/product";
import ProductClient from "./_components/ProductClient";
import { ProductColumn } from "./_components/columns";

interface ProductsPageProps {
  params: { storeId: string };
}

const ProductsPage = async ({ params }: ProductsPageProps) => {
  const products = await getProducts(params.storeId);

  const formattedProducts: ProductColumn[] =
    products?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatPrice(item.price.toNumber()),
      category: item.category.name,
      size: item.size.name,
      color: item.color.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) ?? [];

  return (
    <div className="flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  );
};
export default ProductsPage;
