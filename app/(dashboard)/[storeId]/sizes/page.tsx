import { format } from "date-fns";

import { getSizes } from "@actions/size";
import SizeClient from "./_components/SizeClient";
import { SizeColumn } from "./_components/columns";

interface SizePageProps {
  params: { storeId: string };
}

const BillboardsPage = async ({ params }: SizePageProps) => {
  const sizes = await getSizes(params.storeId);

  const formattedSizes: SizeColumn[] = sizes?.data?.map(
    (item) => ({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  ) ?? [];

  return (
    <div className="flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <SizeClient sizes={formattedSizes} />
      </div>
    </div>
  );
};
export default BillboardsPage;
