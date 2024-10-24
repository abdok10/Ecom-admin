import { currentUser } from "@clerk/nextjs/server";
import db from "@lib/db";
import { redirect } from "next/navigation";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user || !user.id) redirect("/sign-in");

  const {
    id,
    firstName,
    lastName,
    emailAddresses,
    fullName,
    imageUrl,
    createdAt,
    updatedAt,
  } = user;

  const existingUser = await db.user.findFirst({
    where: { id },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        id,
        name: fullName || `${firstName} ${lastName}`,
        email: emailAddresses[0].emailAddress,
        imageUrl,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });
  }

  const store = await db.store.findFirst({
    where: { userId: id },
  });


  if (store) {
    redirect(`/${store.id}`);
  }
  return <>{children}</>;
};
export default SetupLayout;
