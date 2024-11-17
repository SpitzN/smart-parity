import { BrandLogo } from "@/components/common/BrandLogo";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="fixed top-0 z-10 flex w-full bg-background/95 py-6 shadow-xl">
      <nav className="container flex items-center gap-10 font-semibold">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>

        <Link href="#" className="text-lg">
          Features
        </Link>

        <Link href="/#pricing" className="text-lg">
          Pricing
        </Link>

        <Link href="#" className="text-lg">
          Contact
        </Link>

        <Link href="#" className="text-lg">
          About
        </Link>

        <span className="text-lg">
          <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>Login</SignInButton>
          </SignedOut>
        </span>
      </nav>
    </header>
  );
}
