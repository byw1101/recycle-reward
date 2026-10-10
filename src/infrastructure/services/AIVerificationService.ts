export class AIVerificationService {
  async verify(imageData: string): Promise<boolean> {
    // 실제 구현에서는 서버의 AI 모델 API를 호출합니다.
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500); // 1.5초 시뮬레이션
    });
  }
}

export const aiVerificationService = new AIVerificationService();
