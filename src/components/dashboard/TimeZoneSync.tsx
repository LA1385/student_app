"use client";

import { useEffect } from "react";
import { updateUserTimeZone } from "@/app/actions/user";

export default function TimeZoneSync() {
    useEffect(() => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        void updateUserTimeZone(timeZone);
    }, []);

    return null;
}
