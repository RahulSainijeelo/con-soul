import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/auth/SessionProvider"

const layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}

export default layout
