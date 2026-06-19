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

export async function GET() {
    try {
        const res = await fetch(`${FAKESTORE}/products`, {
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        return NextResponse.json(data.map(formatFakeProduct));
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
