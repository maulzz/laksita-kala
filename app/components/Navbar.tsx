// src/components/Navbar.tsx
"use client";

// ... (import lain)
import { useSession, signIn, signOut } from "next-auth/react"; // <-- Import
import Image from "next/image";
import { useState } from "react";

// ... (kode Navbar)
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession(); // <-- Dapatkan data sesi

  return (
    <nav /* ... */>
      <div className="container mx-auto flex items-center justify-between ...">
        
        <div className="hidden items-center space-x-4 md:flex">
         
          {session ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => signOut()}
                className="rounded-full bg-orange-500 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-full bg-orange-500 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-600"
            >
              Login
            </button>
          )}

          {/* ... (Tombol Theme Toggle) ... */}
        </div>
        {/* ... (Tombol Hamburger & Sidebar) ... */}
      </div>
    </nav>
  );
}
