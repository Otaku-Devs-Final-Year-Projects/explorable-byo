"use client";

import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <div className={isHome ? "" : "pt-20 md:pt-24 min-h-screen"}>
            {children}
        </div>
    );
}
