"use server";

import db from "@lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1),
  images: z
    .object({
      url: z.string().url("Invalid image URL"),
    })
    .array()
    .min(1, "At least one product image is required"),
  categoryId: z.string().min(1, "Category is required"),
  sizeId: z.string().min(1, "Size is required"),
  colorId: z.string().min(1, "Color is required"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormData = z.infer<typeof ProductSchema>;

// Helper function to verify store ownership
async function verifyStoreAccess(
  storeId: string,
  userId: string
): Promise<boolean> {
  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId },
  });
  return !!storeByUserId;
}

export async function createProduct(storeId: string, data: ProductFormData) {
  const {
    name,
    price,
    images,
    categoryId,
    sizeId,
    colorId,
    isFeatured,
    isArchived,
  } = data;
  try {
    const { userId } = auth();
    if (!userId) return { error: "Unauthenticated" };
    if (!storeId) return { error: "Store ID is required" };

    // Validate input data
    const validationResult = ProductSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) return { error: "Unauthorized" };

    const product = await db.product.create({
      data: {
        name,
        price: Number(price),
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    revalidatePath(`/dashboard/${storeId}/products`);
    return { success: true, data: product };
  } catch (error) {
    console.error("[CREATE_PRODUCT_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function updateProduct(
  productId: string,
  storeId: string,
  data: ProductFormData
) {
  try {
    const { userId } = auth();
    if (!userId) return { error: "Unauthenticated" };
    if (!productId) return { error: "Product ID is required" };

    // Validate input data
    const validationResult = ProductSchema.safeParse(data);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }
    const {
      name,
      price,
      images,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = validationResult.data;

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) return { error: "Unauthorized" };

    await db.product.update({
      where: { id: productId },
      data: {
        name,
        price: Number(price),
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        storeId,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await db.product.update({
      where: { id: productId },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    revalidatePath(`/dashboard/${storeId}/products`);
    return { success: true, data: product };
  } catch (error) {
    console.error("[UPDATE_PRODUCT_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function deleteProduct(productId: string, storeId: string) {
  try {
    const { userId } = auth();
    if (!userId) return { error: "Unauthenticated" };
    if (!productId) return { error: "Product ID is required" };

    // Verify store ownership
    const hasAccess = await verifyStoreAccess(storeId, userId);
    if (!hasAccess) return { error: "Unauthorized" };

    await db.product.delete({
      where: { id: productId },
    });

    revalidatePath(`/dashboard/${storeId}/products`);
    return { success: true };
  } catch (error) {
    console.error("[DELETE_PRODUCT_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getProduct(productId: string) {
  try {
    if (!productId) return { error: "Product ID is required" };

    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
      },
    });

    if (!product) return { error: "Product not found" };

    return { success: true, data: product };
  } catch (error) {
    console.error("[GET_PRODUCT_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
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
    console.error("[GET_PRODUCTS_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
