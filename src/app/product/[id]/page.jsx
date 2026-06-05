import ProductDetail from "../../ProductDetail/ProductDetail";

const products = [
    {
        id: 1,
        title: "Wireless Headphone",
        category: "Electronics",
        description: "Premium sound with active noise cancellation.",
        image: "/product/headphone-5.jpg",
        price: "$199.00",
        originalPrice: "$299.00",
        badge: "20% OFF",
        rating: 4.8,
        reviews: 128,
    },
    {
        id: 2,
        title: "Running Sneakers",
        category: "Fashion",
        description: "Lightweight and breathable.",
        image: "/product/running-sneakers.jpg",
        price: "$59.00",
        originalPrice: "$95.00",
        badge: "Sale",
        rating: 4.9,
        reviews: 64,
    },
    {
        id: 3,
        title: "Smart Watch Pro",
        category: "Electronics",
        description: "Track your health.",
        image: "/product/smartwatch.jpg",
        price: "$199.00",
        badge: "New",
        rating: 4.7,
        reviews: 92,
    },
    {
        id: 4,
        title: "Gaming Controller",
        category: "Electronics",
        description: "Ergonomic wireless design.",
        image: "/product/gaming-controller.jpg",
        price: "$45.00",
        originalPrice: "$69.00",
        badge: "Sale",
        rating: 4.6,
        reviews: 40,
    },
    {
        id: 5,
        title: "Phone Stand Pro",
        category: "Electronics",
        description: "Adjustable for any device.",
        image: "/product/phone-stand.jpg",
        price: "$29.00",
        badge: "New",
        rating: 4.5,
        reviews: 31,
    },
];

export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = products.find((p) => p.id === Number(id));

    if (!product) return <p>Product Not Found.</p>;

    return <ProductDetail {...product} />;
}
