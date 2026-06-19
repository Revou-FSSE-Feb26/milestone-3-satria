"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/Authcontext";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const role = await login(email, password);
            const redirect = searchParams.get("redirect");

            if (redirect) {
                router.push(redirect);
            } else if (role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }

            router.refresh();
        } catch (err: any) {
            setError(err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top bar */}
            <nav className="h-16 bg-card border-b border-border px-8 flex items-center">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    Revou<span className="text-primary">Shop</span>
                </h1>
            </nav>

            {/* Center card */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">
                            Admin Login
                        </h2>
                        <p className="text-sm text-muted mt-1">
                            Sign in to manage your store
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col gap-4">
                            {/* Email */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter your email"
                                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1.5 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError("");
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter your password"
                                        className="w-full h-10 px-3 pr-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <button
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors text-xs"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-xs text-danger bg-danger/10 px-3 py-2 rounded-lg">
                                    {error}
                                </p>
                            )}

                            {/* Login Button */}
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full h-10 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover active:bg-primary-active transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>

                            {/* Demo credentials hint */}
                            <div className="border border-border rounded-xl px-4 py-3 bg-background">
                                <p className="text-xs font-semibold text-foreground mb-2">
                                    Demo Credentials
                                </p>
                                <div className="flex flex-col gap-2">
                                    {/* Admin */}
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted mb-1">
                                            Admin
                                        </p>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted">
                                                Email
                                            </span>
                                            <span className="font-mono font-medium text-foreground">
                                                admin@mail.com
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted">
                                                Password
                                            </span>
                                            <span className="font-mono font-medium text-foreground">
                                                admin123
                                            </span>
                                        </div>
                                    </div>
                                    <hr className="border-border" />
                                    {/* Customer */}
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted mb-1">
                                            Customer
                                        </p>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted">
                                                Email
                                            </span>
                                            <span className="font-mono font-medium text-foreground">
                                                shopper@revou.com
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted">
                                                Password
                                            </span>
                                            <span className="font-mono font-medium text-foreground">
                                                changeme
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to store */}
                    <p className="text-center text-sm text-muted mt-5">
                        Not an admin?{" "}
                        <a
                            href="/"
                            className="text-primary font-medium hover:text-primary-hover transition-colors"
                        >
                            Back to Store
                        </a>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="h-12 flex items-center justify-center">
                <p className="text-xs text-muted">
                    © 2026 Satria Pamungkas. All rights reserved.
                </p>
            </div>
        </div>
    );
}
