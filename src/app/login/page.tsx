'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'admin' && password === 'admin') {
      localStorage.setItem('user', JSON.stringify({ id, role: 'admin' }));
      window.location.href = '/';
    } else if (id && password) {
      localStorage.setItem('user', JSON.stringify({ id, role: 'user' }));
      window.location.href = '/';
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="p-8 flex flex-col min-h-full bg-slate-50 justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
        <p className="text-sm text-gray-500 mt-2">서비스 이용을 위해 로그인해주세요.<br/><span className="text-primary-600 font-medium">(관리자 테스트: admin / admin)</span></p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
           <input type="text" value={id} onChange={e => setId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="아이디를 입력하세요" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
           <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="비밀번호를 입력하세요" />
        </div>
        
        <button type="submit" className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary-700 transition mt-6">
           로그인
        </button>
      </form>

      <div className="mt-6 text-center">
         <span className="text-gray-500 text-sm">계정이 없으신가요? </span>
         <Link href="/signup" className="text-primary-600 font-semibold text-sm hover:underline">회원가입</Link>
      </div>
    </div>
  );
}
