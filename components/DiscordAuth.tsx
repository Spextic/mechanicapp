"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { useEffect } from "react";
import { useRouter } from 'next/navigation'


export default function DiscordAuth() {
    const router = useRouter();
    const { data: session, status } = useSession();

    console.log(status);

    useEffect(() => {
        if (session) {
            router.push('/');
        } else {
            router.push('/login');
        }
    }, [session]);

    return (
        'true'
    );
}