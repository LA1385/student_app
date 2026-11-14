export async function getResponseErrorMessage(
    response: Response,
    fallback: string,
) {
    try {
        const data: unknown = await response.json();
        if (
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string" &&
            data.message.trim()
        ) {
            return data.message;
        }
    } catch {
        // Use the fallback when the response is not JSON.
    }

    return fallback;
}

export function getNetworkErrorMessage(fallback: string) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return "You appear to be offline. Check your connection and try again.";
    }

    return fallback;
}
