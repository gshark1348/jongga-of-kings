import { realCompanies as companies } from "./company-data";
import type { Company, CompanyEvent, Sector } from "./types";

const templates: Record<Sector, { positive: ((company: Company) => string)[]; negative: ((company: Company) => string)[] }> = {
  "AI·반도체": { positive:[c=>`${c.name}, 차세대 AI 반도체 공급계약 확대…생산라인 조기 가동`,c=>`${c.name}, 고부가 제품 수율 개선…하반기 출하 전망 상향`], negative:[c=>`${c.name}, 핵심 장비 반입 지연…신규 생산 일정 재검토`,c=>`${c.name}, 주요 고객사 재고조정 통보…단기 출하량 감소 전망`]},
  "플랫폼·콘텐츠": { positive:[c=>`${c.name}, 신규 서비스 이용자 예상 웃돌아…해외 매출 비중 확대`,c=>`${c.name}, 대표 콘텐츠 글로벌 흥행…추가 지역 출시 확정`], negative:[c=>`${c.name}, 수수료 정책 놓고 당국 점검…사업모델 조정 가능성`,c=>`${c.name}, 기대작 출시 일정 연기…마케팅 비용 부담 커져`]},
  "자동차·배터리": { positive:[c=>`${c.name}, 북미 대형 고객사와 장기 공급계약…수주잔고 증가`,c=>`${c.name}, 신제품 사전계약 호조…생산 목표 상향 검토`], negative:[c=>`${c.name}, 원재료 가격 급등분 반영 지연…수익성 압박`,c=>`${c.name}, 일부 생산라인 품질 점검…출고 일정 차질 우려`]},
  "바이오·헬스케어": { positive:[c=>`${c.name}, 핵심 파이프라인 임상 지표 개선…기술수출 기대감`,c=>`${c.name}, 해외 품목허가 심사 통과…상업화 일정 앞당겨`], negative:[c=>`${c.name}, 임상 환자 모집 지연…중간결과 발표 일정 늦춰`,c=>`${c.name}, 생산시설 정기점검 연장…단기 공급 차질 예상`]},
  "금융": { positive:[c=>`${c.name}, 비이자이익 증가에 분기 실적 전망 상향`,c=>`${c.name}, 주주환원 규모 확대 검토…자사주 정책 주목`], negative:[c=>`${c.name}, 대손충당금 추가 적립…분기 이익 눈높이 낮아져`,c=>`${c.name}, 금융당국 건전성 점검 강화…성장 전략 속도조절`]},
  "에너지·전력": { positive:[c=>`${c.name}, 대규모 발전 프로젝트 우선협상대상자 선정`,c=>`${c.name}, 전력 수요 증가에 가동률 상승…실적 개선 기대`], negative:[c=>`${c.name}, 프로젝트 인허가 일정 지연…수주 인식 늦어질 듯`,c=>`${c.name}, 연료비 부담 확대에도 요금 반영 제한…마진 압박`]},
  "조선·산업재": { positive:[c=>`${c.name}, 고부가 선박·플랜트 대형 수주…수주잔고 확대`,c=>`${c.name}, 납기 단축과 환율 효과로 수익성 개선 전망`], negative:[c=>`${c.name}, 후판 가격 협상 난항…건조 원가 상승 우려`,c=>`${c.name}, 해외 현장 공정 지연…준공 비용 추가 반영 가능성`]},
  "소비·유통": { positive:[c=>`${c.name}, 성수기 판매 호조…주력 제품 재고 빠르게 소진`,c=>`${c.name}, 해외 관광·유통 수요 회복에 예약률 상승`], negative:[c=>`${c.name}, 소비 둔화에 할인행사 확대…수익성 부담`,c=>`${c.name}, 물류비와 원가 동반 상승…가격 전략 재검토`]},
};

function seededIndex(seed: string, length: number) { return [...seed].reduce((sum,char)=>((sum*31)+char.charCodeAt(0))>>>0,2166136261) % length; }

const shared = {
  positive: [
    (c:Company)=>`${c.name}, 분기 영업이익 시장 전망 상회…핵심 사업 수익성 개선`,
    (c:Company)=>`${c.name}, 해외 전략 고객 신규 확보…중장기 매출 기반 확대`,
    (c:Company)=>`${c.name}, 경쟁사 공급 차질에 긴급 주문 유입…반사이익 기대`,
    (c:Company)=>`${c.name}, 자사주 매입·주주환원 확대 발표…시장 신뢰 회복`,
  ],
  negative: [
    (c:Company)=>`${c.name}, 분기 실적 시장 기대 하회…재고와 비용 부담 부각`,
    (c:Company)=>`${c.name}, 주요 계약 재협상 돌입…매출 인식 일정 불확실`,
    (c:Company)=>`${c.name}, 경영진 교체와 지배구조 개편 예고…전략 공백 우려`,
    (c:Company)=>`${c.name}, 경쟁사 신제품 점유율 확대…가격 경쟁 심화 전망`,
  ],
};

type ChainStep = {
  headline: (company: Company) => string;
  sentiment: "positive" | "negative";
  impactMultiplier: number;
};

const chainTemplates: Record<Sector, { label: string; steps: ChainStep[] }> = {
  "AI·반도체": { label:"신규 생산라인 가동", steps:[
    {headline:c=>`${c.name}, AI 반도체 신규 생산라인 증설 발표…내년 양산 목표`,sentiment:"positive",impactMultiplier:.72},
    {headline:c=>`${c.name}, 핵심 장비 반입 지연…신규 라인 시험가동 일정 늦춰`,sentiment:"negative",impactMultiplier:.82},
    {headline:c=>`${c.name}, 지연된 장비 설치 완료…신규 라인 시험생산 돌입`,sentiment:"positive",impactMultiplier:.68},
    {headline:c=>`${c.name}, 신규 공정 수율 안정권 진입…고객사 품질 인증 착수`,sentiment:"positive",impactMultiplier:.88},
    {headline:c=>`${c.name}, 글로벌 고객사 품질 인증 통과…대규모 공급계약 체결`,sentiment:"positive",impactMultiplier:1.28},
  ]},
  "플랫폼·콘텐츠": { label:"글로벌 서비스 출시", steps:[
    {headline:c=>`${c.name}, 차세대 플랫폼 글로벌 출시 계획 공개…사전예약 개시`,sentiment:"positive",impactMultiplier:.7},
    {headline:c=>`${c.name}, 현지 심의·번역 일정 지연…글로벌 출시 지역 일부 축소`,sentiment:"negative",impactMultiplier:.78},
    {headline:c=>`${c.name}, 현지 파트너십 보강…주요 지역 서비스 순차 개시`,sentiment:"positive",impactMultiplier:.68},
    {headline:c=>`${c.name}, 초기 이용자 유지율 예상 상회…서버 증설 결정`,sentiment:"positive",impactMultiplier:.9},
    {headline:c=>`${c.name}, 글로벌 유료 이용자 목표 조기 달성…추가 지역 진출 확정`,sentiment:"positive",impactMultiplier:1.22},
  ]},
  "자동차·배터리": { label:"차세대 제품 양산", steps:[
    {headline:c=>`${c.name}, 차세대 전동화 제품 공개…신규 전용라인 투자 확정`,sentiment:"positive",impactMultiplier:.7},
    {headline:c=>`${c.name}, 핵심 소재 조달 차질…시제품 생산 일정 재조정`,sentiment:"negative",impactMultiplier:.82},
    {headline:c=>`${c.name}, 대체 공급망 확보…차세대 제품 시범생산 재개`,sentiment:"positive",impactMultiplier:.7},
    {headline:c=>`${c.name}, 안전성 시험 통과…완성차 고객사 양산 승인 절차 돌입`,sentiment:"positive",impactMultiplier:.88},
    {headline:c=>`${c.name}, 북미 고객사 양산 승인 획득…장기 공급물량 확정`,sentiment:"positive",impactMultiplier:1.26},
  ]},
  "바이오·헬스케어": { label:"신약 임상·허가", steps:[
    {headline:c=>`${c.name}, 핵심 신약 후보물질 후기 임상 진입…첫 환자 투약`,sentiment:"positive",impactMultiplier:.78},
    {headline:c=>`${c.name}, 임상 환자 모집 속도 둔화…중간결과 발표 연기`,sentiment:"negative",impactMultiplier:.86},
    {headline:c=>`${c.name}, 임상 모집 목표 달성…안전성 검토위원회 통과`,sentiment:"positive",impactMultiplier:.78},
    {headline:c=>`${c.name}, 주요 평가지표 개선 확인…해외 허가 사전상담 개시`,sentiment:"positive",impactMultiplier:1.0},
    {headline:c=>`${c.name}, 신약 허가신청 접수…글로벌 제약사와 판권 계약`,sentiment:"positive",impactMultiplier:1.32},
  ]},
  "금융": { label:"디지털 금융 신사업", steps:[
    {headline:c=>`${c.name}, 기업금융 디지털 플랫폼 출범…중소기업 고객 확대 추진`,sentiment:"positive",impactMultiplier:.62},
    {headline:c=>`${c.name}, 당국 내부통제 보완 요구…신규 서비스 확대 잠정 중단`,sentiment:"negative",impactMultiplier:.72},
    {headline:c=>`${c.name}, 내부통제 개선안 제출…제한적 서비스 재개`,sentiment:"positive",impactMultiplier:.58},
    {headline:c=>`${c.name}, 디지털 플랫폼 연체율 안정…취급액 목표 상향`,sentiment:"positive",impactMultiplier:.76},
    {headline:c=>`${c.name}, 플랫폼 흑자전환 달성…주주환원 재원 확대 검토`,sentiment:"positive",impactMultiplier:1.08},
  ]},
  "에너지·전력": { label:"대형 발전 프로젝트", steps:[
    {headline:c=>`${c.name}, 대형 친환경 발전사업 우선협상대상자 선정`,sentiment:"positive",impactMultiplier:.72},
    {headline:c=>`${c.name}, 주민 협의·환경 인허가 지연…착공 시점 불확실`,sentiment:"negative",impactMultiplier:.8},
    {headline:c=>`${c.name}, 환경 보완안 조건부 승인…사업 일정 정상화`,sentiment:"positive",impactMultiplier:.68},
    {headline:c=>`${c.name}, 프로젝트 금융조달 완료…핵심 기자재 발주 착수`,sentiment:"positive",impactMultiplier:.88},
    {headline:c=>`${c.name}, 발전사업 본계약 체결…장기 전력판매계약 확보`,sentiment:"positive",impactMultiplier:1.24},
  ]},
  "조선·산업재": { label:"고부가 선박 수주", steps:[
    {headline:c=>`${c.name}, 글로벌 선주와 친환경 선박 건조의향서 체결`,sentiment:"positive",impactMultiplier:.68},
    {headline:c=>`${c.name}, 후판 가격 협상 난항…선박 계약조건 재논의`,sentiment:"negative",impactMultiplier:.78},
    {headline:c=>`${c.name}, 원가연동 조건 합의…기본설계 승인 획득`,sentiment:"positive",impactMultiplier:.66},
    {headline:c=>`${c.name}, 시운전 성능 목표 충족…옵션 물량 협상 착수`,sentiment:"positive",impactMultiplier:.86},
    {headline:c=>`${c.name}, 친환경 선박 본계약·추가 옵션 확정…수주잔고 확대`,sentiment:"positive",impactMultiplier:1.22},
  ]},
  "소비·유통": { label:"신제품·해외 확장", steps:[
    {headline:c=>`${c.name}, 프리미엄 신제품 공개…아시아 주요국 동시 출시 예고`,sentiment:"positive",impactMultiplier:.64},
    {headline:c=>`${c.name}, 초도 물량 포장 결함 발견…일부 제품 출하 보류`,sentiment:"negative",impactMultiplier:.76},
    {headline:c=>`${c.name}, 품질 개선·재출하 완료…유통망 판촉 재개`,sentiment:"positive",impactMultiplier:.62},
    {headline:c=>`${c.name}, 재출시 제품 판매 회복…현지 재주문 물량 증가`,sentiment:"positive",impactMultiplier:.8},
    {headline:c=>`${c.name}, 해외 판매 목표 조기 달성…현지 생산·유통 계약 체결`,sentiment:"positive",impactMultiplier:1.14},
  ]},
};

export const companyEventChains: CompanyEvent[] = companies.flatMap((company) => {
  const chain = chainTemplates[company.sector];
  const magnitude=company.volatility==="높음"?4.8:company.volatility==="보통"?3.6:2.6;
  const chainLength=2+seededIndex(`${company.id}-chain-length`,2);
  const selectedSteps=chainLength===2
    ? [chain.steps[0],chain.steps.at(-1)!]
    : [chain.steps[0],chain.steps[1],chain.steps.at(-1)!];
  return selectedSteps.map((step,index)=>({
    id:`${company.id}-chain-${index+1}`,companyId:company.id,companyName:company.name,sector:company.sector,
    headline:step.headline(company),sentiment:step.sentiment,
    directImpact:Number(((step.sentiment==="positive"?1:-1)*magnitude*step.impactMultiplier).toFixed(2)),
    chainId:`${company.id}-main`,chainLabel:chain.label,chainStage:index+1,chainLength,
  }));
});

export const companyEventCatalog: CompanyEvent[] = companies.flatMap((company) => (["positive","negative"] as const).flatMap((sentiment) => [...templates[company.sector][sentiment],...shared[sentiment]].map((makeHeadline,index) => {
  const magnitude=company.volatility==="높음"?4.8:company.volatility==="보통"?3.6:2.6;
  return {id:`${company.id}-${sentiment}-${index}`,companyId:company.id,companyName:company.name,sector:company.sector,headline:makeHeadline(company),sentiment,directImpact:sentiment==="positive"?magnitude:-magnitude};
})));

export function getCompanyEvents(turn: number, count = 2, history: CompanyEvent[] | string[] = []): CompanyEvent[] {
  const pastEvents = history.filter((item): item is CompanyEvent => typeof item !== "string");
  const usedIds = history.map((item)=>typeof item === "string" ? item : item.id);
  const picked: CompanyEvent[] = [];
  const latestByCompany = new Map<string,CompanyEvent>();
  for (const event of pastEvents) latestByCompany.set(event.companyId,event);
  const continuations = [...latestByCompany.values()]
    .filter((event)=>event.chainId&&event.chainStage&&event.chainLength&&event.chainStage<event.chainLength)
    .map((event)=>companyEventChains.find((candidate)=>candidate.chainId===event.chainId&&candidate.chainStage===event.chainStage!+1))
    .filter((event):event is CompanyEvent=>Boolean(event))
    .sort((a,b)=>seededIndex(`${turn}-${a.companyId}`,997)-seededIndex(`${turn}-${b.companyId}`,997));
  for (const event of continuations.slice(0,count)) picked.push(event);
  for (let slot=0; slot<count; slot+=1) {
    if (picked.length>=count) break;
    const starters=companyEventChains.filter((event)=>event.chainStage===1&&!usedIds.includes(event.id)&&!picked.some((item)=>item.companyId===event.companyId));
    const available=starters.length?starters:companyEventCatalog.filter((event)=>!usedIds.includes(event.id)&&!picked.some((item)=>item.companyId===event.companyId));
    const fallback=companyEventCatalog.filter((event)=>!picked.some((item)=>item.companyId===event.companyId));
    const candidates=available.length?available:fallback;
    picked.push(candidates[seededIndex(`company-event-${turn}-${slot}-${usedIds.join("|")}`,candidates.length)]);
  }
  return picked;
}
