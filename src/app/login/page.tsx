'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/core/utils/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert('이메일과 비밀번호를 입력해주세요.');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // 로그인 성공 시 홈으로
      window.location.href = '/';
    } catch (err: any) {
      alert(`로그인 실패: 이메일이나 비밀번호를 확인해주세요.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col min-h-full bg-slate-50 justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
        <p className="text-sm text-gray-500 mt-2">서비스 이용을 위해 로그인해주세요.<br/><span className="text-primary-600 font-medium">(이메일 형식으로 입력해주세요)</span></p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
           <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="이메일 주소 입력" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
           <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="비밀번호를 입력하세요" />
        </div>
        
        <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary-700 transition mt-6 disabled:bg-gray-400">
           {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="mt-6 text-center">
         <span className="text-gray-500 text-sm">계정이 없으신가요? </span>
         <Link href="/signup" className="text-primary-600 font-semibold text-sm hover:underline">회원가입</Link>
      </div>
    </div>
  );
}
