"use client";

import logo from "../../images/main-logo.avif";
import { CiShoppingCart } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";


import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

// Framer motion stuff
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const Header = () => {
  const { user, isLoaded } = useUser();

  const [isActive, setIsActive] = useState(false);

  const [hidden, setHidden] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (previous && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header 
        className="bg-white border-gray-100 border-b-[1px] sticky top-0 z-20"
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <nav className="flex justify-between items-center max-w-6xl mx-auto py-3 px-10">
          <button
            onClick={() => setIsActive(!isActive)}
            className="lg:hidden w-9 h-9 relative flex justify-center items-center"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`
            w-full h-[1.5px] bg-black block transition-all duration-300 ease-in-out
            ${isActive ? "absolute top-1/2 -translate-y-1/2 rotate-45" : ""}
          `}
              />
              <span
                className={`
            w-full h-[1.5px] bg-black block transition-all duration-300 ease-in-out
            ${isActive ? "opacity-0" : "opacity-100"}
          `}
              />
              <span
                className={`
            w-full h-[1.5px] bg-black block transition-all duration-300 ease-in-out
            ${isActive ? "absolute top-1/2 -translate-y-1/2 -rotate-45" : ""}
          `}
              />
            </div>
          </button>
          <div>
            <Image
              className="rounded-sm"
              src={logo}
              alt="logo"
              width={65}
              height={65}
            />
          </div>
          <div className="hidden lg:block lg:relative">
            <ul className="flex items-center gap-[5vw]">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex items-center gap-[1.5vw]">
              <li>
                <Link href="/cart">
                  <CiShoppingCart className="h-7 w-7" />
                </Link>
              </li>
              <li>
                <Link href="/favorites">
                  <CiHeart className="h-7 w-7" />
                </Link>
              </li>
              <li className="hidden lg:block">
                {isLoaded ? (
                  user ? (
                    <UserButton />
                  ) : (
                    <SignInButton mode="modal">
                      <button>Sign in</button>
                    </SignInButton>
                  )
                ) : null}
              </li>
            </ul>
          </div>
        </nav>
      </motion.header>
    </>
  );
};

export default Header;
