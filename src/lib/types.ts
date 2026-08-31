export type Market = "코스피" | "코스닥";
export type Sector =
  | "AI·반도체"
  | "플랫폼·콘텐츠"
  | "자동차·배터리"
  | "바이오·헬스케어"
  | "금융"
  | "에너지·전력"
  | "조선·산업재"
  | "소비·유통";
export type MarketFactor = "AI수요" | "반도체공급" | "금리" | "원달러환율" | "유가" | "원자재" | "소비심리" | "정부정책" | "규제" | "임상성과" | "수출경기" | "전력수요" | "운임" | "외국인수급" | "시장공포";

export interface Company {
  id: string;
  code: string;
  name: string;
  market: Market;
  sector: Sector;
  description: string;
  price: number;
  change: number;
  cap: "대형" | "중형" | "소형";
  volatility: "낮음" | "보통" | "높음";
  traits: string[];
  history: number[];
  imageUrl: string;
  imageCredit: string;
  founded: string;
  employees: string;
  gameRevenue: number;
  gameOperatingMargin: number;
  officialWebsite: string;
  influenceAreas: string[];
  sensitivities: Partial<Record<MarketFactor, number>>;
}

export interface Team {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  assets: number;
  totalReturn: number;
  turnReturn: number;
  submitted: boolean;
  focus: Sector;
  turnoverRate: number;
  loanBalance: number;
  accruedInterest: number;
  portfolio?: PortfolioPosition[];
  previousPortfolio?: PortfolioPosition[];
}

export interface RateEvent {
  id: string;
  headline: string;
  direction: "인상" | "인하";
  change: number;
  reason: string;
}

export interface NewsIssue {
  id: string;
  headline: string;
  briefs: [string, string];
  internalName: string;
  impact: string;
  imageUrl: string;
  imageCredit: string;
  factors: Partial<Record<MarketFactor, number>>;
}

export interface CompanyEvent {
  id: string;
  companyId: string;
  companyName: string;
  sector: Sector;
  headline: string;
  sentiment: "positive" | "negative";
  directImpact: number;
}

export interface SurpriseEvent {
  id: string;
  category: "강한 호재" | "강한 악재" | "시장 충격" | "심리 변화";
  headline: string;
  impact: string;
}

export interface PortfolioPosition {
  companyId: string;
  weight: number;
}

export interface InvestorMetrics {
  concentration: number;
  sectorCount: number;
  volatility: number;
  turnover: number;
  newsReaction: number;
  contrarian: number;
  holdDuration: number;
  dipBuying: number;
  profitTaking: number;
  largeCapShare: number;
  smallCapShare: number;
  timingScore: number;
}

export interface InvestorProfile {
  id: string;
  number: number;
  catchphrase: string;
  name: string;
  description: string;
  strength: string;
  caution: string;
  stamp: string;
}

export interface FinalResult {
  id: string;
  teamName: string;
  rank: number;
  assets: number;
  totalReturn: number;
  turnReturn: number;
  metrics: InvestorMetrics;
}
