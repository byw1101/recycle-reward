'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ id: '', password: '', name: '' });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id && form.password && form.name) {
      alert('회원가입이 완료되었습니다!');
      router.push('/login');
    } else {
      alert('모든 정보를 입력해주세요.');
    }
  };

  return (
    <div className="p-8 flex flex-col min-h-full bg-slate-50 justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">회원가입</h2>
        <p className="text-sm text-gray-500 mt-2">리워드 적립을 위해 계정을 생성합니다.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
           <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="실명을 입력하세요" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
           <input type="text" value={form.id} onChange={e => setForm({...form, id: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="사용할 아이디를 입력하세요" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
           <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="비밀번호를 입력하세요" />
        </div>
        
        <button type="submit" className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-md hover:bg-slate-900 transition mt-6">
           가입하기
        </button>
      </form>

      <div className="mt-6 text-center">
         <span className="text-gray-500 text-sm">이미 계정이 있으신가요? </span>
         <Link href="/login" className="text-primary-600 font-semibold text-sm hover:underline">로그인</Link>
      </div>
    </div>
  );
}
