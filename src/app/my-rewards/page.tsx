'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/core/utils/supabaseClient';

export default function MyRewardsPage() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      
      // 내 포인트 가져오기
      const { data: profile } = await supabase.from('profiles').select('points').eq('id', session.user.id).single();
      if (profile) setPoints(profile.points);

      // 리워드 히스토리 가져오기
      const { data: records } = await supabase.from('reward_history').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      if (records) setHistory(records);
      
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="p-4 bg-primary-600 text-white flex items-center border-b border-primary-500">
        <Link href="/" className="text-primary-100 hover:text-white mr-4">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-lg font-bold">내 리워드 (DB 연동)</h2>
      </div>

      <div className="bg-primary-600 text-white px-6 pb-12 pt-6 rounded-b-3xl shadow-md">
         <p className="text-primary-100 text-sm mb-1">사용 가능한 포인트</p>
         <div className="flex items-baseline space-x-2">
             <h1 className="text-5xl font-bold">{loading ? '...' : points.toLocaleString()}</h1>
             <span className="text-xl font-medium">P</span>
         </div>
      </div>

      <div className="p-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-4 px-2">최근 적립 내역</h3>
           <div className="space-y-4">
              {loading ? (
                <p className="text-center text-sm text-gray-500 py-4">불러오는 중...</p>
              ) : history.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">아직 적립 내역이 없습니다.</p>
              ) : (
                history.map(record => (
                  <div key={record.id} className="flex justify-between items-center px-2 py-1 border-b border-gray-50 last:border-0 pb-2 mb-2">
                     <div>
                        <p className="font-semibold text-gray-800 text-sm">{record.title}</p>
                        <p className="text-xs text-gray-400">{new Date(record.created_at).toLocaleString()}</p>
                     </div>
                     <span className="font-bold text-primary-600">+{record.points} P</span>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
