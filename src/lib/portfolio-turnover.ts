import type { PortfolioPosition } from "./types";

export function calculatePortfolioTurnover(previous: PortfolioPosition[], current: PortfolioPosition[]) {
  const companyIds = new Set([...previous.map((item) => item.companyId), ...current.map((item) => item.companyId)]);
  const totalDifference = [...companyIds].reduce((sum, companyId) => {
    const previousWeight = previous.find((item) => item.companyId === companyId)?.weight ?? 0;
    const currentWeight = current.find((item) => item.companyId === companyId)?.weight ?? 0;
    return sum + Math.abs(currentWeight - previousWeight);
  }, 0);
  return totalDifference / 2;
}
