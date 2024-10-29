import { format } from "date-fns";

import { getBillboards } from "@actions/billboard";
import BillboardClient from "./_components/BillboardClient";
import { BillboardColumn } from "./_components/columns";

interface BillboardsPageProps {
  params: { storeId: string };
}

const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  const billboards = await getBillboards(params.storeId);

  const formattedBillboards: BillboardColumn[] = billboards?.data?.map(
    (item) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  ) ?? [];

  return (
    <div className="flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};
export default BillboardsPage;
