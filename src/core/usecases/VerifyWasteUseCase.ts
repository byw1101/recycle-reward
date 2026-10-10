import { RewardResult } from '../domain/entities/RewardResult';
import { aiVerificationService } from '../../infrastructure/services/AIVerificationService';
import { supabase } from '../utils/supabaseClient';

export class VerifyWasteUseCase {
  async execute(imageData: string): Promise<RewardResult> {
    // 1. 이미지 검증
    const isVerified = await aiVerificationService.verify(imageData);
    if (!isVerified) {
      return { success: false, points: 0, message: '분리배출 상태를 확인할 수 없습니다.' };
    }

    // 2. 현재 로그인된 사용자 확인
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, points: 0, message: '로그인이 필요합니다.' };
    }

    const userId = session.user.id;
    const earnedPoints = 100;

    // 3. 현재 포인트 조회 후 업데이트 (실제 서비스에선 RPC 함수 등을 쓰는 것이 안전)
    const { data: profile } = await supabase.from('profiles').select('points').eq('id', userId).single();
    const currentPoints = profile?.points || 0;
    const newPoints = currentPoints + earnedPoints;
    
    await supabase.from('profiles').update({ points: newPoints }).eq('id', userId);

    // 4. 리워드 지급 히스토리 기록
    await supabase.from('reward_history').insert([
      { user_id: userId, title: '종량제 봉투 배출 인증 완료', points: earnedPoints }
    ]);
    
    return {
      success: true,
      points: earnedPoints,
      message: '인증 완료 및 리워드 지급 성공'
    };
  }
}

export const verifyWasteUseCase = new VerifyWasteUseCase();
