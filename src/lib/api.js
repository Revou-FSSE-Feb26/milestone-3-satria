const BASE_URL = "https://fakestoreapi.com";
const PLATZI = "https://api.escuelajs.co/api/v1";

//Fake store API

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatProduct(product) {
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
    };
}

export async function getAllProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch product");
    const data = await res.json();
    return data.map(formatProduct);
}

export async function getProductById(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return formatProduct(data);
}

export async function getCategories() {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.map(capitalize);
}

//Platzi API

export async function createProduct({ title, price, description }) {
    const res = await fetch(`${PLATZI}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
            title,
            price: Number(price),
            description,
            categoryId: 1,
            images: ["https://placehold.co/600x400"],
        }),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
}

export async function updateProduct(id, fields) {
    const res = await fetch(`${PLATZI}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

export async function deleteProduct(id) {
    const res = await fetch(`${PLATZI}/products/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
}

export async function loginUser({ email, password }) {
    const res = await fetch(`${PLATZI}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid email or password");
    return res.json();
}

export async function getProfile(token) {
    const res = await fetch(`${PLATZI}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}
