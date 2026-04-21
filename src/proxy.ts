export { auth as proxy } from "@/app/Auth";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/tasks/:path*",
        "/progress/:path*",
        "/tools/:path*"
    ],
}