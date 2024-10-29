'use server';

import db from "@lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
});

type SizeFormData = z.infer<typeof SizeSchema>;

// Helper function to verify store ownership
async function verifyStoreAccess(storeId: string, userId: string): Promise<boolean> {
  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId },
  });
  return !!storeByUserId;
}

export async function createSize(
  storeId: string,
  data: SizeFormData
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
    const validationResult = SizeSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const size = await db.size.create({
      data: {
        ...validationResult.data,
        storeId,
      },
    });

    revalidatePath(`/${storeId}/sizes`);
    return { success: true, data: size };

  } catch (error) {
    console.error('[CREATE_SIZE_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function updateSize(
  sizeId: string,
  storeId: string,
  data: SizeFormData
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!sizeId) {
      return { error: "Size ID is required" };
    }

    // Validate input data
    const validationResult = SizeSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const size = await db.size.update({
      where: { id: sizeId },
      data: validationResult.data,
    });

    revalidatePath(`/${storeId}/sizes`);
    return { success: true, data: size };

  } catch (error) {
    console.error('[UPDATE_SIZE_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function deleteSize(
  sizeId: string,
  storeId: string,
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!sizeId) {
      return { error: "Size ID is required" };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    await db.size.delete({
      where: { id: sizeId },
    });

    revalidatePath(`/${storeId}/sizes`);
    return { success: true };

  } catch (error) {
    console.error('[DELETE_SIZE_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getSize(sizeId: string) {
  try {
    if (!sizeId) {
      return { error: "Size ID is required" };
    }

    const size = await db.size.findUnique({
      where: { id: sizeId },
    });

    if (!size) {
      return { error: "Size not found" };
    }

    return { success: true, data: size };

  } catch (error) {
    console.error('[GET_SIZE_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getSizes(storeId: string) {
  try {
    if (!storeId) {
      return { error: "Store ID is required" };
    }

    const sizes = await db.size.findMany({
      where: { storeId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: sizes };

  } catch (error) {
    console.error('[GET_SIZES_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}