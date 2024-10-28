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

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is Required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("image is Required", { status: 400 });
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

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard, { status: 201 });
  
} catch (error) {
    console.log('[BILLBOARDS_POST]', error)
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

    const billboards = await db.billboard.findMany({
        where: {
            storeId: params.storeId,
        }
    });

    return NextResponse.json(billboards, { status: 201 });
} catch (error) {
    console.log('[BILLBOARDS_GET]', error)
    return new NextResponse("Internal Error", { status: 500 });
  }
};
