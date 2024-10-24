"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { createUser } from "@actions/user";

export default function SetupPage() {
  const { isOpen, onOpen } = useStoreModal();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  // useEffect(() => {
  //   if (isLoaded && isSignedIn && user) {
  //     const { id, fullName, firstName, emailAddresses } = user;

  //     const newUser = {
  //       id,
  //       name: fullName || firstName || "",
  //       email: emailAddresses[0]?.emailAddress || "",
  //     };

  //     if (newUser.email) {
  //       createUser(newUser)
  //         .then(() => {
  //           console.log("User created/verified successfully");
  //         })
  //         .catch((error) => {
  //           console.error("Error creating user:", error);
  //         });
  //     }
  //   }
  // }, [isLoaded, isSignedIn, user]);

  return (
    <div className="p-4">
      <p>Root Page</p>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Button onClick={() => {}}>Open Modal</Button>
    </div>
  );
}
