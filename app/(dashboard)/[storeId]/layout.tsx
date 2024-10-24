import { auth } from "@clerk/nextjs/server";
import db from "@lib/db";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}

const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
  const { userId } = auth();
  const { storeId } = params;

  if (!userId) redirect("/sign-in");

  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) redirect("/");

  return (
    <>
      <nav>This is Navbar</nav>
      {children}
    </>
  );
};
export default DashboardLayout;
