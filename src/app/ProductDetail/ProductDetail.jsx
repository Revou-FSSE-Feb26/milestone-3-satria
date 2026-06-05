"use client"

import Card from "@/component/Card";
import { useState, useEffect } from "react";

import FavoritIcon from "../../../public/icons/heart.svg";
import ShareIcon from "../../../public/icons/share-nodes.svg";
import TruckIcon from "../../../public/icons/truck.svg";
import RefreshIcon from "../../../public/icons/arrows-rotate.svg";
import ShieldIcon from "../../../public/icons/shield.svg";
import LockIcon from "../../../public/icons/lock.svg";

import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

const relatedProducts = [
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

const thumbnails = [
    "/product/headphone-5.jpg",
    "/product/headphone.jpg",
    "/product/headphone-2.jpg",
    "/product/headphone-3.jpg",
];

const trustBadges = [
    { icon: TruckIcon, text: "Free delivery over $50" },
    { icon: RefreshIcon, text: "30-day returns" },
    { icon: ShieldIcon, text: "1-year warranty" },
    { icon: LockIcon, text: "Secure checkout" },
];

export default function ProductDetail({
    title,
    description,
    image,
    price,
    originalPrice = "",
    badge,
    rating,
    reviews,
    category,
    discount,
    inStock = true,
    colors = [],
}) {
    
    const [quantity, setQuantity] = useState(1);
    const [activeThumb, setActiveThumb] = useState(0);
    const [mainImage, setMainImage] = useState(image);

    useEffect(() => {
        setActiveThumb(0);
        setMainImage(image);
    }, [image]);

    useEffect(() => {
        document.title = `${title} | RevouShop`;
    }, [title]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* breadcrumbs */}
            <div className="px-10 py-4 flex items-center gap-2 text-xs text-muted">
                <a href="/" className="hover:text-primary transition-colors">
                    Home
                </a>
                <span>/</span>
                {category && (
                    <>
                        <a
                            href="#"
                            className="hover:text-primary transition-colors"
                        >
                            {category}
                        </a>
                        <span>/</span>
                    </>
                )}
                <span className="text-foreground font-medium">{title}</span>
            </div>

            {/* Main Content */}
            <main>
                <section className="px-10 pb-10 grid grid-cols-2 gap-10">
                    {/* Left - Image and thumbnails */}
                    <div>
                        <div className="bg-card border border-border rounded-2xl h-80 flex items-center justify-center overflow-hidden">
                            <img
                                src={mainImage}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-3 mt-3">
                            {thumbnails.map((thumb, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setActiveThumb(i);
                                        setMainImage(thumb);
                                    }}
                                    className={`w-16 h-16 rounded-xl border overflow-hidden transition-colors ${
                                        i === activeThumb
                                            ? "border-primary"
                                            : "border-border hover:border-primary"
                                    }`}
                                >
                                    <img
                                        src={thumb}
                                        alt={`View ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right - Detail */}
                    <div className="flex flex-col gap-4">
                        {/* Badges */}
                        <div className="flex items-center gap-2">
                            {badge && (
                                <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        badge === "Sale"
                                            ? "bg-danger/10 text-danger"
                                            : "bg-primary/10 text-primary-active"
                                    }`}
                                >
                                    {badge}
                                </span>
                            )}
                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    inStock
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-danger/10 text-danger border-danger/20"
                                }`}
                            >
                                {inStock ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-semibold text-foreground leading-snug">
                            {title}
                        </h1>

                        {/* Rating */}
                        {rating && (
                            <div className="flex items-center gap-2">
                                <span className="text-amber-400 tracking-wide text-sm">
                                    ★★★★★
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {rating}
                                </span>
                                <span className="text-sm text-muted">
                                    ({reviews} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-semibold text-foreground">
                                {price}
                            </span>
                            {originalPrice !== "" && (
                                <span className="text-sm font-semibold text-muted line-through">
                                    {originalPrice}
                                </span>
                            )}
                            {discount && (
                                <span className="text-xs font-semibold text-danger bg-danger px-2 py-0.5 rounded-full">
                                    {discount}% Off
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted leading-relaxed">
                            {description}
                        </p>

                        <hr className="border-border" />

                        {/* Colors */}
                        {colors.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-2">
                                    Colors
                                </p>
                                <div className="flex gap-2">
                                    {colors.map((color, i) => (
                                        <button
                                            key={i}
                                            style={{ background: color }}
                                            className="w-6 h-6 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                                            aria-label={`Color ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-2">
                                Quantity
                            </p>
                            <div className="flex items-center">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 border border-border rounded-l-lg bg-card text-foreground hover:border-primary transition-colors text-lg">
                                    -
                                </button>
                                <div className="w-12 h-9 border-t border-b border-border bg-card flex items-center justify-center text-sm font-medium text-foreground">
                                    {quantity}
                                </div>
                                <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 border border-border rounded-l-lg bg-card text-foreground hover:border-primary transition-colors text-lg">
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="flex gap-3">
                            <button className="flex-1 py-3 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover active:bg-primary-active transition-colors">
                                Add to Cart
                            </button>
                            <button className="w-11 h-11 border border-border rounded-xl bg-card text-muted hover:bg-primary/10 hover:border-primary hover:text-primary trasition-colors flex items-center justify-center">
                                <FavoritIcon className="w-4 h-4 fill-current" />
                            </button>
                            <button className="w-11 h-11 border border-border rounded-xl bg-card text-muted hover:bg-primary/10 hover:border-primary hover:text-primary trasition-colors flex items-center justify-center">
                                <ShareIcon className="w-4 h-4 fill-current" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-2">
                            {trustBadges.map(({ text, icon: Icon }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-2 text-xs text-muted"
                                >
                                    <Icon className="w-4 h-4 fill-current" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                <section className="px-10 pb-10">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-foreground">
                            Related Products
                        </h2>
                        <a
                            href="#"
                            className="text-sm text-primary font-medium hover:text-primary-hover transition-colors"
                        >
                            See All
                        </a>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {relatedProducts.map((product) => (
                            <Card key={product.id} {...product} />
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
