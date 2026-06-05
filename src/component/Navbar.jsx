"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SearchIcon from "../../public/icons/search.svg";
import CartIcon from "../../public/icons/cart.svg";
import UserIcon from "../../public/icons/user.svg";

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem("cartCount");
        if (saved) setCartCount(Number(saved));
    }, []);
    return (
        <nav className="flex items-center justify-between px-8 h-16 bg-card border-b border-border">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Revou<span className="text-primary">Shop</span>
            </h1>
            <ul className="flex items-center gap-1 list-none">
                {["Home", "Product", "Promotions"].map((item) => (
                    <li key={item}>
                        {item === "Home" ? (
                            <Link
                                href="/"
                                className="text-sm font-medium text-muted px-3 py-1.5 rounded-lg hover:bg-border hover:text-foreground transition-colors duration-150"
                            >
                                {item}
                            </Link>
                        ) : (
                            <a
                                href="#"
                                className="text-sm font-medium text-muted px-3 py-1.5 rounded-lg hover:bg-border hover:text-foreground transition-colors duration-150"
                            >
                                {item}
                            </a>
                        )}
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:bg-border transition-color">
                    <SearchIcon className="w-4 h-4 fill-current" />
                </button>
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:bg-border transition-color">
                    <CartIcon className="w-4 h-4 fill-current" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {cartCount}
                    </span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:bg-border transition-color">
                    <UserIcon className="w-4 h-4 fill-current" />
                </button>
            </div>
        </nav>
    );
}
