export { auth as proxy } from "@/lib/auth";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/tasks/:path*",
        "/notifications/:path*",
        "/tools/:path*"
    ],
}