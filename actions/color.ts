'use server';

import db from "@lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ColorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
});

type ColorFormData = z.infer<typeof ColorSchema>;

// Helper function to verify store ownership
async function verifyStoreAccess(storeId: string, userId: string): Promise<boolean> {
  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId },
  });
  return !!storeByUserId;
}

export async function createColor(
  storeId: string,
  data: ColorFormData
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
    const validationResult = ColorSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const color = await db.color.create({
      data: {
        ...validationResult.data,
        storeId,
      },
    });

    revalidatePath(`/${storeId}/colors`);
    return { success: true, data: color };

  } catch (error) {
    console.error('[CREATE_COLOR_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function updateColor(
  colorId: string,
  storeId: string,
  data: ColorFormData
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!colorId) {
      return { error: "Color ID is required" };
    }

    // Validate input data
    const validationResult = ColorSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const color = await db.color.update({
      where: { id: colorId },
      data: validationResult.data,
    });

    revalidatePath(`/${storeId}/colors`);
    return { success: true, data: color };

  } catch (error) {
    console.error('[UPDATE_COLOR_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function deleteColor(
  colorId: string,
  storeId: string,
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!colorId) {
      return { error: "Color ID is required" };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    await db.color.delete({
      where: { id: colorId },
    });

    revalidatePath(`/${storeId}/colors`);
    return { success: true };

  } catch (error) {
    console.error('[DELETE_COLOR_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getColor(colorId: string) {
  try {
    if (!colorId) {
      return { error: "Color ID is required" };
    }

    const color = await db.color.findUnique({
      where: { id: colorId },
    });

    if (!color) {
      return { error: "Color not found" };
    }

    return { success: true, data: color };

  } catch (error) {
    console.error('[GET_COLOR_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getColors(storeId: string) {
  try {
    if (!storeId) {
      return { error: "Store ID is required" };
    }

    const colors = await db.color.findMany({
      where: { storeId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: colors };

  } catch (error) {
    console.error('[GET_COLORS_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}