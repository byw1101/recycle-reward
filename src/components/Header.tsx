'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. 초기 세션 로드
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify({ id: session.user.email }));
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data?.role === 'admin') setIsAdmin(true);
          });
      }
    });

    // 2. 로그인 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        localStorage.setItem('user', JSON.stringify({ id: session.user.email }));
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data }) => setIsAdmin(data?.role === 'admin'));
      } else {
        localStorage.removeItem('user');
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
