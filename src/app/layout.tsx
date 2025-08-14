import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Home, TrendingUp, ShoppingCart, Menu } from "lucide-react";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CashHandle Token Store",
  description: "Trade tokens based on HandCash handles with dividend potential",
};

function Navigation() {
  return (
    <header className="bg-gray-800/95 backdrop-blur-sm shadow-2xl border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-xl">$</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                  CashHandle
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Token Store</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <Link
              href="/"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link
              href="/rankings"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Rankings
            </Link>
            <Link
              href="/marketplace"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Marketplace
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ml-2"
            >
              Register Handle
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden bg-gray-800 border-t border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </Link>
          <Link
            href="/rankings"
            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
          >
            <TrendingUp className="h-5 w-5 mr-3" />
            Rankings
          </Link>
          <Link
            href="/marketplace"
            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
          >
            <ShoppingCart className="h-5 w-5 mr-3" />
            Marketplace
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
          >
            Register Handle
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
        <div className="min-h-screen">
          <Navigation />
          <main>{children}</main>
          
          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-2">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xl">$</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">CashHandle Token Store</h3>
                      <p className="text-sm text-gray-400">Tokenize your identity</p>
                    </div>
                  </div>
                  <p className="text-gray-400 max-w-md">
                    The revolutionary platform for tokenizing HandCash handles and earning dividends 
                    from payment flows. Built on Bitcoin SV for maximum security and scalability.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
                  <div className="space-y-2">
                    <Link href="/" className="block text-gray-400 hover:text-white transition-colors">Home</Link>
                    <Link href="/rankings" className="block text-gray-400 hover:text-white transition-colors">Rankings</Link>
                    <Link href="/marketplace" className="block text-gray-400 hover:text-white transition-colors">Marketplace</Link>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                  <div className="space-y-2">
                    <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                    <a href="#" className="block text-gray-400 hover:text-white transition-colors">API</a>
                    <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2024 CashHandle Token Store. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
