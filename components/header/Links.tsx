'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { menuSlide } from "./amin";
import Link from "./Link";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Links() {
    const pathname = usePathname();
    const [ selectedIndicator, setSelectedIndicator ] = useState(pathname);

    return (
        <motion.div
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="h-screen bg-gray-800 fixed right-0 top-0 text-white"
        >
            <div className="box-border h-full p-[100px] flex flex-col justify-between">
                <div 
                    onMouseLeave={() => {setSelectedIndicator(pathname)}} 
                    className="flex flex-col text-[56px] gap-[12px] mt-[80px]"
                >
                    <div className="text-white border-b-[1px] border-b-white uppercase text-[11px] mb-[40px]">
                        <p>Navigation</p>
                    </div>
                    {
                        navItems.map((data, index) => {
                            return (
                                <Link 
                                    key={index} 
                                    data={{...data, index}}
                                    isActive={selectedIndicator === data.href}
                                    setSelectedIndicator={setSelectedIndicator}
                                >
                                </Link>
                            );
                        })
                    }
                </div>
            </div>

        </motion.div>
    );
};