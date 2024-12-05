"use client";

import { signIn, signOut } from "next-auth/react";

export default function LoginUsingDiscord() {
    return (
        <section className="flex gap-8 items-center justify-center mt-12">
            <p className="font-bold text-lg">Login Using Discord</p>
            <button
                onClick={() => signIn("discord")}
                className="text-base py-3 px-4 bg-[#5865F2]"
            >
                Login
            </button>
        </section>
    );
}