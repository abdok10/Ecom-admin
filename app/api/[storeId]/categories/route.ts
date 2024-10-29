import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is Required", { status: 400 });
    }
    
    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  
} catch (error) {
    console.log('[CATEGORIES_POST]', error)
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (
    req: Request,
    { params }: { params: { storeId: string } }
) => {
  try {

    if (!params.storeId) {
        return new NextResponse("Store id is Required", { status: 400 });
    }

    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId,
        }
    });

    return NextResponse.json(categories, { status: 201 });
} catch (error) {
    console.log('[CATEGORIES_GET]', error)
    return new NextResponse("Internal Error", { status: 500 });
  }
};
