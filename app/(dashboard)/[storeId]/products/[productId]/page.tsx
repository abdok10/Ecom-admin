import db from "@lib/db";

import ProductForm from "./_components/ProductForm";

const ProductPage = async ({
  params,
}: {
  params: {
    productId: string;
  };
}) => {
  
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    }
  });
  return (
    <div className="flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};
export default ProductPage;
