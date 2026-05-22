import { signIn } from "@/lib/auth";

export default function SignIn({text}: {text: string}) {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("google")
            }}
        >
            <button className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 py-2.5 font-semibold transition-all shadow-sm shadow-primary/25 hover:shadow-primary/40 text-sm">
                {text}
            </button>
        </form>
    )
}
