// "use client";

// import { Button } from "@/components/ui/button";
// import { useStoreModal } from "@/hooks/use-store-modal";
import { StoreModal } from "@components/modals/store-modal";
import db from "@lib/db";
// import { useEffect } from "react";

export default async function SetupPage() {
  const users = await db.user.findMany();
  console.log({ users });
  // const { isOpen, onOpen } = useStoreModal();
  // console.log(isOpen);

  // useEffect(() => {
  //   if (!isOpen) {
  //     onOpen();
  //   }
  // }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      <p>Root Page</p>
      {JSON.stringify(users)}
      {/* <Button onClick={() => {}}>Open Modal</Button> */}
      <StoreModal />
    </div>
  );
}
