"use client";

import Card from "@/component/Card";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

const products = [
    {
        id: 1,
        title: "Wireless Headphones",
        description: "Premium sound with active noise cancellation.",
        image: "/products/headphones.jpg",
        price: "$199.00",
        originalPrice: "$299.00",
        badge: "20% OFF",
        rating: 4.8,
        reviews: 128,
    },
    {
        id: 2,
        title: "Running Sneakers",
        description: "Lightweight and breathable for everyday use.",
        image: "/products/sneakers.jpg",
        price: "$59.00",
        originalPrice: "$95.00",
        badge: "Sale",
        rating: 4.9,
        reviews: 64,
    },
    {
        id: 3,
        title: "Smart Watch Pro",
        description: "Track your health and stay connected.",
        image: "/products/smartwatch.jpg",
        price: "$199.00",
        badge: "New",
        rating: 4.7,
        reviews: 92,
    },
    {
        id: 4,
        title: "Gaming Controller",
        description: "Ergonomic wireless design for all platforms.",
        image: "/products/controller.jpg",
        price: "$45.00",
        originalPrice: "$69.00",
        badge: "Sale",
        rating: 4.6,
        reviews: 40,
    },
];

const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home",
    "Sports",
    "Beauty",
];

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero */}
            <section className="bg-card border-b border-border px-10 py-14 flex items-center justify-between gap-8">
                <div className="max-w-md">
                    <h1 className="text-4xl font-semibold text-foreground leading-tight">
                        Discover <span className="text-primary">Amazing</span>{" "}
                        Products at Great Prices
                    </h1>
                    <p className="mt-3 text-sm text-muted leading-relaxed">
                        Shop thousands of products from top brands. Fast
                        delivery, easy returns.
                    </p>
                    <div className="flex gap-3 my-6">
                        <button className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors">
                            Shop Now
                        </button>
                        <button className="px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-primary/10 hover:border-primary transition-colors">
                            View Deals
                        </button>
                    </div>
                </div>
                <div className="flex gap-10 shrink-0">
                    {[
                        ["10k+", "Products"],
                        ["5k+", "Customers"],
                        ["4.9", "Ratings"],
                    ].map(([num, label]) => (
                        <div key={label} className="text-center">
                            <p className="text-2xl font-semibold text-foreground">
                                {num}
                            </p>
                            <p className="text-xs text-muted mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <main>
                {/* Categories */}
                <section className="px-10 pt-8 pb-4">
                    <div className="flex gap-2">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                                    i === 0
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "border-border text-muted hover:bg-primary-10 hover:border-primary hover:text-primary"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Products */}
                <section className="px-10 py-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-foreground">
                            Featured Products
                        </h2>
                        <a
                            href="#"
                            className="text-sm text-primary font-medium hover:text-primary-hover transition-colors"
                        >
                            See All
                        </a>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <Card key={product.id} {...product} />
                        ))}
                    </div>
                </section>

                {/* Promo Banners */}
                <section className="px-10 pb-10">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-primary-active">
                                Special Offer - Up to 50% Off
                            </p>
                            <p className="text-xs text-muted mt-1">
                                Limited time deals on selected items. Don't miss
                                out!
                            </p>
                        </div>
                        <button className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors shrink-0">
                            Claim Deal
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
