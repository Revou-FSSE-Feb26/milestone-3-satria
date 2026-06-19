import { NextRequest, NextResponse } from "next/server";

const PLATZI = "https://api.escuelajs.co/api/v1";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 },
            );
        }

        const res = await fetch(`${PLATZI}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

        const data = await res.json();

        const profileRes = await fetch(`${PLATZI}/auth/profile`, {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });

        if (!profileRes.ok) {
            return NextResponse.json(
                { error: "Failed to fetch user profile" },
                { status: 500 },
            );
        }

        const profile = await profileRes.json();
        console.log("Platzi profile:", profile);

        const response = NextResponse.json({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            user: profile,
        });

        response.cookies.set("auth_token", data.access_token, {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        response.cookies.set("user_role", profile.role, {
            httpOnly: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Login failed" },
            { status: 500 },
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", "", { expires: new Date(0), path: "/" });
    response.cookies.set("user_role", "", { expires: new Date(0), path: "/" });
    return response;
}
