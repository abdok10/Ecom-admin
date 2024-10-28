"use server"

export const createBillboard = async (storeId: string, formData: FormData) => {
    const { label, imageUrl } = Object.fromEntries(formData.entries());

    if (!label || !imageUrl) {
        return { error: "Missing label or imageUrl" };
    }


    return { success: "Billboard created" };
}

export const updateBillboard = async (storeId: string, formData: FormData) => {
    const { label, imageUrl } = Object.fromEntries(formData.entries());

    if (!label || !imageUrl) {
        return { error: "Missing label or imageUrl" };
    }

    return { success: "Billboard updated" };
}

export const deleteBillboard = async (billboardId: string) => {
    if (!billboardId) {
        return { error: "Missing billboardId" };
    }

    return { success: "Billboard deleted" };
}
