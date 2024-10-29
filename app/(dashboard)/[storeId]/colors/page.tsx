import { format } from "date-fns";

import { getColors } from "@actions/color";
import ColorClient from "./_components/ColorClient";
import { ColorColumn } from "./_components/columns";

interface ColorsPageProps {
  params: { storeId: string };
}

const ColorsPage = async ({ params }: ColorsPageProps) => {
  const colors = await getColors(params.storeId);

  const formattedColors: ColorColumn[] = colors?.data?.map(
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
        <ColorClient colors={formattedColors} />
      </div>
    </div>
  );
};
export default ColorsPage;
