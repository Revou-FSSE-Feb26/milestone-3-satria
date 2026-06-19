"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/Cartcontext";
import { useAuth } from "@/context/Authcontext";
import { useRouter } from "next/navigation";
import SearchIcon from "../../public/icons/search.svg";
import CartIcon from "../../public/icons/cart.svg";
import UserIcon from "../../public/icons/user.svg";

export default function Navbar() {
    const { totalCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        router.push("/");
        router.refresh();
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="flex items-center justify-between px-8 h-16 bg-card border-b border-border">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Revou<span className="text-primary">Shop</span>
            </h1>
            <ul className="flex items-center gap-1 list-none">
                {["Home", "Product", "Promotions"].map((item) => (
                    <li key={item}>
                        <Link
                            href={item === "Home" ? "/" : "/product"}
                            className="text-sm font-medium text-muted px-3 py-1.5 rounded-lg hover:bg-border hover:text-foreground transition-colors duration-150"
                        >
                            {item}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:bg-border transition-colors">
                    <SearchIcon className="w-4 h-4 fill-current" />
                </button>
                <Link
                    href="/cart"
                    className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:bg-border transition-colors"
                >
                    <CartIcon className="w-4 h-4 fill-current" />
                    {totalCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                            {totalCount > 9 ? "9+" : totalCount}
                        </span>
                    )}
                </Link>

                {isAuthenticated ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            className="flex items-center gap-2 px-2 h-9 rounded-lg border border-border text-muted hover:bg-border transition-colors"
                        >
                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
                                {user?.name?.slice(0, 2).toUpperCase() || "U"}
                            </div>
                            <span className="text-xs font-medium text-foreground hidden sm:inline max-w-[80px] truncate">
                                {user?.name}
                            </span>
                            <span className="text-[10px] text-muted">▾</span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-11 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                                <div className="px-3 py-2 border-b border-border">
                                    <p className="text-xs font-semibold text-foreground truncate">
                                        {user?.name}
                                    </p>
                                    <p className="text-[10px] text-muted truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                {user?.role === "admin" && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-border transition-colors"
                                    >
                                        ▦ Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/10 transition-colors"
                                >
                                    ✕ Sign out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border text-muted hover:bg-border transition-colors text-xs font-medium"
                    >
                        <UserIcon className="w-4 h-4 fill-current" />
                        Sign in
                    </Link>
                )}
            </div>
        </nav>
    );
}
