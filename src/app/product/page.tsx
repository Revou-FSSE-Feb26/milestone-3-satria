"use client";

import Card from "@/component/Card";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { useState, useEffect, useMemo } from "react";
import { getAllProducts, getCategories } from "@/lib/api";

type Product = {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    price: string;
    rating: number | null;
    reviews: number;
    badge: string | null;
};

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [productData, categoryData] = await Promise.all([
                    getAllProducts(),
                    getCategories(),
                ]);
                setProducts(productData);
                setCategories(["All", ...categoryData]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchesCategory =
                activeCategory === "All" || p.category === activeCategory;
            const matchesSearch = p.title
                .toLowerCase()
                .includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, activeCategory, search]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <div className="px-10 py-4 flex items-center gap-2 text-xs text-muted">
                <a href="/" className="hover:text-primary transition-colors">
                    Home
                </a>
                <span>/</span>
                <span className="text-foreground font-medium">Products</span>
            </div>

            <main>
                <section className="px-10 pb-6">
                    <h1 className="text-2xl font-semibold text-foreground">
                        All Products
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        {loading
                            ? "Loading..."
                            : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
                    </p>
                </section>

                <section className="px-10 pb-6 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                                    cat === activeCategory
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "border-border text-muted hover:bg-primary/10 hover:border-primary hover:text-primary"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="px-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors w-full sm:w-64"
                    />
                </section>

                <section className="px-10 pb-10">
                    {loading ? (
                        <p className="text-sm text-muted">
                            Loading products...
                        </p>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filtered.map((product) => (
                                <Card key={product.id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted text-sm">
                            No products match your search.
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
