'use server';

import db from "@lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BillboardSchema = z.object({
  label: z.string().min(1, "Label is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
});

type BillboardFormData = z.infer<typeof BillboardSchema>;

// Helper function to verify store ownership
async function verifyStoreAccess(storeId: string, userId: string): Promise<boolean> {
  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId },
  });
  return !!storeByUserId;
}

export async function createBillboard(
  storeId: string,
  data: BillboardFormData
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!storeId) {
      return { error: "Store ID is required" };
    }

    // Validate input data
    const validationResult = BillboardSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const billboard = await db.billboard.create({
      data: {
        ...validationResult.data,
        storeId,
      },
    });

    revalidatePath(`/dashboard/${storeId}/billboards`);
    return { success: true, data: billboard };

  } catch (error) {
    console.error('[CREATE_BILLBOARD_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function updateBillboard(
  billboardId: string,
  storeId: string,
  data: BillboardFormData
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!billboardId) {
      return { error: "Billboard ID is required" };
    }

    // Validate input data
    const validationResult = BillboardSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const billboard = await db.billboard.update({
      where: { id: billboardId },
      data: validationResult.data,
    });

    revalidatePath(`/dashboard/${storeId}/billboards`);
    return { success: true, data: billboard };

  } catch (error) {
    console.error('[UPDATE_BILLBOARD_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function deleteBillboard(
  billboardId: string,
  storeId: string,
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!billboardId) {
      return { error: "Billboard ID is required" };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    await db.billboard.delete({
      where: { id: billboardId },
    });

    revalidatePath(`/dashboard/${storeId}/billboards`);
    return { success: true };

  } catch (error) {
    console.error('[DELETE_BILLBOARD_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getBillboard(billboardId: string) {
  try {
    if (!billboardId) {
      return { error: "Billboard ID is required" };
    }

    const billboard = await db.billboard.findUnique({
      where: { id: billboardId },
    });

    if (!billboard) {
      return { error: "Billboard not found" };
    }

    return { success: true, data: billboard };

  } catch (error) {
    console.error('[GET_BILLBOARD_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getProducts(storeId: string) {
  try {
    // if (!storeId) {
    //   return { error: "Store ID is required" };
    // }

    const products = await db.product.findMany({
      where: { storeId },
      include: {
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: products };

  } catch (error) {
    console.error('[GET_PRODUCTS_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}