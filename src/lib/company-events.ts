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

export function getCompanyEvents(turn: number, count = 2): CompanyEvent[] {
  const picked: CompanyEvent[] = [];
  for (let slot=0; slot<count; slot+=1) {
    const available=companies.filter(company=>!picked.some(event=>event.companyId===company.id));
    const company=available[seededIndex(`company-${turn}-${slot}`,available.length)];
    const sentiment: CompanyEvent["sentiment"] = seededIndex(`sentiment-${turn}-${slot}`,2)===0?"positive":"negative";
    const choices=templates[company.sector][sentiment];
    const headline=choices[seededIndex(`headline-${turn}-${company.id}`,choices.length)](company);
    const magnitude=company.volatility==="높음"?4.8:company.volatility==="보통"?3.6:2.6;
    picked.push({id:`${turn}-${slot}-${company.id}`,companyId:company.id,companyName:company.name,sector:company.sector,headline,sentiment,directImpact:sentiment==="positive"?magnitude:-magnitude});
  }
  return picked;
}
