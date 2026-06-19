import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <p className="text-sm text-muted">Loading...</p>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
