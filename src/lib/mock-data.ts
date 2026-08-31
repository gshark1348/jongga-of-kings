import type { Company, NewsIssue, RateEvent, Sector, SurpriseEvent, Team } from "./types";
import { realCompanies } from "./company-data";

export const companies: Company[] = realCompanies;

export const sectors: Sector[] = [
  "AI·반도체", "플랫폼·콘텐츠", "자동차·배터리", "바이오·헬스케어",
  "금융", "에너지·전력", "조선·산업재", "소비·유통",
];

export const parodyCompanies = [
  { id:"samstar", code:"001930", name:"삼별전자", market:"코스피아", sector:"AI·반도체", description:"메모리와 AI 가속기를 만드는 대표 전자기업", price:74200, change:5.8, cap:"대형", volatility:"보통", traits:["대형주","수출 민감","AI 수혜"], history:[64,67,66,70,74] },
  { id:"hynixo", code:"000667", name:"에스케이하이닉소", market:"코스피아", sector:"AI·반도체", description:"고성능 메모리에 집중하는 반도체 기업", price:186500, change:8.4, cap:"대형", volatility:"높음", traits:["성장주","공급망 민감"], history:[142,151,160,172,186] },
  { id:"futurechip", code:"278130", name:"미래칩스", market:"코스닥크", sector:"AI·반도체", description:"AI 추론용 칩을 설계하는 신생 팹리스", price:28400, change:12.7, cap:"소형", volatility:"높음", traits:["고변동성","기술주"], history:[18,20,19,24,28] },
  { id:"navida", code:"035420", name:"네이바다", market:"코스피아", sector:"플랫폼·콘텐츠", description:"검색과 상거래, 생성형 AI를 운영하는 플랫폼", price:211000, change:-2.3, cap:"대형", volatility:"보통", traits:["성장주","광고 민감"], history:[218,215,220,216,211] },
  { id:"talktalk", code:"035720", name:"카카오톡톡", market:"코스피아", sector:"플랫폼·콘텐츠", description:"메신저 기반 콘텐츠와 금융 서비스를 운영", price:57600, change:-3.6, cap:"대형", volatility:"높음", traits:["규제 민감","내수주"], history:[62,60,61,59,57] },
  { id:"pixelgames", code:"293490", name:"픽셀게임즈", market:"코스닥크", sector:"플랫폼·콘텐츠", description:"글로벌 모바일 게임을 제작하는 콘텐츠사", price:32800, change:1.9, cap:"소형", volatility:"높음", traits:["신작 민감","수출주"], history:[30,31,29,32,32.8] },
  { id:"hyundaelim", code:"005380", name:"현대차림", market:"코스피아", sector:"자동차·배터리", description:"전기차와 하이브리드를 생산하는 완성차 기업", price:238000, change:-1.7, cap:"대형", volatility:"보통", traits:["수출주","환율 민감"], history:[242,245,241,240,238] },
  { id:"ecoprotein", code:"086520", name:"에코프로틴", market:"코스닥크", sector:"자동차·배터리", description:"고밀도 배터리 양극재를 생산하는 소재기업", price:91400, change:4.2, cap:"중형", volatility:"높음", traits:["원자재 민감","성장주"], history:[80,84,82,87,91] },
  { id:"voltone", code:"373220", name:"볼트온에너지", market:"코스피아", sector:"자동차·배터리", description:"전기차용 배터리 셀과 저장장치를 제조", price:361000, change:2.6, cap:"대형", volatility:"보통", traits:["공급망 민감","대형주"], history:[349,355,352,358,361] },
  { id:"celltrions", code:"068270", name:"셀트리온즈", market:"코스피아", sector:"바이오·헬스케어", description:"바이오 의약품을 개발하고 수출하는 기업", price:173400, change:-0.8, cap:"대형", volatility:"보통", traits:["임상 민감","수출주"], history:[176,175,177,174,173] },
  { id:"medibloom", code:"196170", name:"메디블룸", market:"코스닥크", sector:"바이오·헬스케어", description:"희귀질환 신약 후보를 개발하는 바이오기업", price:42200, change:7.1, cap:"소형", volatility:"높음", traits:["임상 민감","고변동성"], history:[35,37,36,39,42] },
  { id:"shinvillage", code:"055550", name:"신한금융마을", market:"코스피아", sector:"금융", description:"은행과 증권을 아우르는 종합 금융그룹", price:48600, change:1.2, cap:"대형", volatility:"낮음", traits:["배당주","금리 민감"], history:[46,47,47,48,48.6] },
  { id:"kiwom", code:"039490", name:"키움히어로증권", market:"코스피아", sector:"금융", description:"온라인 거래에 강한 개인투자자 전문 증권사", price:128900, change:3.8, cap:"중형", volatility:"보통", traits:["거래대금 민감","금융주"], history:[119,121,120,124,128] },
  { id:"doosanenergy", code:"034020", name:"두산에너빌리티드", market:"코스피아", sector:"에너지·전력", description:"원전과 발전 설비를 제작하는 중공업 기업", price:24650, change:3.4, cap:"대형", volatility:"보통", traits:["정책 민감","수주산업"], history:[22,23,23,24,24.6] },
  { id:"solarlight", code:"112610", name:"솔라라이트", market:"코스닥크", sector:"에너지·전력", description:"태양광 모듈과 전력관리 장치를 생산", price:18750, change:-1.1, cap:"소형", volatility:"높음", traits:["정책 민감","원자재 민감"], history:[19,20,19,19,18.7] },
  { id:"oceanview", code:"042660", name:"한화오션뷰", market:"코스피아", sector:"조선·산업재", description:"친환경 선박과 해양 설비를 건조하는 조선사", price:39700, change:2.9, cap:"대형", volatility:"보통", traits:["수주산업","환율 민감"], history:[36,37,38,38,39.7] },
  { id:"buildream", code:"000720", name:"현대건설림", market:"코스피아", sector:"조선·산업재", description:"도시개발과 해외 플랜트를 수행하는 건설사", price:35200, change:-0.6, cap:"중형", volatility:"보통", traits:["금리 민감","정책 민감"], history:[36,35,36,35,35.2] },
  { id:"emartian", code:"139480", name:"이마트리안", market:"코스피아", sector:"소비·유통", description:"온·오프라인 유통망을 운영하는 생활기업", price:72600, change:0.7, cap:"중형", volatility:"낮음", traits:["내수주","방어주"], history:[71,72,71,72,72.6] },
  { id:"beautylab", code:"090430", name:"아모레퍼즐", market:"코스피아", sector:"소비·유통", description:"K-뷰티 브랜드를 세계에 판매하는 소비재기업", price:137800, change:2.1, cap:"대형", volatility:"보통", traits:["관광 민감","수출주"], history:[130,132,131,135,137] },
  { id:"airseoul", code:"003490", name:"대한항공길", market:"코스피아", sector:"소비·유통", description:"여객과 화물을 운송하는 대형 항공사", price:22400, change:-1.4, cap:"대형", volatility:"보통", traits:["유가 민감","관광 민감"], history:[23,22,23,22.7,22.4] },
];

export const teams: Team[] = [
  {id:"ants",rank:1,previousRank:2,name:"여의도 불개미",assets:118420000,totalReturn:18.42,turnReturn:4.72,submitted:true,focus:"AI·반도체",turnoverRate:32,loanBalance:20000000,accruedInterest:360000},
  {id:"value",rank:2,previousRank:1,name:"가치투자연구소",assets:114860000,totalReturn:14.86,turnReturn:1.23,submitted:true,focus:"금융",turnoverRate:20,loanBalance:0,accruedInterest:0},
  {id:"fullbuy",rank:3,previousRank:5,name:"풀매수 원정대",assets:109330000,totalReturn:9.33,turnReturn:6.04,submitted:true,focus:"바이오·헬스케어",turnoverRate:68,loanBalance:40000000,accruedInterest:720000},
  {id:"cash",rank:4,previousRank:3,name:"현금이 최고",assets:104720000,totalReturn:4.72,turnReturn:-0.84,submitted:false,focus:"소비·유통",turnoverRate:14,loanBalance:0,accruedInterest:0},
  {id:"charts",rank:5,previousRank:4,name:"차트는 거짓말 안해",assets:98460000,totalReturn:-1.54,turnReturn:-3.21,submitted:true,focus:"플랫폼·콘텐츠",turnoverRate:41,loanBalance:10000000,accruedInterest:180000},
  {id:"dividend",rank:6,previousRank:6,name:"배당금 수호대",assets:95210000,totalReturn:-4.79,turnReturn:0.62,submitted:false,focus:"에너지·전력",turnoverRate:8,loanBalance:0,accruedInterest:0},
];

export const rateEvents: RateEvent[] = [
  {id:"rate-cut-025",direction:"인하",change:-0.25,headline:"한국중앙은행, 기준금리 0.25%p 인하…성장 방어에 무게",reason:"내수 둔화와 투자심리 위축"},
  {id:"rate-hike-050",direction:"인상",change:0.5,headline:"물가 다시 꿈틀…기준금리 0.50%p 전격 인상",reason:"과열된 자산시장과 물가 압력"},
  {id:"rate-cut-050",direction:"인하",change:-0.5,headline:"경기 충격에 긴급 처방…기준금리 0.50%p 인하",reason:"급격한 경기 냉각과 신용 경색"},
  {id:"rate-hike-025",direction:"인상",change:0.25,headline:"가계대출 급증에 제동…기준금리 0.25%p 인상",reason:"부채 증가와 금융 불균형"},
];

export const news: NewsIssue[] = [
  {id:"chip",headline:"“주문은 쌓이는데 물건이 없다”…첨단 반도체 품귀 장기화 조짐",briefs:["데이터센터 인근 지역서 전력 사용 제한 논의","투자자들, 고배당 종목으로 시선 이동"],internalName:"첨단 반도체 공급 압력",impact:"반도체 강세 · 제조업 원가 부담 · 시장 과열 +8",imageUrl:"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=85",imageCredit:"Unsplash · Laura Ockel",factors:{AI수요:1.2,반도체공급:-1.5,전력수요:.7,원자재:-.25,시장공포:.15}},
  {id:"ai",headline:"“기대가 실적보다 앞섰다”…AI 고평가 논쟁 시장 강타",briefs:["외국인, 대형 기술주 매수 규모 축소","증권가서 가치주 순환매 전망 고개"],internalName:"AI 성장주 과열 경고",impact:"기술주 약세 · 방어주 자금 유입 · 공포 심리 +12",imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=85",imageCredit:"Unsplash · Maxim Hopman",factors:{AI수요:-1.1,외국인수급:-1.2,시장공포:1.5,금리:.2,소비심리:-.35}},
  {id:"bio",headline:"기대 모은 국산 신약, 임상 중간결과 공개 임박",briefs:["글로벌 제약사 관계자 잇단 방한","바이오기업 자금조달 계획 속속 재개"],internalName:"신약 임상 기대 확산",impact:"바이오 변동성 확대 · 성장주 심리 개선",imageUrl:"https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1400&q=85",imageCredit:"Unsplash · National Cancer Institute",factors:{임상성과:1.45,외국인수급:.35,시장공포:-.2,금리:-.15,규제:.25}},
];

export const surpriseEvents: SurpriseEvent[] = [
  {id:"deal",category:"강한 호재",headline:"글로벌 기업과 초대형 공급계약 체결",impact:"선택 산업 강한 상승, 공급망 산업 동반 반응"},
  {id:"fire",category:"강한 악재",headline:"핵심 생산시설서 화재…공급 차질 우려",impact:"생산 차질과 경쟁사 반사이익 발생"},
  {id:"rate",category:"시장 충격",headline:"예상 못 한 금리 결정…금융시장 출렁",impact:"금리 민감도에 따라 전 산업 차등 반응"},
  {id:"rotation",category:"심리 변화",headline:"한동안 외면받던 업종에 매수세",impact:"소외 산업 반등과 기존 주도주 자금 이탈"},
  {id:"outage",category:"강한 악재",headline:"대규모 전산 장애…금융·유통 서비스 중단",impact:"디지털 산업 약세, 보안 수요 증가"},
  {id:"mania",category:"심리 변화",headline:"뚜렷한 이유 없이 치솟는 중소형주",impact:"중소형주 강세와 버블 위험 급증"},
];

export const sectorPerformance = [5.9,-2.4,-0.7,2.8,1.5,2.2,1.1,-0.4];
