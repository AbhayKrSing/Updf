import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-30 h-14 bg-white/17 backdrop-blur-lg border-b border-gray-200 transition-all">
      <MaxWidthWrapper>
        <div className="h-14 flex items-center justify-between font-semibold">
          <Link href={"/"}>
            <span>Updf</span>
          </Link>
          {/* todo to mobile navbar */}

          <div className="sm:flex hidden items-center space-x-3">
            <>
              <Link
                href={"/pricing"}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>

              <LoginLink
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Sign in
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get Started <ArrowRight />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
