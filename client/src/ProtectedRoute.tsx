import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "./api/apiClient";

function ProtectedRoute() {
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(() => {
        const token = localStorage.getItem("token");
        return token ? "loading" : "unauthenticated";
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        getUser()
            .then(() => setStatus("authenticated"))
            .catch(() => {
                localStorage.removeItem("token");
                setStatus("unauthenticated");
            });
    }, []);

    if (status === "loading") return null;
    if (status === "unauthenticated") return <Navigate to="/login" replace />;
    return <Outlet />;
}

export default ProtectedRoute;