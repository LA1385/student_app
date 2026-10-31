"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 30_000;

export default function NotificationRefresh() {
    const router = useRouter();

    useEffect(() => {
        let lastRefreshAt = 0;

        const refreshIfAllowed = () => {
            const now = Date.now();
            if (now - lastRefreshAt < REFRESH_INTERVAL_MS) {
                return;
            }

            lastRefreshAt = now;
            router.refresh();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                refreshIfAllowed();
            }
        };

        window.addEventListener("focus", refreshIfAllowed);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", refreshIfAllowed);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [router]);

    return null;
}
