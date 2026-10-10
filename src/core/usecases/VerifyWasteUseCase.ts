import { RewardResult } from '../domain/entities/RewardResult';
import { aiVerificationService } from '../../infrastructure/services/AIVerificationService';
import { rewardRepository } from '../../infrastructure/repositories/RewardRepository';

export class VerifyWasteUseCase {
  async execute(imageData: string): Promise<RewardResult> {
    // 1. AI 인프라를 통해 이미지 검증
    const isVerified = await aiVerificationService.verify(imageData);
    
    if (!isVerified) {
      return { success: false, points: 0, message: '분리배출 상태를 확인할 수 없습니다.' };
    }

    // 2. 검증 성공 시 리워드 지급
    const points = await rewardRepository.issueReward('user_id_123', 100);
    
    return {
      success: true,
      points,
      message: '인증 완료 및 리워드 지급 성공'
    };
  }
}

export const verifyWasteUseCase = new VerifyWasteUseCase();
