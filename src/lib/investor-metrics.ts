import { companies } from "./mock-data";
import type { InvestorMetrics, PortfolioPosition } from "./types";

const volatilityScore = { 낮음: 25, 보통: 55, 높음: 85 } as const;

export function calculateInvestorMetrics(portfolio: PortfolioPosition[], previous: PortfolioPosition[], turnover: number, turnReturn: number, totalReturn: number, loanBalance = 0, initialBudget = 100_000_000): InvestorMetrics {
  const active = portfolio.filter((position) => position.weight > 0);
  const concentration = Math.max(0, ...active.map((position) => position.weight));
  const sectorCount = new Set(active.map((position) => companies.find((company) => company.id === position.companyId)?.sector).filter(Boolean)).size;
  const weighted = (selector: (id: string) => number) => active.reduce((sum, position) => sum + selector(position.companyId) * position.weight / 100, 0);
  const volatility = weighted((id) => volatilityScore[companies.find((company) => company.id === id)?.volatility ?? "보통"]);
  const largeCapShare = weighted((id) => companies.find((company) => company.id === id)?.cap === "대형" ? 100 : 0);
  const smallCapShare = weighted((id) => companies.find((company) => company.id === id)?.cap === "소형" ? 100 : 0);
  const changed = previous.length ? Math.min(100, Math.max(0, turnover)) : 0;
  const positiveTurn = Math.max(0, turnReturn);
  const negativeTurn = Math.max(0, -turnReturn);
  const positiveTotal = Math.max(0, totalReturn);
  const negativeTotal = Math.max(0, -totalReturn);
  const leverage = Math.min(100, Math.max(0, loanBalance / Math.max(1, initialBudget) * 200));
  return {
    concentration, sectorCount: Math.max(1, sectorCount), volatility: Math.min(100, volatility), turnover: changed,
    newsReaction: Math.min(100, changed * 1.35),
    contrarian: Math.min(100, 20 + negativeTotal * 1.5 + negativeTurn * 2 + Math.max(0, 35 - changed) * .35),
    holdDuration: Math.max(0, 100 - changed),
    dipBuying: Math.min(100, 15 + negativeTurn * 7 + changed * .45),
    profitTaking: Math.min(100, 15 + positiveTurn * 5 + positiveTotal * 1.5 + changed * .35),
    largeCapShare, smallCapShare,
    timingScore: Math.max(0, Math.min(100, 45 + turnReturn * 5 + totalReturn * 1.2 - negativeTotal)),
    leverage,
    performance: Math.max(0, Math.min(100, 50 + totalReturn * 2)),
  };
}
