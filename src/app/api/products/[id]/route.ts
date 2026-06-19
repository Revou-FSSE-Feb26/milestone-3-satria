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

        const priceNum = parseFloat(String(body.price).replace("$", ""));
        if (isNaN(priceNum) || priceNum <= 0) {
            return NextResponse.json(
                { error: "Price must be a positive number" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            id: Number(id),
            title: body.title,
            category: body.category || "Electronics",
            description: body.description || "",
            image: body.image || "https://placehold.co/600x400?text=Product",
            price: `$${priceNum.toFixed(2)}`,
            originalPrice: body.originalPrice || null,
            badge: body.badge || null,
            inStock: body.inStock ?? true,
            rating: 0,
            reviews: 0,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return NextResponse.json({ success: true, id: Number(id) });
}