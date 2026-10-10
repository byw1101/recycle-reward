export class RewardRepository {
  async issueReward(userId: string, points: number): Promise<number> {
    // 실제 구현에서는 DB 또는 서버 API를 호출하여 포인트를 적립합니다.
    return new Promise((resolve) => {
      setTimeout(() => resolve(points), 500);
    });
  }
}

export const rewardRepository = new RewardRepository();
