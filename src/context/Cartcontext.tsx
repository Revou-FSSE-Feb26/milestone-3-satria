"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useMemo,
} from "react";

export interface CartItem {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Omit<CartItem, "quantity">) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    clearCart: () => void;
    totalCount: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "revou_cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_KEY);
            if (saved) setItems(JSON.parse(saved));
        } catch {}
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        const count = items.reduce((s, i) => s + i.quantity, 0);
        localStorage.setItem("cartCount", String(count));
    }, [items, hydrated]);

    const addItem = useCallback((product: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, delta: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.id === id
                    ? { ...i, quantity: Math.max(1, i.quantity + delta) }
                    : i,
            ),
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalCount = useMemo(
        () => items.reduce((s, i) => s + i.quantity, 0),
        [items],
    );

    const subtotal = useMemo(
        () => items.reduce((s, i) => s + i.price * i.quantity, 0),
        [items],
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
