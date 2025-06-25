"use client";

import { cn } from "@/lib/utils";
import { Home, List, Mic } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className=" max-w-screen-xl mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
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
          <div className="flex flex-row items-center justify-center space-x-2">
            <div>
              <Home size={14} />
            </div>
            <div>
              <Link href="/" className={cn("flex items-center  font-medium")}>
                Home
              </Link>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center space-x-2">
              <div>
                <List size={14} />
              </div>
              <Link href="/tasks" className={cn("flex items-center  font-medium")}>
                Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
