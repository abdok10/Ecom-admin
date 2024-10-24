"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubmitBtnProps {
  children: React.ReactNode;
  pendingLabel?: string;
}

const SubmitBtn = ({ children, pendingLabel }: SubmitBtnProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="disabled:cursor-not-allowed"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2 capitalize">
          <LoaderCircle className="animate-spin" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </Button>
  );
};
export default SubmitBtn;
