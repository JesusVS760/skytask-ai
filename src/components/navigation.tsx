"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex h-14">
          <Link href="/" className={cn("flex items-center px-3 font-medium")}>
            Home
          </Link>

          <Link href="/tasks" className={cn("flex items-center px-3 font-medium")}>
            Tasks
          </Link>
          <Link href="/auth/login" className={cn("flex items-center px-3 font-medium")}>
            Login
          </Link>
          <Link href="/auth/register" className={cn("flex items-center px-3 font-medium")}>
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
