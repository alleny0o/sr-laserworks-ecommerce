import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "./amin";

interface NavLinkProps {  // Renamed from LinkProps to avoid confusion
    data: {
        name: string;
        href: string;
        index: number;
    },
    isActive: boolean;
    setSelectedIndicator: (href: string) => void;
}

// Renamed component to NavLink to avoid conflict with Next.js Link
export default function NavLink({data, isActive, setSelectedIndicator}: NavLinkProps) {
    const { name, href, index } = data;

    return (
        <motion.div
            className="relative flex items-center"
            onMouseEnter={() => {setSelectedIndicator(href)}}
            custom={index}
            variants={slide}
            initial="initial"
            animate="enter"
            exit="exit"
        >
            <motion.div
                variants={scale}
                animate={isActive ? "open" : "closed"}
                className="w-[10px] h-[10px] bg-white rounded-[50%] absolute -left-[30px]"
            >
            </motion.div>
            <Link href={href} legacyBehavior>
                {name}
            </Link>
        </motion.div>
    );
};