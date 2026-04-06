export const ddayCounter = (target: string) => {
  const now = new Date();
  const targetDate = new Date(target);

  const diffTime = targetDate.getTime() - now.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dDayLabel =
    remainingDays === 0
      ? "D-Day"
      : remainingDays > 0
        ? `D-${remainingDays}`
        : `D+${Math.abs(remainingDays)}`;

  return dDayLabel;
};
