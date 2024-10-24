"use server";

import { auth } from "@clerk/nextjs/server";

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
