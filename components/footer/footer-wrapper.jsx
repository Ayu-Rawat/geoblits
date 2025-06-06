"use client"
import { usePathname } from "next/navigation";

export default function FooterWrapper({ children }) {
    const path = usePathname();

    console.log(path);

    if (path !== "/") {
        return (
            <>
                {children}
            </>
        );
    } else {
        return null;
    }
}