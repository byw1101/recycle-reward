'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/utils/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name) return alert('모든 정보를 입력해주세요.');
    setIsLoading(true);

    try {
      // 1. Supabase Auth 계정 생성
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      // 2. Profiles 테이블에 추가 정보 저장
      if (data.user) {
         // 테스트 용도로 admin@ 으로 시작하는 이메일이면 관리자 권한 부여
         const role = form.email.startsWith('admin@') ? 'admin' : 'user';
         const { error: profileError } = await supabase.from('profiles').insert([
           { id: data.user.id, name: form.name, role: role }
         ]);
         if (profileError) throw profileError;
      }

      alert('회원가입이 완료되었습니다!');
      router.push('/login');
    } catch (err: any) {
      alert(`회원가입 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
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
           <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
           <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="이메일 주소를 입력하세요 (admin@...은 관리자)" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
           <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900" placeholder="6자리 이상 비밀번호" minLength={6} />
        </div>
        
        <button type="submit" disabled={isLoading} className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-md hover:bg-slate-900 transition mt-6 disabled:bg-gray-400">
           {isLoading ? '가입 처리 중...' : '가입하기'}
        </button>
      </form>

      <div className="mt-6 text-center">
         <span className="text-gray-500 text-sm">이미 계정이 있으신가요? </span>
         <Link href="/login" className="text-primary-600 font-semibold text-sm hover:underline">로그인</Link>
      </div>
    </div>
  );
}
