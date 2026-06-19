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
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const res = await fetch(`${FAKESTORE}/products/${id}`);
        if (!res.ok) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }
        const data = await res.json();
        return NextResponse.json(formatFakeProduct(data));
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();

        if (!body.title || !body.price) {
            return NextResponse.json(
                { error: "Title and price are required" },
                { status: 400 }
            );
        }

        const priceNum = parseFloat(
            String(body.price).replace("$", "")
        );
        if (isNaN(priceNum) || priceNum <= 0) {
            return NextResponse.json(
                { error: "Price must be a positive number" },
                { status: 400 }
            );
        }

        const res = await fetch(`${PLATZI}/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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

        if (!res.ok) throw new Error("Failed to update product");
        const updated = await res.json();

        return NextResponse.json({
            ...updated,
            id: Number(id),
            category: body.category || "Electronics",
            badge: body.badge || null,
            inStock: body.inStock ?? true,
            price: `$${priceNum.toFixed(2)}`,
            originalPrice: body.originalPrice || null,
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const res = await fetch(`${PLATZI}/products/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete product");

        return NextResponse.json({ success: true, id: Number(id) });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}