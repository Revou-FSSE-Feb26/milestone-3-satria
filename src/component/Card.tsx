"use client";

import Link from "next/link";
import { useCart } from "@/context/Cartcontext";
import { useAuth } from "@/context/Authcontext";
import { useRouter } from "next/navigation";

interface CardProps {
    id: number;
    title: string;
    description: string;
    image: string;
    price: string;
    originalPrice?: string;
    badge?: string | null;
    rating?: number | null;
    reviews?: number;
    category?: string;
}

export default function Card({
    id,
    title,
    description,
    image,
    price,
    originalPrice = "",
    badge,
    rating,
    reviews,
    category = "",
}: CardProps) {
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            router.push("/login?redirect=/product");
            return;
        }

        const priceNum = parseFloat(price.replace("$", ""));
        const originalPriceNum = originalPrice
            ? parseFloat(originalPrice.replace("$", ""))
            : undefined;

        addItem({
            id,
            title,
            description,
            image,
            price: priceNum,
            originalPrice: originalPriceNum,
            badge: badge || undefined,
            category,
        });
    };

    return (
        <Link href={`/product/${id}`}>
            <div className="group bg-card rounded-2xl border border-border overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                {/* Image */}
                <div className="w-full h-48 overflow-hidden bg-background">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                {/* Body */}
                <div className="p-4">
                    {/* Badge + Rating */}
                    <div className="flex items-center justify-between mb-2">
                        {badge && (
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                                    badge === "Sale"
                                        ? "bg-danger/10 text-danger"
                                        : "bg-primary/10 text-primary-active"
                                }`}
                            >
                                {badge}
                            </span>
                        )}
                        {rating && (
                            <span className="text-xs text-zinc-500">
                                ⭐{rating}
                                <span className="text-muted">({reviews})</span>
                            </span>
                        )}
                    </div>
                    {/* Title */}
                    <h2 className="text-sm font-semibold text-foreground mb-1 leading-snug">
                        {title}
                    </h2>
                    {/* Description */}
                    <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">
                        {description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-foreground">
                            {price}
                        </span>
                        {originalPrice !== "" && (
                            <span className="text-xs text-muted line-through">
                                {originalPrice}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full py-2.5 rounded-xl text-white bg-primary hover:bg-primary-hover active:bg-primary-active text-xs font-medium tracking-wide transition-colors duration-200"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
}
