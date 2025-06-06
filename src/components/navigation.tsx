"use client";

import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className=" max-w-screen-xl mx-auto px-4">
        <div className="flex items-center  h-14">
          <div className="flex items-center gap-2 mr-2">
            <div
              className="w-8 h-8 bg-gradient-to-br from-blue-700 to-teal-600
 rounded-lg flex items-center justify-center"
            >
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold">SayTask AI</p>
            </div>
          </div>
          <div>
            <Link href="/" className={cn("flex items-center px-3 font-medium")}>
              Home
            </Link>
          </div>
          <div>
            <Link href="/tasks" className={cn("flex items-center px-3 font-medium")}>
              Tasks
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
