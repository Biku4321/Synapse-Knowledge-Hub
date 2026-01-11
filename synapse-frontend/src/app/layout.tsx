import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synapse Knowledge Hub",
  description: "AI Powered Research Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} bg-black text-zinc-200 antialiased selection:bg-indigo-500/30`}
        >
          {/* LOGGED IN APP */}
          <SignedIn>
            <div className="flex h-screen w-full overflow-hidden bg-black">

              {/* SIDEBAR */}
              <div className="w-64 flex-shrink-0 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5">
                <Sidebar />
              </div>

              {/* CONTENT */}
              <main className="flex-1 overflow-y-auto relative z-10">
                {/* PAGE TRANSITION WRAPPER */}
                <div className="max-w-6xl mx-auto p-8 lg:p-12 pb-32 page-enter">
                  {children}
                </div>
              </main>
            </div>
          </SignedIn>

          {/* LANDING / SIGNED OUT */}
          <SignedOut>
            <main className="min-h-screen w-full relative overflow-x-hidden page-enter">
              {children}
            </main>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
