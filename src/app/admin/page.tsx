"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Authcontext";

const EMPTY_FORM = {
    title: "",
    category: "Electronics",
    description: "",
    image: "",
    price: "",
    originalPrice: "",
    badge: "",
    inStock: true,
};

const categories = ["Electronics", "Fashion", "Home", "Sports", "Beauty"];
const badges = ["", "New", "Sale", "20% OFF"];

interface Product {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    price: string;
    originalPrice?: string;
    badge?: string;
    inStock: boolean;
    rating?: number;
    reviews?: number;
}

export default function AdminPage() {
    const router = useRouter();
    const { user, logout, isAuthenticated, loading: authLoading } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: string;
    } | null>(null);

    const showToast = (message: string, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchProducts = useCallback(async () => {
        setLoadingProducts(true);
        setApiError(null);
        try {
            const res = await fetch("https://fakestoreapi.com/products", {
                cache: "no-store",
            });
            if (!res.ok) throw new Error("Failed to load products");
            const data = await res.json();
            const formatted = data.map((p: any) => ({
                id: p.id,
                title: p.title,
                category:
                    p.category.charAt(0).toUpperCase() + p.category.slice(1),
                description: p.description,
                image: p.image,
                price: `$${p.price.toFixed(2)}`,
                rating: p.rating?.rate ?? null,
                reviews: p.rating?.count ?? 0,
                badge: null,
                inStock: true,
            }));
            setProducts(formatted);
        } catch (err: any) {
            setApiError(err.message);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) fetchProducts();
    }, [isAuthenticated, fetchProducts]);

    const filtered = products.filter((p) => {
        const matchSearch = p.title
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchCat =
            filterCategory === "All" || p.category === filterCategory;
        return matchSearch && matchCat;
    });

    const stats = [
        {
            label: "Total Products",
            value: String(products.length),
            sub: "From FakeStore API",
            color: "text-primary",
        },
        {
            label: "In Stock",
            value: String(products.filter((p) => p.inStock).length),
            sub: `${products.length ? Math.round((products.filter((p) => p.inStock).length / products.length) * 100) : 0}% available`,
            color: "text-green-600",
        },
        {
            label: "Out of Stock",
            value: String(products.filter((p) => !p.inStock).length),
            sub: "Need Restocking",
            color: "text-danger",
        },
        {
            label: "Categories",
            value: String(new Set(products.map((p) => p.category)).size),
            sub: "Active Categories",
            color: "text-amber-500",
        },
    ];

    const openAdd = () => {
        setEditingProduct(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setForm({
            title: product.title,
            category: product.category,
            description: product.description,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice || "",
            badge: product.badge || "",
            inStock: product.inStock,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setForm(EMPTY_FORM);
    };

    const validateForm = () => {
        if (!form.title.trim()) return "Title is required";
        if (!form.price.trim()) return "Price is required";
        const priceNum = parseFloat(form.price.replace("$", ""));
        if (isNaN(priceNum) || priceNum <= 0)
            return "Price must be a positive number";
        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            showToast(validationError, "danger");
            return;
        }

        setSaving(true);
        try {
            if (editingProduct) {
                const res = await fetch(`/api/products/${editingProduct.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to update");
                }
                const updated = await res.json();
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === editingProduct.id
                            ? { ...p, ...form, id: editingProduct.id }
                            : p,
                    ),
                );
                showToast("Product updated successfully");
            } else {
                const res = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to create");
                }
                const created = await res.json();
                setProducts((prev) => [
                    ...prev,
                    {
                        ...created,
                        title: form.title,
                        category: form.category,
                        badge: form.badge || undefined,
                        inStock: form.inStock,
                        price: form.price,
                        originalPrice: form.originalPrice || undefined,
                        rating: 0,
                        reviews: 0,
                    },
                ]);
                showToast("Product added successfully");
            }
            closeModal();
        } catch (err: any) {
            showToast(err.message, "danger");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to delete");
            }
            setProducts((prev) => prev.filter((p) => p.id !== id));
            setDeleteConfirmId(null);
            showToast("Product deleted", "danger");
        } catch (err: any) {
            showToast(err.message, "danger");
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        router.refresh();
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-sm text-muted">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Navbar */}
            <nav className="h-16 bg-card border-b border-border px-8 flex items-center justify-between shrink-0">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    Revou<span className="text-primary">Shop</span>
                    <span className="ml-2 text-xs font-medium text-muted bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Admin
                    </span>
                </h1>
                <div className="flex items-center gap-3">
                    <a
                        href="/"
                        className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                        ← View Store
                    </a>
                    {user && (
                        <span className="text-xs text-muted">{user.email}</span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-xs text-danger hover:text-danger/80 transition-colors"
                    >
                        Logout
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {user?.name?.slice(0, 2).toUpperCase() || "AD"}
                    </div>
                </div>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-52 bg-card border-r border-border p-4 shrink-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-3 px-2">
                        Menu
                    </p>
                    <nav className="flex flex-col gap-1">
                        {[
                            { label: "Dashboard", icon: "▦", active: false },
                            { label: "Products", icon: "◧", active: true },
                            { label: "Orders", icon: "☰", active: false },
                            { label: "Customers", icon: "⊙", active: false },
                            { label: "Settings", icon: "⚙", active: false },
                        ].map(({ label, icon, active }) => (
                            <button
                                key={label}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                                    active
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted hover:bg-border hover:text-foreground"
                                }`}
                            >
                                <span className="text-base">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">
                                Product Management
                            </h2>
                            <p className="text-sm text-muted mt-0.5">
                                Manage your store inventory
                            </p>
                        </div>
                        <button
                            onClick={openAdd}
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
                        >
                            + Add Product
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {stats.map(({ label, value, sub, color }) => (
                            <div
                                key={label}
                                className="bg-card border border-border rounded-xl p-4"
                            >
                                <p className="text-xs text-muted mb-1">
                                    {label}
                                </p>
                                <p
                                    className={`text-2xl font-semibold ${color}`}
                                >
                                    {loadingProducts ? "—" : value}
                                </p>
                                <p className="text-xs text-muted mt-1">{sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger flex items-center justify-between">
                            <span>{apiError}</span>
                            <button
                                onClick={fetchProducts}
                                className="text-xs underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 max-w-xs h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                        />
                        <div className="flex gap-2 flex-wrap">
                            {["All", ...categories].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                                        filterCategory === cat
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "border-border text-muted hover:border-primary hover:text-primary"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-background">
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                                        Product
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                                        Category
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                                        Price
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                                        Badge
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                                        Status
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                                        Rating
                                    </th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loadingProducts ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-12 text-sm text-muted"
                                        >
                                            Loading products...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-12 text-sm text-muted"
                                        >
                                            No products found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-background transition-colors"
                                        >
                                            {/* Product */}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg border border-border overflow-hidden bg-background shrink-0">
                                                        <img
                                                            src={
                                                                product.image ||
                                                                "https://placehold.co/40x40"
                                                            }
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {product.title}
                                                        </p>
                                                        <p className="text-xs text-muted line-clamp-1 max-w-[180px]">
                                                            {
                                                                product.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Category */}
                                            <td className="px-4 py-3 text-muted">
                                                {product.category}
                                            </td>
                                            {/* Price */}
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-foreground">
                                                    {product.price}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-muted line-through ml-1.5">
                                                        {product.originalPrice}
                                                    </span>
                                                )}
                                            </td>
                                            {/* Badge */}
                                            <td className="px-4 py-3">
                                                {product.badge ? (
                                                    <span
                                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                            product.badge ===
                                                            "Sale"
                                                                ? "bg-danger/10 text-danger"
                                                                : "bg-primary/10 text-primary-active"
                                                        }`}
                                                    >
                                                        {product.badge}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                        product.inStock
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-danger/10 text-danger"
                                                    }`}
                                                >
                                                    {product.inStock
                                                        ? "In Stock"
                                                        : "Out of Stock"}
                                                </span>
                                            </td>
                                            {/* Rating */}
                                            <td className="px-4 py-3 text-muted text-xs">
                                                {product.rating &&
                                                product.rating > 0 ? (
                                                    <>
                                                        <span className="text-amber-400">
                                                            ★
                                                        </span>{" "}
                                                        {product.rating}{" "}
                                                        <span className="text-muted">
                                                            ({product.reviews})
                                                        </span>
                                                    </>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(product)
                                                        }
                                                        className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-muted hover:border-primary hover:text-primary transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteConfirmId(
                                                                product.id,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-xs font-medium border border-danger/30 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeModal}
                    />
                    <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl">
                        <h3 className="text-base font-semibold text-foreground mb-5">
                            {editingProduct
                                ? "Edit Product"
                                : "Add New Product"}
                        </h3>

                        <div className="flex flex-col gap-4">
                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                    Title *
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            title: e.target.value,
                                        }))
                                    }
                                    placeholder="Product title"
                                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Short description"
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                                />
                            </div>

                            {/* Category + Badge */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                        Category
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                category: e.target.value,
                                            }))
                                        }
                                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                                    >
                                        {categories.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                        Badge
                                    </label>
                                    <select
                                        value={form.badge}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                badge: e.target.value,
                                            }))
                                        }
                                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                                    >
                                        {badges.map((b) => (
                                            <option key={b} value={b}>
                                                {b || "None"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Price + Original Price */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                        Price *
                                    </label>
                                    <input
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                price: e.target.value,
                                            }))
                                        }
                                        placeholder="$0.00"
                                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                        Original Price
                                    </label>
                                    <input
                                        value={form.originalPrice}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                originalPrice: e.target.value,
                                            }))
                                        }
                                        placeholder="$0.00"
                                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                    Image Path
                                </label>
                                <input
                                    value={form.image}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            image: e.target.value,
                                        }))
                                    }
                                    placeholder="/product/image.jpg"
                                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* In Stock toggle */}
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-widest text-foreground">
                                    In Stock
                                </label>
                                <button
                                    onClick={() =>
                                        setForm((f) => ({
                                            ...f,
                                            inStock: !f.inStock,
                                        }))
                                    }
                                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                                        form.inStock
                                            ? "bg-primary"
                                            : "bg-border"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                                            form.inStock ? "left-7" : "left-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                disabled={saving}
                                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted hover:bg-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.title || !form.price || saving}
                                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingProduct
                                      ? "Save Changes"
                                      : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setDeleteConfirmId(null)}
                    />
                    <div className="relative bg-card border border-border rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl">
                        <h3 className="text-base font-semibold text-foreground mb-2">
                            Delete Product
                        </h3>
                        <p className="text-sm text-muted mb-6">
                            Are you sure? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted hover:bg-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirmId)}
                                className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-medium hover:bg-danger-hover transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg transition-all ${
                        toast.type === "danger" ? "bg-danger" : "bg-primary"
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
