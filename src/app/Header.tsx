'use client'
import Link from 'next/link';
import { useAuth } from './contexts/AuthProvider';
import { auth } from '@/lib/firebase/client';
import { logout_user } from '@/hooks/logout';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const { isAuth } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    const r = await logout_user();
    const data = await r.json();
    if (data.success) {
      window.location.href = "/login";
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="hidden md:flex flex items-center">
          <Image
            src={"/logo.png"}
            width={80}
            height={80}
            alt='logo'
          />
        </Link>

        <Link href="/" className="md:hidden flex items-center">
          <Image
            src={"/iso.png"}
            width={80}
            height={80}
            alt='logo'
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-xl">
          <Link href="/" className="text-gray-800 hover:text-blue-600 font-medium transition">Home</Link>
          <Link href="/about" className="text-gray-800 hover:text-blue-600 font-medium transition">About</Link>
          {isAuth ? (
            <>
              <Link href="/dashboard" className="text-gray-800 hover:text-blue-600 font-medium transition">Dashboard</Link>
              <button onClick={handleLogout} className="text-gray-800 hover:text-blue-600 font-medium transition">Logout</button>
            </>
          ) : (
            <Link href="/login" className="text-gray-800 hover:text-blue-600 font-medium transition">Login</Link>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
          <nav className="flex flex-col space-y-4 p-4 text-xl">
            <Link 
              href="/" 
              className="text-gray-800 hover:text-blue-600 font-medium transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-gray-800 hover:text-blue-600 font-medium transition"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {isAuth ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-800 hover:text-blue-600 font-medium transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="text-gray-800 hover:text-blue-600 font-medium transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="text-gray-800 hover:text-blue-600 font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;