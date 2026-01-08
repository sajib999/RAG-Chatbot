"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className='w-full border-b bg-background'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
        {/* Brand */}
        <Link href='/' className='text-xl font-bold'>
          RAG Chatbot
        </Link>

        {/* Right Side */}
        <div className='flex items-center gap-4'>
          <SignedOut>
            <SignInButton mode='modal'>
              <Button variant='ghost'>Sign In</Button>
            </SignInButton>

            <SignUpButton mode='modal'>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href='/chat'>
              <Button variant='ghost'>Chat</Button>
            </Link>

            <Link href='/upload'>
              <Button variant='ghost'>Upload</Button>
            </Link>

            <UserButton afterSignOutUrl='/' />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
