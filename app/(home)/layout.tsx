import React from 'react'
import { getServerSession } from 'next-auth';
import { SessionProvider } from "@/components/auth/SessionProvider"

const layout = async ({ children }: { children: React.ReactNode }
) => {
    const session = await getServerSession();

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}

export default layout