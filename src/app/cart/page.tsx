"use client";

import Link from "next/link";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { useCart } from "@/context/Cartcontext";
import { useState } from "react";

import TruckIcon from "../../../public/icons/truck.svg";
import RefreshIcon from "../../../public/icons/arrows-rotate.svg";
import ShieldIcon from "../../../public/icons/shield.svg";
import LockIcon from "../../../public/icons/lock.svg";

const trustBadges = [
    { icon: TruckIcon, text: "Free delivery over $50" },
    { icon: RefreshIcon, text: "30-day returns" },
    { icon: ShieldIcon, text: "1-year warranty" },
    { icon: LockIcon, text: "Secure checkout" },
];

const VALID_COUPON = "REVOU10";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal } = useCart();
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState("");

    const applyCoupon = () => {
        setCouponError("");
        if (coupon.toUpperCase() === VALID_COUPON) {
            setCouponApplied(true);
        } else {
            setCouponError("Invalid coupon code");
            setCouponApplied(false);
        }
    };

    const discount = couponApplied ? subtotal * 0.1 : 0;
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const total = subtotal - discount + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center gap-4 px-10">
                    <div className="text-5xl">🛒</div>
                    <h2 className="text-xl font-semibold text-foreground">
                        Your cart is empty
                    </h2>
                    <p className="text-sm text-muted">
                        Looks like you haven't added anything yet.
                    </p>
                    <Link
                        href="/"
                        className="mt-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Breadcrumb */}
            <div className="px-10 py-4 flex items-center gap-2 text-xs text-muted">
                <Link href="/" className="hover:text-primary transition-colors">
                    Home
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Cart</span>
            </div>

            <main className="flex-1 px-10 pb-10">
                <h1 className="text-xl font-semibold text-foreground mb-6">
                    Shopping Cart{" "}
                    <span className="text-sm font-normal text-muted">
                        ({items.length} item{items.length !== 1 ? "s" : ""})
                    </span>
                </h1>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left — Cart Items */}
                    <div className="col-span-2 flex flex-col gap-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-card border border-border rounded-2xl p-4 flex gap-4"
                            >
                                {/* Image */}
                                <div className="w-24 h-24 rounded-xl border border-border overflow-hidden bg-background shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            {item.badge && (
                                                <span
                                                    className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${
                                                        item.badge === "Sale"
                                                            ? "bg-danger/10 text-danger"
                                                            : "bg-primary/10 text-primary-active"
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                            <h3 className="text-sm font-semibold text-foreground mt-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-muted mt-0.5">
                                                {item.description}
                                            </p>
                                        </div>
                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-muted hover:text-danger transition-colors text-lg shrink-0"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        {/* Quantity */}
                                        <div className="flex items-center">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, -1)
                                                }
                                                className="w-8 h-8 border border-border rounded-l-lg bg-background text-foreground hover:border-primary transition-colors text-base"
                                            >
                                                -
                                            </button>
                                            <div className="w-10 h-8 border-t border-b border-border bg-background flex items-center justify-center text-sm font-medium text-foreground">
                                                {item.quantity}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, 1)
                                                }
                                                className="w-8 h-8 border border-border rounded-r-lg bg-background text-foreground hover:border-primary transition-colors text-base"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-foreground">
                                                $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </p>
                                            {item.originalPrice && (
                                                <p className="text-xs text-muted line-through">
                                                    $
                                                    {(
                                                        item.originalPrice *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <Link
                            href="/"
                            className="text-sm text-primary font-medium hover:text-primary-hover transition-colors self-start"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>

                    {/* Right — Order Summary */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-card border border-border rounded-2xl p-5">
                            <h2 className="text-sm font-semibold text-foreground mb-4">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-2.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-foreground font-medium">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                {couponApplied && (
                                    <div className="flex justify-between text-primary">
                                        <span>Coupon (REVOU10)</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted">Shipping</span>
                                    <span
                                        className={
                                            shipping === 0
                                                ? "text-primary font-medium"
                                                : "text-foreground font-medium"
                                        }
                                    >
                                        {shipping === 0
                                            ? "Free"
                                            : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <hr className="border-border" />
                                <div className="flex justify-between text-base font-semibold text-foreground">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-2">
                                    Coupon Code
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={(e) => {
                                            setCoupon(e.target.value);
                                            setCouponError("");
                                        }}
                                        placeholder="e.g. REVOU10"
                                        className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="px-3 h-9 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponError && (
                                    <p className="text-xs text-danger mt-1.5">
                                        {couponError}
                                    </p>
                                )}
                                {couponApplied && (
                                    <p className="text-xs text-primary mt-1.5">
                                        ✓ Coupon applied! 10% off
                                    </p>
                                )}
                            </div>

                            <button className="w-full mt-5 py-3 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover active:bg-primary-active transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-2 gap-3">
                            {trustBadges.map(({ icon: Icon, text }) => (
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
                </div>
            </main>
            <Footer />
        </div>
    );
}
