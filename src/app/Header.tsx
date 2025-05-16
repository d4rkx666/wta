'use client'
import Link from 'next/link';
import { useAuth } from './contexts/AuthProvider';
import { auth } from '@/lib/firebase/client';
import { logout_user } from '@/hooks/logout';

const Header = () => {
  const {isAuth} = useAuth()

  const handleLogout = async()=>{
    await auth.signOut();
    const r = await logout_user();
    const data = await r.json();
    if(data.success){
      window.location.href = "/login";
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <span className="text-blue-600 text-lg font-bold">Welcome</span>
            <span className="text-red-600 text-lg font-bold">Travel</span>
            <span className="text-blue-600 text-lg font-bold">Accommodation</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-800 hover:text-blue-600 font-medium transition">Home</Link>
          <Link href="/about" className="text-gray-800 hover:text-blue-600 font-medium transition">About</Link>
          {isAuth ? (
            <>
              <Link href="/dashboard" className="text-gray-800 hover:text-blue-600 font-medium transition">Dashboard</Link>
              <button onClick={handleLogout} className="text-gray-800 hover:text-blue-600 font-medium transition">Logout</button>
            </>
          ):(
            <Link href="/login" className="text-gray-800 hover:text-blue-600 font-medium transition">Login</Link>
          )}
          
        </nav>
      </div>
    </header>
  );
};

export default Header;