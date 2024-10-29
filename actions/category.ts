'use server';

import db from "@lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  billboardId: z.string().min(1, "Billboard ID is required"),
});

type CategoryFormData = z.infer<typeof CategorySchema>;

// Helper function to verify store ownership
async function verifyStoreAccess(storeId: string, userId: string): Promise<boolean> {
  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId },
  });
  return !!storeByUserId;
}

export async function createCategory(
  storeId: string,
  data: CategoryFormData
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
    const validationResult = CategorySchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const category = await db.category.create({
      data: {
        ...validationResult.data,
        storeId,
      },
    });

    revalidatePath(`/dashboard/${storeId}/categories`);
    return { success: true, data: category };

  } catch (error) {
    console.error('[CREATE_CATEGORY_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function updateCategory(
  categoryId: string,
  storeId: string,
  data: CategoryFormData
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!categoryId) {
      return { error: "Category ID is required" };
    }

    // Validate input data
    const validationResult = CategorySchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    const category = await db.category.update({
      where: { id: categoryId },
      data: validationResult.data,
    });

    revalidatePath(`/dashboard/${storeId}/categories`);
    return { success: true, data: category };

  } catch (error) {
    console.error('[UPDATE_CATEGORY_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function deleteCategory(
  categoryId: string,
  storeId: string,
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthenticated" };
    }

    if (!categoryId) {
      return { error: "Category ID is required" };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) {
      return { error: "Unauthorized" };
    }

    await db.category.delete({
      where: { id: categoryId },
    });

    revalidatePath(`/dashboard/${storeId}/categories`);
    return { success: true };

  } catch (error) {
    console.error('[DELETE_CATEGORY_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getCategory(categoryId: string) {
  try {
    if (!categoryId) {
      return { error: "Category ID is required" };
    }

    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        billboard: true,
      },
    });

    if (!category) {
      return { error: "Category not found" };
    }

    return { success: true, data: category };

  } catch (error) {
    console.error('[GET_CATEGORY_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function getCategories(storeId: string) {
  try {
    if (!storeId) {
      return { error: "Store ID is required" };
    }

    const categories = await db.category.findMany({
      where: { storeId },
      include: {
        billboard: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: categories };

  } catch (error) {
    console.error('[GET_CATEGORIES_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}