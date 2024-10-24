import db from "@/lib/db";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export async function createUser(userData: UserData) {
  try {
    console.log({ userData });
    const existingUser = await db.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    console.log({ existingUser });

    if (existingUser) {
      console.log("User already exists");
      return existingUser;
    }

    const newUser = await db.user.create({
      data: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
    });

    console.log("User created:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user");
  }
}
