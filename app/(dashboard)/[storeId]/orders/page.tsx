import { format } from "date-fns";

// import { getOrders } from "@actions/order";
import db from "@lib/db";
import OrderClient from "./_components/OrderClient";
import { OrderColumn } from "./_components/columns";
import { formatPrice } from "@lib/utils";

interface OrdersPageProps {
  params: { storeId: string };
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
  // const orders = await getOrders(params.storeId);
  const orders = await db.order.findMany({
    where: { storeId: params.storeId },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log({ orders });

  const formattedOrders: OrderColumn[] =
    orders?.map((item: any) => ({
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.orderItems
        .map((orderItem: { product: { name: string } }) => orderItem.product.name)
        .join(", "),
      totalPrice: formatPrice(
        item.orderItems.reduce((total: number, item: { product: { price: number } }) => {
          return total + Number(item.product.price);
        }, 0)
      ),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) ?? [];

  return (
    <div className="flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <OrderClient orders={formattedOrders} />
      </div>
    </div>
  );
};
export default OrdersPage;
