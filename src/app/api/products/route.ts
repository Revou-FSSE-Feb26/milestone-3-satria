import { NextRequest, NextResponse } from "next/server";

const PLATZI = "https://api.escuelajs.co/api/v1";
const FAKESTORE = "https://fakestoreapi.com";

const FALLBACK_PRODUCTS = [
    {
        id: 1,
        title: "Sample Product",
        category: "Electronics",
        description: "FakeStore API is temporarily unavailable.",
        image: "https://placehold.co/400x400?text=Product",
        price: "$9.99",
        rating: null,
        reviews: 0,
        badge: null,
        inStock: true,
    },
];

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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(`${FAKESTORE}/products`, {
            cache: "no-store",
            signal: controller.signal,
            headers: {
                Accept: "application/json",
                "User-Agent": "Mozilla/5.0",
            },
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`FakeStore responded with ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Unexpected response shape");

        return NextResponse.json(data.map(formatFakeProduct));
    } catch (err: any) {
        console.error("FakeStore GET failed:", err.message);
        return NextResponse.json(FALLBACK_PRODUCTS, { status: 200 });
    }
}

export async function POST(request: NextRequest) {
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
            id: Date.now(),
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
        };

        try {
            const res = await fetch(`${PLATZI}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: AbortSignal.timeout(8000),
                body: JSON.stringify({
                    title: body.title,
                    price: priceNum,
                    description: body.description || "",
                    categoryId: 1,
                    images: [
                        body.image ||
                            "https://placehold.co/600x400?text=Product",
                    ],
                }),
            });

            if (res.ok) {
                const created = await res.json();
                return NextResponse.json(
                    { ...optimisticResponse, ...created },
                    { status: 201 },
                );
            }
        } catch {}

        return NextResponse.json(optimisticResponse, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
