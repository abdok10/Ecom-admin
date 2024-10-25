"use client";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubmitBtnProps {
  children: React.ReactNode;
  pendingLabel?: string;
  loading?: boolean;
}

const SubmitBtn = ({ children, pendingLabel, loading }: SubmitBtnProps) => {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="disabled:cursor-not-allowed"
    >
      {loading ? (
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
