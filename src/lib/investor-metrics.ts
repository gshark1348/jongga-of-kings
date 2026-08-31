import { companies } from "./mock-data";
import type { InvestorMetrics, PortfolioPosition } from "./types";

const volatilityScore = { 낮음: 25, 보통: 55, 높음: 85 } as const;

export function calculateInvestorMetrics(portfolio: PortfolioPosition[], previous: PortfolioPosition[], turnover: number, turnReturn: number, totalReturn: number): InvestorMetrics {
  const active = portfolio.filter((position) => position.weight > 0);
  const concentration = Math.max(0, ...active.map((position) => position.weight));
  const sectorCount = new Set(active.map((position) => companies.find((company) => company.id === position.companyId)?.sector).filter(Boolean)).size;
  const weighted = (selector: (id: string) => number) => active.reduce((sum, position) => sum + selector(position.companyId) * position.weight / 100, 0);
  const volatility = weighted((id) => volatilityScore[companies.find((company) => company.id === id)?.volatility ?? "보통"]);
  const largeCapShare = weighted((id) => companies.find((company) => company.id === id)?.cap === "대형" ? 100 : 0);
  const smallCapShare = weighted((id) => companies.find((company) => company.id === id)?.cap === "소형" ? 100 : 0);
  const changed = previous.length ? turnover : 0;
  return {
    concentration, sectorCount: Math.max(1, sectorCount), volatility: Math.min(100, volatility), turnover: Math.min(100, changed),
    newsReaction: Math.min(100, changed * 1.25), contrarian: Math.min(100, 35 + Math.max(0, -totalReturn) * 2),
    holdDuration: Math.max(0, 100 - changed), dipBuying: Math.min(100, 30 + Math.max(0, -turnReturn) * 6 + changed * .25),
    profitTaking: Math.min(100, 30 + Math.max(0, totalReturn) * 3 + changed * .2), largeCapShare, smallCapShare,
    timingScore: Math.max(0, Math.min(100, 50 + turnReturn * 5 + totalReturn * 1.5)),
  };
}
