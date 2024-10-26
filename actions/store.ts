"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import db from "@lib/db";

export const createStore = async (values: { name: string }) => {
  try {
    const { userId } = await auth();
    const { name } = values;

    if (!userId) return { error: "Unauthorized" };
    if (!name) return { error: "Name is required" };

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });
    return store;
  } catch (err) {
    console.log({ err });
    return { error: "Internal Error" };
  }
};


// lib/exceptions.ts
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const UpdateStoreSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .max(50, "Store name cannot exceed 50 characters"),
});

export async function updateStore(
  storeId: string,
  formData: FormData
) {
  try {
    const rawName = formData.get("name");

    // Validate input
    const validatedFields = UpdateStoreSchema.safeParse({
      name: rawName,
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0].message,
      };
    }

    const { name } = validatedFields.data;

    // Simulate DB check for duplicate name
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    const existingStore = await db.store.findFirst({
      where: {
        name,
      },
    });
    if (existingStore) {
      throw new ApiError(
        "A store with this name already exists",
        400,
        "DUPLICATE_NAME"
      );
    }

    await db.store.update({
      where: { id: storeId },
      data: { name },
    });

    revalidatePath(`/settings`);

    return {
      message: "Store name updated successfully",
    };
  } catch (error) {
    console.error("[STORE_UPDATE_ERROR]", error);

    if (error instanceof ApiError) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Something went wrong while updating the store.",
    };
  }
}
