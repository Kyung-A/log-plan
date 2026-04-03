export const ddayCounter = (target: string) => {
  const now = new Date();
  const targetDate = new Date(target);

  // 1. 날짜 차이 계산 (밀리초 -> 일 단위)
  const diffTime = targetDate.getTime() - now.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // D-Day 라벨 처리
  const dDayLabel =
    remainingDays === 0
      ? "D-Day"
      : remainingDays > 0
        ? `D-${remainingDays}`
        : `D+${Math.abs(remainingDays)}`;

  return dDayLabel;
};
