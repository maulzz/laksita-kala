// app/page.tsx

"use client";

import { useSession } from "next-auth/react";
import Navbar from "./components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          {session ? (
            <>
              <h1 className="mb-4 text-4xl font-bold">
                Selamat Datang Kembali!
              </h1>
              <p className="text-xl">
                Anda login sebagai: <strong>{session.user?.name}</strong>
              </p>
              <p className="text-md text-neutral-500">
                ({session.user?.email})
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-4 text-4xl font-bold">
                Selamat Datang di Laksita Kala
              </h1>
              <p className="text-xl text-neutral-500">
                Silakan login untuk memulai.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
