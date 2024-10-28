"use server";

import db from "@lib/db";

export const getBillboards = async (storeId: string) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
  });

  return { success: "Billboard created" };
};

export const createBillboard = async (storeId: string, formData: FormData) => {
  const { label, imageUrl } = Object.fromEntries(formData.entries());

  if (!label || !imageUrl) {
    return { error: "Missing label or imageUrl" };
  }

  return { success: "Billboard created" };
};

export const updateBillboard = async (storeId: string, formData: FormData) => {
  const { label, imageUrl } = Object.fromEntries(formData.entries());

  if (!label || !imageUrl) {
    return { error: "Missing label or imageUrl" };
  }

  return { success: "Billboard updated" };
};

export const deleteBillboard = async (billboardId: string) => {
  if (!billboardId) {
    return { error: "Missing billboardId" };
  }

  return { success: "Billboard deleted" };
};
