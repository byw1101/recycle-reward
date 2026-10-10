'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서만 로컬 스토리지 확인
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      const parsedUser = JSON.parse(user);
      setIsAdmin(parsedUser.role === 'admin');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="bg-primary-600 text-white p-4 shadow-md flex justify-between items-center relative z-50">
      <Link href="/">
         <h1 className="text-xl font-bold">환경보호 리워드</h1>
      </Link>
      <div className="flex space-x-3 items-center text-sm">
        {isAdmin && (
           <Link href="/admin" className="bg-primary-700 px-3 py-1.5 rounded-full text-primary-100 hover:text-white transition font-medium shadow-inner">
             ⚙️ 장소 관리
           </Link>
        )}
        {isLoggedIn ? (
           <button onClick={handleLogout} className="text-primary-100 hover:text-white transition font-medium">
             로그아웃
           </button>
        ) : (
           <Link href="/login" className="text-primary-100 hover:text-white transition font-medium">
             로그인
           </Link>
        )}
      </div>
    </header>
  );
}
