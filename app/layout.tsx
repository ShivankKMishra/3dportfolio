import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Welcome to my portfolio!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-black bg-opacity-90 text-white py-1 rounded-b-full shadow-lg mx-auto w-2/3 fixed top-0 left-1/2 transform -translate-x-1/2 z-50 outline outline-1">
          <nav className="flex gap-8 justify-center items-center">
            <Link
              href="/"
              className="hover:underline hover:bg-gray-700 px-3 py-0.5 rounded-lg transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:underline hover:bg-gray-700 px-3 py-0.5 rounded-lg transition duration-300"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="hover:underline hover:bg-gray-700 px-3 py-0.5 rounded-lg transition duration-300"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="hover:underline hover:bg-gray-700 px-3 py-0.5 rounded-lg transition duration-300"
            >
              Contact
            </Link>

            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                className="w-0 bg-gray-700 text-white px-8 py-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 opacity-0 group-hover:w-48 group-hover:opacity-100"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
