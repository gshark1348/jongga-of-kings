import type { MarketFactor, NewsIssue, Sector } from "./types";

export type HiddenMarketState = "growth" | "inflation" | "liquidity" | "risk" | "credit" | "supply" | "techHeat" | "consumption";
export interface MarketEvent extends NewsIssue {
  sector: Sector | "거시";
  phase: "확산" | "과열" | "병목" | "충격" | "조정" | "회복" | "독립";
  successors: string[];
  baseWeight: number;
  stateChanges: Partial<Record<HiddenMarketState, number>>;
  stateAffinity: Partial<Record<HiddenMarketState, number>>;
}

const media: Record<Sector | "거시", [string, string]> = {
  "AI·반도체":["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=85","Unsplash · Laura Ockel"],
  "플랫폼·콘텐츠":["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=85","Unsplash · Lorenzo Herrera"],
  "자동차·배터리":["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1400&q=85","Unsplash · Hyundai Motor Group"],
  "바이오·헬스케어":["https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1400&q=85","Unsplash · National Cancer Institute"],
  금융:["https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=85","Unsplash · Maxim Hopman"],
  "에너지·전력":["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=85","Unsplash · American Public Power Association"],
  "조선·산업재":["https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1400&q=85","Unsplash · Vidar Nordli-Mathisen"],
  "소비·유통":["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85","Unsplash · Clark Street Mercantile"],
  거시:["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85","Unsplash · Alex Shutin"],
};

const illustrationBase = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/news-illustrations`;
const eventIllustrations: Partial<Record<string,string>> = {
  "AI-01":"ai-01-enterprise-assistant.png",
  "AI-02":"ai-02-startup-boom.png",
  "AI-04":"ai-04-hbm-shortage.png",
  "AI-05":"ai-05-bubble-warning.png",
  "PL-02":"pl-02-content-export.png",
  "PL-03":"pl-03-production-cost.png",
  "PL-04":"pl-04-platform-fee-disclosure.png",
  "PL-05":"pl-05-data-leak.png",
  "AU-01":"au-01-ev-subsidy.png",
  "AU-03":"au-03-mineral-price-shock.png",
  "AU-04":"au-04-delivery-delay.png",
  "AU-05":"au-05-battery-safety.png",
  "BIO-01":"bio-01-clinical-positive.png",
  "BIO-02":"bio-02-licensing-talks.png",
  "BIO-03":"bio-03-recruitment-delay.png",
  "BIO-04":"bio-04-clinical-failure.png",
  "FN-02":"fn-02-margin-debt.png",
  "FN-03":"fn-03-margin-regulation.png",
  "FN-04":"fn-04-margin-call.png",
  "FN-05":"fn-05-loan-delinquency.png",
  "EN-02":"en-02-data-center-power.png",
  "EN-03":"en-03-power-reserve.png",
  "EN-04":"en-04-industrial-tariff.png",
  "EN-05":"en-05-energy-safety.png",
  "IND-01":"ind-01-ship-orders.png",
  "IND-03":"ind-03-shipyard-cost.png",
  "IND-04":"ind-04-overseas-loss.png",
  "IND-05":"ind-05-construction-liquidity.png",
  "CON-02":"con-02-tourism-boom.png",
  "CON-03":"con-03-travel-logistics-cost.png",
  "CON-04":"con-04-food-inflation.png",
  "CON-05":"con-05-demand-cooling.png",
  "MAC-01":"mac-01-rate-cut.png",
  "MAC-02":"mac-02-inflation-shock.png",
  "MAC-03":"mac-03-exchange-rate-surge.png",
  "MAC-05":"mac-05-global-selloff.png",
  "MAC-07":"mac-07-port-gridlock.png",
  "MAC-08":"mac-08-cyberattack.png",
  "MAC-09":"mac-09-stimulus.png",
  "MAC-10":"mac-10-earnings-downgrade.png",
};

function eventMedia(id:string, fallback:[string,string]):[string,string] {
  const filename=eventIllustrations[id];
  return filename?[`${illustrationBase}/${filename}`,"종가의 제왕 · AI 생성 삽화"]:fallback;
}

type EventSeed = [string,string,string,string,MarketEvent["phase"],Partial<Record<MarketFactor,number>>,Partial<Record<HiddenMarketState,number>>];
type Chain = {sector:Sector;prefix:string;seeds:EventSeed[]};

const chains: Chain[] = [
  {sector:"AI·반도체",prefix:"AI",seeds:[
    ["기업들, 업무용 AI 비서 도입 경쟁…생산성 혁신 기대","클라우드 사용량이 빠르게 늘고 있다","전문인력 확보 경쟁도 가열","AI 서비스 확산","확산",{AI수요:1.15,전력수요:.35,소비심리:.2},{growth:8,techHeat:8}],
    ["AI 스타트업 창업 열풍…모험자본 다시 기술주로","적자 기업에도 투자 제안 잇따라","대형 플랫폼은 인수 후보 물색","AI 창업 과열","과열",{AI수요:1.35,외국인수급:.35,시장공포:-.25},{liquidity:7,techHeat:15,risk:8}],
    ["데이터센터 증설 경쟁, 전력·건설 발주까지 밀어 올렸다","전력망 접속 대기 기업이 급증","냉각장치 공급업체 납기 길어져","데이터센터 투자 확대","병목",{AI수요:.8,전력수요:1.35,원자재:.25},{growth:7,supply:10,techHeat:6}],
    ["첨단 반도체 주문 사상 최대…HBM 납기 두 배로 늘어","전자업계 선구매 경쟁 본격화","장비업체 수주잔고도 최고치","첨단 반도체 품귀","병목",{AI수요:1.2,반도체공급:-1.55,전력수요:.4},{supply:18,techHeat:10,inflation:4}],
    ["증권가, AI 투자 고평가 경고…실적 없는 기업부터 흔들","외국인 기술주 매수세 둔화","배당주와 금융주로 순환매 조짐","AI 버블 경고","조정",{AI수요:-.85,외국인수급:-.8,시장공포:1.1,금리:.25},{techHeat:-10,risk:-14,credit:5}],
    ["우량 AI 기업으로 자금 재편…반도체 공급도 정상화 조짐","대형 기술주는 실적 전망 상향","중소형 AI 종목 옥석 가리기","AI 산업 옥석 가리기","회복",{AI수요:.65,반도체공급:.75,외국인수급:.55,시장공포:-.35},{supply:-12,techHeat:-7,risk:5}],
  ]},
  {sector:"플랫폼·콘텐츠",prefix:"PL",seeds:[
    ["숏폼·웹툰 이용시간 급증…광고주 디지털 예산 확대","콘텐츠 제작사 신규 계약 증가","플랫폼 결제액도 동반 상승","디지털 콘텐츠 호황","확산",{소비심리:.8,AI수요:.25,외국인수급:.3},{growth:7,consumption:8}],
    ["신작 게임과 드라마 동시 흥행…K-콘텐츠 수출 신기록","해외 구독자 증가세 가팔라","IP 보유 제작사 몸값 상승","K-콘텐츠 흥행","과열",{수출경기:1.0,소비심리:.75,원달러환율:.3},{growth:9,risk:6,consumption:7}],
    ["콘텐츠 제작비 천정부지…흥행해도 남는 게 없다는 제작사들","배우·개발자 인건비 부담 확대","중소 제작사 자금 조달 난항","콘텐츠 비용 압박","병목",{소비심리:-.25,금리:.45,원자재:.2},{inflation:7,credit:7,growth:-4}],
    ["플랫폼 수수료 공개 의무화…사업모델 전면 수정 불가피","입점사 협상력 강화 전망","핀테크까지 규제 범위 확대","플랫폼 규제 충격","충격",{규제:1.55,외국인수급:-.55,시장공포:.55},{risk:-8,growth:-6}],
    ["개인정보 유출 후 이용자 이탈…광고주도 집행 보류","보안 투자 비용 급증 전망","경쟁 플랫폼 반사이익 기대","플랫폼 신뢰 위기","조정",{규제:1.2,소비심리:-.8,시장공포:1.0},{risk:-12,consumption:-7,credit:4}],
    ["통합 구독상품 출시…이용자 이탈 진정되며 대형사 반등","콘텐츠 공급사 최소수익 보장 확대","해외 진출 계획도 재개","플랫폼 신뢰 회복","회복",{소비심리:.8,규제:-.35,외국인수급:.45},{risk:7,consumption:6,growth:5}],
  ]},
  {sector:"자동차·배터리",prefix:"AU",seeds:[
    ["전기차 보조금 확대…완성차 업체 생산 목표 상향","고효율 배터리에 지원 집중","충전 인프라 예산도 증액","전기차 정책 수요","확산",{정부정책:1.3,소비심리:.55,수출경기:.45},{growth:8,consumption:5}],
    ["배터리 장기 공급계약 잇따라…소재업체까지 증설 경쟁","북미 공장 가동률 상승","수주잔고 사상 최대","배터리 수주 호황","과열",{수출경기:1.0,원자재:.45,외국인수급:.5},{growth:10,supply:7,risk:7}],
    ["리튬·니켈 가격 급등…완성차 원가 부담 현실화","배터리 가격 협상 난항","하이브리드 생산 확대 검토","핵심광물 가격 충격","병목",{원자재:1.55,소비심리:-.35,수출경기:-.25},{inflation:12,supply:12,growth:-5}],
    ["전기차 출고 지연 장기화…예약 취소율 빠르게 상승","부품 부족으로 공장 휴업 검토","중고 전기차 가격도 약세","전기차 공급 차질","충격",{반도체공급:-.9,소비심리:-1.0,시장공포:.65},{supply:14,consumption:-9,risk:-7}],
    ["배터리 화재 조사 확대…안전 규제 강화 예고","일부 모델 판매 잠정 중단","보험료 인상 가능성도 제기","배터리 안전성 논란","조정",{규제:1.3,소비심리:-1.1,시장공포:1.0},{risk:-12,consumption:-8,techHeat:-4}],
    ["전고체 시험 성공·하이브리드 판매 호조…수요 회복 기대","우량 배터리사 인증 통과","완성차 재고도 정상 수준","차세대차 회복","회복",{정부정책:.65,소비심리:.85,원자재:-.45,시장공포:-.35},{supply:-9,risk:7,growth:7}],
  ]},
  {sector:"바이오·헬스케어",prefix:"BIO",seeds:[
    ["국산 신약 임상 중간결과 긍정적…기술수출 기대 고조","해외 학회 발표 일정 확정","바이오 투자심리 회복 조짐","신약 임상 기대","확산",{임상성과:1.35,외국인수급:.35,시장공포:-.2},{growth:5,risk:6}],
    ["글로벌 제약사 기술수출 협상설…바이오 자금 몰렸다","중소형 바이오 거래대금 급증","증권가 목표가 줄줄이 상향","바이오 기술수출 과열","과열",{임상성과:1.55,외국인수급:.7,금리:-.25},{liquidity:8,risk:10,techHeat:5}],
    ["임상 환자 모집 지연…결과 발표 일정 뒤로 밀려","연구개발비 부담 확대","추가 유상증자 가능성 제기","임상 일정 병목","병목",{임상성과:-.8,금리:.55,시장공포:.6},{credit:8,risk:-7,growth:-4}],
    ["기대 신약 유효성 입증 실패…관련 기업 하한가 충격","동종 파이프라인도 재평가","기관 손절매 물량 출회","신약 임상 실패","충격",{임상성과:-1.8,외국인수급:-.75,시장공포:1.25},{risk:-17,credit:10}],
    ["적자 바이오 자금난 확산…개발 프로젝트 구조조정","벤처 투자 회수 난항","대형 제약사 인수 후보 물색","바이오 구조조정","조정",{금리:.9,임상성과:-.55,시장공포:.8},{credit:15,liquidity:-10,risk:-9}],
    ["정부 연구지원 확대…우량 파이프라인 중심 투자 재개","임상 비용 세액공제 확대","대형 제약사 공동개발 발표","바이오 선별 회복","회복",{정부정책:1.1,임상성과:.75,시장공포:-.45},{credit:-8,risk:7,growth:5}],
  ]},
  {sector:"금융",prefix:"FN",seeds:[
    ["금리 인하 기대에 거래대금 급증…증권주 먼저 웃었다","개인 신규 계좌 개설 증가","성장주에도 매수세 확산","유동성 장세 시작","확산",{금리:-1.0,외국인수급:.65,시장공포:-.55},{liquidity:14,risk:9,credit:-3}],
    ["신용거래 사상 최대…빚투 과열 경고음","증권사 이자수익 증가","중소형주 회전율 급등","신용투자 과열","과열",{외국인수급:.35,금리:.35,시장공포:.3},{liquidity:10,risk:13,credit:10}],
    ["금융당국, 신용융자 한도 축소 검토…증권가 긴장","담보비율 상향 가능성","고변동 종목 매물 우려","신용 규제 예고","병목",{규제:1.25,외국인수급:-.45,시장공포:.75},{liquidity:-8,credit:12,risk:-8}],
    ["대규모 반대매매 출회…지수 장중 급락","증권사 위험관리 우려 확대","현금성 자산으로 자금 이동","반대매매 충격","충격",{시장공포:1.75,외국인수급:-1.1,소비심리:-.55},{risk:-20,credit:18,liquidity:-14}],
    ["가계대출 연체율 상승…은행권 충당금 부담 확대","부동산 대출 심사 강화","고배당 정책 유지 여부 주목","금융 건전성 우려","조정",{금리:.7,규제:.65,시장공포:.75},{credit:16,growth:-6,risk:-7}],
    ["시장 안정화 자금 투입…대형 금융사 배당 확대","유동성 공급 창구 재가동","외국인 대형주 매수 전환","금융시장 안정","회복",{정부정책:1.0,외국인수급:.85,시장공포:-.9},{credit:-12,liquidity:10,risk:12}],
  ]},
  {sector:"에너지·전력",prefix:"EN",seeds:[
    ["국제 에너지 가격 상승…발전·정유 실적 기대 확대","운송업계 유류비 부담 증가","전기요금 조정론 재점화","에너지 가격 상승","확산",{유가:1.25,전력수요:.55,원자재:.45},{inflation:9,growth:-2}],
    ["데이터센터 전력 수요 폭증…발전설비 주문 밀려든다","전력망 증설 계획 검토","원전 가동률도 상승","전력 수요 과열","과열",{전력수요:1.55,AI수요:.65,정부정책:.55},{growth:8,supply:12,techHeat:5}],
    ["전력예비율 급락…산업계 순환절전 가능성","공장 가동 계획 조정","비상발전기 주문 급증","전력 공급 병목","병목",{전력수요:1.7,수출경기:-.45,원자재:.3},{supply:18,inflation:5,growth:-5}],
    ["산업용 전기요금 인상…제조업 원가 부담 확산","전력 공기업 적자 개선 기대","유통업계 냉방비 절감 돌입","전기요금 충격","충격",{전력수요:.6,원자재:-.45,소비심리:-.55,금리:.2},{inflation:11,consumption:-6}],
    ["원전 프로젝트 비용 증가·ESS 화재…에너지주 동반 조정","안전점검 기간 연장","신재생 공급과잉 우려도 부상","에너지 투자 조정","조정",{정부정책:-.65,규제:.9,시장공포:.65},{risk:-8,credit:6,supply:-5}],
    ["에너지 가격 안정·안전기준 확정…우량 설비사 수주 재개","산업용 전력 공급 정상화","운송·제조 원가 부담 완화","에너지 공급 정상화","회복",{유가:-1.0,전력수요:.45,정부정책:.65,시장공포:-.35},{inflation:-10,supply:-13,growth:6}],
  ]},
  {sector:"조선·산업재",prefix:"IND",seeds:[
    ["글로벌 선박 발주 급증…국내 조선소 수주잔고 확대","친환경 선박 문의 증가","기자재 업체도 증설 검토","조선 발주 호황","확산",{운임:1.15,수출경기:.85,원달러환율:.4},{growth:9,risk:5}],
    ["친환경 선박 수주 경쟁…조선·기계주 동반 강세","고부가 선종 비중 확대","외국인 산업재 매수 증가","조선 수주 과열","과열",{운임:1.35,외국인수급:.55,수출경기:.7},{growth:10,risk:8,supply:5}],
    ["후판 가격 급등·숙련공 부족…납기 지연 우려","인건비 협상 장기화","기자재 조달 기간도 늘어","조선 원가 병목","병목",{원자재:1.35,운임:.45,수출경기:-.25},{inflation:9,supply:13,growth:-3}],
    ["해외 플랜트 공사비 급증…대형 프로젝트 손실 반영","발주처와 추가비 협상 난항","건설사 채권금리 상승","해외공사 손실 충격","충격",{원자재:.9,금리:.7,시장공포:.85},{credit:12,risk:-11,growth:-6}],
    ["미분양 증가에 건설사 유동성 위기설…금융권도 촉각","프로젝트파이낸싱 차환 난항","채권단 공동관리 검토","건설 유동성 위기","조정",{금리:1.0,시장공포:1.2,규제:.35},{credit:19,risk:-15,growth:-9}],
    ["채권단 지원·SOC 투자 확대…산업재 수주 회복","공공 발주 일정 앞당겨","우량 건설사 자금조달 재개","산업재 정책 회복","회복",{정부정책:1.4,수출경기:.45,시장공포:-.65},{credit:-13,growth:9,risk:8}],
  ]},
  {sector:"소비·유통",prefix:"CON",seeds:[
    ["소비심리 큰 폭 개선…유통·여행 예약 동반 증가","카드 사용액 회복세","대형마트 방문객도 늘어","내수 소비 회복","확산",{소비심리:1.25,금리:-.25,시장공포:-.35},{consumption:14,growth:6,risk:4}],
    ["해외 관광객 사상 최대…K-뷰티·면세점 품절 행렬","항공 탑승률 상승","호텔 객실료도 강세","관광 소비 과열","과열",{소비심리:1.45,수출경기:.35,원달러환율:-.25},{consumption:16,growth:8,risk:5}],
    ["항공권·물류비 급등…여행사와 유통업체 마진 압박","유류할증료 인상 검토","신선식품 배송비도 상승","소비 물류 병목","병목",{유가:1.1,원자재:.65,소비심리:-.35},{inflation:11,supply:9,consumption:-5}],
    ["식품 원재료 가격 급등…제품 가격 줄줄이 인상","할인행사 축소 가능성","외식 물가도 재상승","생활물가 충격","충격",{원자재:1.35,소비심리:-1.0,금리:.35},{inflation:16,consumption:-12,risk:-4}],
    ["내수 급랭·초저가 경쟁…유통사 수익성 경고","재고 소진 할인 확대","여행 예약 취소도 증가","소비 경기 조정","조정",{소비심리:-1.45,시장공포:.75,금리:.45},{consumption:-17,growth:-8,credit:6}],
    ["대규모 할인행사 흥행…재고 정상화와 소비 반등","온라인 주문액 회복","항공 예약도 바닥 통과","소비 재고 정상화","회복",{소비심리:1.0,유가:-.35,시장공포:-.45},{consumption:11,supply:-7,growth:5}],
  ]},
];

const factorNames: Partial<Record<MarketFactor,string>>={AI수요:"AI 투자",반도체공급:"반도체 수급",금리:"금리",원달러환율:"환율",유가:"에너지 가격",원자재:"원자재",소비심리:"소비심리",정부정책:"정부 정책",규제:"규제",임상성과:"임상",수출경기:"수출",전력수요:"전력",운임:"운임",외국인수급:"외국인 수급",시장공포:"위험 심리"};

function chainEvents(chain:Chain): MarketEvent[] {
  return chain.seeds.map((seed,index)=>{
    const [headline,brief1,brief2,internalName,phase,factors,stateChanges]=seed;
    const id=`${chain.prefix}-${String(index+1).padStart(2,"0")}`;
    const next=`${chain.prefix}-${String((index+1)%chain.seeds.length+1).padStart(2,"0")}`;
    const branch=index===1?`${chain.prefix}-04`:index===3?`${chain.prefix}-06`:next;
    const [imageUrl,imageCredit]=eventMedia(id,media[chain.sector]);
    return {id,headline,briefs:[brief1,brief2],internalName,impact:`${chain.sector} ${phase} 국면 · ${Object.keys(factors).map(key=>factorNames[key as MarketFactor]).slice(0,3).join("·")} 변화`,imageUrl,imageCredit,factors,sector:chain.sector,phase,successors:[next,branch],baseWeight:18,stateChanges,stateAffinity:stateChanges};
  });
}

const macroSeeds: Array<[string,string,string,Partial<Record<MarketFactor,number>>,Partial<Record<HiddenMarketState,number>>]> = [
  ["한국중앙은행, 기준금리 0.50%p 전격 인하","성장주와 부동산에 매수세 유입","은행 예대마진 축소 우려",{금리:-1.5,외국인수급:.45,소비심리:.55},{liquidity:15,growth:7,risk:8}],
  ["소비자물가 예상 밖 급등…추가 긴축 우려","국채금리 장중 급등","유통·성장주 투자심리 위축",{금리:1.1,원자재:.8,소비심리:-.7},{inflation:18,liquidity:-8,risk:-8}],
  ["원·달러 환율 급등…수출주는 웃고 내수주는 원가 비상","외국인 현물 매도 확대","조선·자동차 환율 효과 기대",{원달러환율:1.55,외국인수급:-.8,원자재:-.45},{inflation:6,risk:-6}],
  ["원화 가치 급등…항공·내수 수혜, 수출기업은 긴장","수입 원가 부담 완화","외국인 채권 자금 유입",{원달러환율:-1.4,소비심리:.65,외국인수급:.5},{inflation:-7,consumption:7}],
  ["글로벌 증시 동반 급락…안전자산 선호 급속 확산","외국인 대형주 매도","회사채 신용스프레드 확대",{시장공포:1.9,외국인수급:-1.45,금리:.35},{risk:-22,credit:13,liquidity:-10}],
  ["해외 투자자 국내주식 대량 매수…대형주 중심 급등","원화 강세 압력 확대","중소형주는 상대적 소외",{외국인수급:1.65,시장공포:-.55,원달러환율:-.35},{risk:13,liquidity:10}],
  ["주요 항구 물류 마비…제조업 공급망 비상","부품 반입 일정 줄줄이 지연","해상 운임 급등",{운임:1.65,수출경기:-.9,원자재:.65},{supply:20,inflation:8,growth:-8}],
  ["대규모 사이버 공격…금융·플랫폼 서비스 일부 중단","온라인 결제 장애 확산","보안 투자 확대 전망",{규제:.85,소비심리:-.65,시장공포:1.15},{risk:-13,consumption:-5}],
  ["정부, 대규모 경기부양책 발표…인프라·소비 지원 확대","공공 발주 일정 앞당겨","재정 확대에 국채금리 촉각",{정부정책:1.55,소비심리:.75,금리:.25},{growth:15,consumption:8,inflation:4}],
  ["기업 실적 전망 줄줄이 하향…경기 둔화 우려 확산","재고 증가 기업 늘어","현금 보유 대형주 선호",{수출경기:-1.1,소비심리:-.85,시장공포:1.0},{growth:-15,risk:-12,credit:7}],
  ["수출 실적 예상 밖 호조…반도체·자동차·조선 동반 강세","무역수지 흑자 확대","원화 강세 전환 가능성",{수출경기:1.5,외국인수급:.75,원달러환율:.35},{growth:13,risk:8}],
  ["근거 없는 낙관론 확산…전 업종 동반 상승에 경고음","신용거래와 거래대금 급증","증권가 과열 지표 주목",{시장공포:-1.15,외국인수급:.55,소비심리:.7},{risk:16,liquidity:12,techHeat:12}],
];

const macroEvents: MarketEvent[]=macroSeeds.map((seed,index)=>{const [headline,brief1,brief2,factors,stateChanges]=seed;const id=`MAC-${String(index+1).padStart(2,"0")}`;const [imageUrl,imageCredit]=eventMedia(id,media.거시);return {id,headline,briefs:[brief1,brief2],internalName:`거시 독립 사건 ${index+1}`,impact:`전 시장 거시 충격 · ${Object.keys(factors).map(key=>factorNames[key as MarketFactor]).slice(0,3).join("·")} 변화`,imageUrl,imageCredit,factors,sector:"거시",phase:"독립",successors:[],baseWeight:7,stateChanges,stateAffinity:stateChanges};});

export const marketEventCatalog: MarketEvent[]=[...chains.flatMap(chainEvents),...macroEvents];
