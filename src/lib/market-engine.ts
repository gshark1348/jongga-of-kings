import type { Company, CompanyEvent, MarketFactor, NewsIssue, Sector, Team } from "./types";

export const BANK_NAME = "종가중앙은행";
export const DEFAULT_BASE_RATE = 3;
export const BANK_SPREAD = 1.5;
export const MAX_LOAN_RATIO = 0.5;

const rateSensitivity: Record<Sector, number> = {
  "AI·반도체": -1.1, "플랫폼·콘텐츠": -1.35, "자동차·배터리": -0.8,
  "바이오·헬스케어": -1.2, "금융": 1.25, "에너지·전력": -0.35,
  "조선·산업재": -0.55, "소비·유통": -0.75,
};

export function getLoanRate(baseRate: number) { return Number((baseRate + BANK_SPREAD).toFixed(2)); }
export function getTurnInterest(balance: number, annualRate: number) { return Math.round(balance * annualRate / 100 / 4); }
export function getNetAssets(team: Team) { return team.assets - team.loanBalance - team.accruedInterest; }
export function getBorrowingLimit(initialBudget: number, loanBalance: number) { return Math.max(0, initialBudget * MAX_LOAN_RATIO - loanBalance); }
export function getRateSectorImpact(sector: Sector, rateChange: number) {
  return Number((rateSensitivity[sector] * rateChange * 3.2).toFixed(2));
}

export interface ReturnBreakdown { factor: MarketFactor | "시장공통" | "기업고유" | "기업단독" | "동종업계"; contribution: number }
export function calculateCompanyReturn(company: Company, issue: NewsIssue, turn: number, rateChange = 0, companyEvents: CompanyEvent[] = [], previousIssues: NewsIssue[] = []) {
  const breakdown: ReturnBreakdown[] = [];
  for (const [factor, shock] of Object.entries(issue.factors) as [MarketFactor, number][]) {
    const sensitivity = company.sensitivities[factor] ?? .08;
    const contribution = shock * sensitivity * 2.15;
    if (Math.abs(contribution) >= .04) breakdown.push({ factor, contribution });
  }
  const rateContribution = (company.sensitivities.금리 ?? -.2) * rateChange * 3.2;
  if (rateChange) breakdown.push({ factor:"금리", contribution:rateContribution });
  for (const event of companyEvents) {
    if (event.companyId === company.id) breakdown.push({factor:"기업단독",contribution:event.directImpact});
    else if (event.sector === company.sector) breakdown.push({factor:"동종업계",contribution:event.directImpact * -.12});
    else breakdown.push({factor:"시장공통",contribution:event.directImpact * .012});
  }
  previousIssues.slice(-2).forEach((pastIssue, index, history) => {
    const decay = index === history.length - 1 ? .28 : .12;
    for (const [factor, shock] of Object.entries(pastIssue.factors) as [MarketFactor, number][]) {
      const sensitivity = company.sensitivities[factor] ?? .05;
      const contribution = shock * sensitivity * 2.15 * decay;
      if (Math.abs(contribution) >= .04) breakdown.push({ factor, contribution });
    }
  });
  const marketDrift = issue.factors.시장공포 ? -Math.abs(issue.factors.시장공포) * .42 : .18;
  breakdown.push({ factor:"시장공통", contribution:marketDrift });
  const hash = [...`${company.id}-${issue.id}-${turn}`].reduce((sum,char)=>sum+char.charCodeAt(0),0);
  const idiosyncratic = ((hash % 17) - 8) / 10;
  breakdown.push({ factor:"기업고유", contribution:idiosyncratic });
  const raw = breakdown.reduce((sum,item)=>sum+item.contribution,0);
  const volatilityLimit = company.volatility === "높음" ? 14 : company.volatility === "보통" ? 9 : 6;
  const total = Math.max(-volatilityLimit, Math.min(volatilityLimit, raw));
  return { total:Number((Math.abs(total)<.1?(total<0?-.1:.1):total).toFixed(2)), breakdown:breakdown.sort((a,b)=>Math.abs(b.contribution)-Math.abs(a.contribution)) };
}
