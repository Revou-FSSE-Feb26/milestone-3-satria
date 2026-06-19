import { NextRequest, NextResponse } from "next/server";

const PLATZI = "https://api.escuelajs.co/api/v1";
const FAKESTORE = "https://fakestoreapi.com";

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFakeProduct(product: any) {
    if (!product) return null;
    return {
        id: product.id,
        title: product.title,
        category: capitalize(product.category),
        description: product.description,
        image: product.image,
        price: `$${product.price.toFixed(2)}`,
        rating: product.rating?.rate ?? null,
        reviews: product.rating?.count ?? 0,
        badge: null,
        inStock: true,
    };
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    try {
        const res = await fetch(`${FAKESTORE}/products/${id}`, {
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 },
            );
        }
        const data = await res.json();
        return NextResponse.json(formatFakeProduct(data));
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    try {
        const body = await request.json();

        if (!body.title || !body.price) {
            return NextResponse.json(
                { error: "Title and price are required" },
                { status: 400 },
            );
        }

        const priceNum = parseFloat(String(body.price).replace("$", ""));
        if (isNaN(priceNum) || priceNum <= 0) {
            return NextResponse.json(
                { error: "Price must be a positive number" },
                { status: 400 },
            );
        }

        const optimisticResponse = {
            id: Number(id),
            title: body.title,
            category: body.category || "Electronics",
            description: body.description || "",
            image: body.image || "https://placehold.co/600x400?text=Product",
            price: `$${priceNum.toFixed(2)}`,
            originalPrice: body.originalPrice || null,
            badge: body.badge || null,
            inStock: body.inStock ?? true,
        };

        try {
            const res = await fetch(`${PLATZI}/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                signal: AbortSignal.timeout(8000), // ← key fix
                body: JSON.stringify({
                    title: body.title,
                    price: priceNum,
                    description: body.description || "",
                    images: [
                        body.image ||
                            "https://placehold.co/600x400?text=Product",
                    ],
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                return NextResponse.json({
                    ...optimisticResponse,
                    ...updated,
                    id: Number(id),
                });
            }
        } catch {

        }

        return NextResponse.json(optimisticResponse);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    try {
        try {
            const res = await fetch(`${PLATZI}/products/${id}`, {
                method: "DELETE",
                signal: AbortSignal.timeout(8000),
            });
            if (!res.ok && res.status !== 200) {
                const text = await res.text();
                if (text !== "true") {
                    throw new Error("Failed to delete product");
                }
            }
        } catch {
        }

        return NextResponse.json({ success: true, id: Number(id) });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
