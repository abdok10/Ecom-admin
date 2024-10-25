import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import MainNav from "@components/MainNav";
import StoreSwitcher from "@components/StoreSwitcher";
import db from "@lib/db";
import { redirect } from "next/navigation";

const Navbar = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const stores = await db.store.findMany({
    where: { userId },
  });

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher stores={stores} />
        <MainNav className="px-6" />
        <div className="ml-auto flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
