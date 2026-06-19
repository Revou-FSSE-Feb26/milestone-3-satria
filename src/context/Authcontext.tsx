"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<string>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("auth_token");
        const savedUser = localStorage.getItem("auth_user");
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback(
        async (email: string, password: string): Promise<string> => {
            setError(null);
            setLoading(true);
            try {
                const res = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Invalid email or password.");
                }

                setToken(data.access_token);
                setUser(data.user);

                localStorage.setItem("auth_token", data.access_token);
                localStorage.setItem("auth_user", JSON.stringify(data.user));

                return data.user.role;
            } catch (err: any) {
                setError(err.message || "Login failed");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth", { method: "DELETE" });
        } finally {
            deleteCookie("auth_token");
            deleteCookie("user_role");
            setUser(null);
            setToken(null);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
