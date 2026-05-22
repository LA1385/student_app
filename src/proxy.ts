export { auth as proxy } from "@/lib/auth";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/tasks/:path*",
        "/progress/:path*",
        "/tools/:path*"
    ],
}