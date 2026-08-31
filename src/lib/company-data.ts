import type { Company, Market, MarketFactor, Sector } from "./types";

const sectorImages: Record<Sector, [string, string]> = {
  "AI·반도체": ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", "Unsplash · Harrison Broad"],
  "플랫폼·콘텐츠": ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", "Unsplash · Lorenzo Herrera"],
  "자동차·배터리": ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80", "Unsplash · Hyundai Motor Group"],
  "바이오·헬스케어": ["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80", "Unsplash · Chokniti Khongchum"],
  "금융": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "Unsplash · Alex Shutin"],
  "에너지·전력": ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80", "Unsplash · American Public Power Association"],
  "조선·산업재": ["https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80", "Unsplash · Vidar Nordli-Mathisen"],
  "소비·유통": ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80", "Unsplash · Clark Street Mercantile"],
};

const officialSites: Record<string, string> = {
  "samsung-electronics":"https://www.samsung.com/sec/", "sk-hynix":"https://www.skhynix.com/", "hanmi-semiconductor":"https://www.hanmisemi.com/", "leeno":"https://www.leeno.com/", "hpsp":"https://www.hpsp.co.kr/",
  naver:"https://www.navercorp.com/", kakao:"https://www.kakaocorp.com/", krafton:"https://www.krafton.com/", pearlabyss:"https://www.pearlabyss.com/", jyp:"https://www.jype.com/",
  "hyundai-motor":"https://www.hyundai.com/kr/ko/e", kia:"https://www.kia.com/kr", "lg-energy":"https://www.lgensol.com/", "ecopro-bm":"https://www.ecoprobm.co.kr/", chunbo:"https://www.chunbochem.com/",
  "samsung-biologics":"https://samsungbiologics.com/", celltrion:"https://www.celltrion.com/", yuhan:"https://www.yuhan.co.kr/", alteogen:"https://www.alteogen.com/", ligachem:"https://www.ligachembio.com/",
  "kb-financial":"https://www.kbfg.com/", shinhan:"https://www.shinhangroup.com/", "samsung-securities":"https://www.samsungpop.com/", "woori-tech-invest":"http://www.wooricapital.co.kr/", "sbi-investment":"https://www.sbinvestment.co.kr/",
  "doosan-enerbility":"https://www.doosanenerbility.com/", kepco:"https://home.kepco.co.kr/", "hanwha-solutions":"https://www.hanwhasolutions.com/", "seojin-system":"https://www.seojinsystem.net/", "gnc-energy":"https://www.gncenergy.co.kr/",
  "hd-ksoe":"https://www.hdksoe.co.kr/", "hanwha-ocean":"https://www.hanwhaocean.com/", "hyundai-ec":"https://www.hdec.kr/", "tk-corp":"https://www.tkbend.co.kr/", "sungkwang-bend":"http://www.skbend.com/",
  amorepacific:"https://www.apgroup.com/", emart:"https://company.emart.com/", "korean-air":"https://www.koreanair.com/", cosmecca:"https://www.cosmecca.com/", "yellow-balloon":"https://company.ybtour.co.kr/",
};

const sectorSensitivity: Record<Sector, Partial<Record<MarketFactor, number>>> = {
  "AI·반도체": {AI수요:1.5,반도체공급:-1.1,원달러환율:.65,수출경기:.8,외국인수급:1.1,금리:-.55},
  "플랫폼·콘텐츠": {소비심리:.7,규제:-1.1,금리:-.9,원달러환율:.25,시장공포:-.65},
  "자동차·배터리": {원달러환율:.65,원자재:-1.05,수출경기:1.1,금리:-.55,정부정책:.7},
  "바이오·헬스케어": {임상성과:1.7,금리:-.75,규제:-.5,원달러환율:.35,시장공포:-.35},
  "금융": {금리:.85,정부정책:.45,규제:-.8,외국인수급:.65,시장공포:-.45},
  "에너지·전력": {유가:.65,전력수요:1.2,정부정책:1.1,원자재:-.35,금리:-.25},
  "조선·산업재": {운임:1.0,원달러환율:.8,원자재:-.6,수출경기:.85,금리:-.4},
  "소비·유통": {소비심리:1.25,유가:-.65,원달러환율:-.45,금리:-.7,시장공포:-.55},
};

const companyOverrides: Record<string, Partial<Record<MarketFactor, number>>> = {
  "sk-hynix":{AI수요:2,반도체공급:-1.45}, "hanmi-semiconductor":{AI수요:1.8,외국인수급:1.35}, naver:{AI수요:.8,규제:-.8}, kakao:{규제:-1.55,소비심리:.9},
  "lg-energy":{원자재:-1.4,정부정책:1}, "ecopro-bm":{원자재:-1.7,시장공포:-1.1}, alteogen:{임상성과:2.2,시장공포:-.8}, "samsung-biologics":{원달러환율:.65,임상성과:1.1},
  "kb-financial":{금리:1.15}, "woori-tech-invest":{시장공포:-1.5,금리:-1.1}, kepco:{유가:-1.3,정부정책:1.5}, "doosan-enerbility":{정부정책:1.6,수출경기:.7},
  "hd-ksoe":{운임:1.4,원달러환율:1.0}, "korean-air":{유가:-1.65,원달러환율:-1.1,소비심리:1.0}, amorepacific:{원달러환율:.55,소비심리:1.1}, emart:{소비심리:1.4,금리:-.8},
};

type Seed = [string,string,string,"코스피아"|"코스닥크",Sector,string,"대형"|"중형"|"소형","낮음"|"보통"|"높음",number,number];
const seeds: Seed[] = [
  ["samsung-electronics","005930","삼성전자","코스피아","AI·반도체","메모리·파운드리·모바일을 아우르는 종합 전자기업","대형","보통",74200,4.8],
  ["sk-hynix","000660","SK하이닉스","코스피아","AI·반도체","HBM과 메모리 반도체를 주력으로 하는 기업","대형","높음",186500,8.4],
  ["hanmi-semiconductor","042700","한미반도체","코스피아","AI·반도체","AI 반도체 후공정 장비를 공급하는 기업","중형","높음",128400,6.7],
  ["leeno","058470","리노공업","코스닥크","AI·반도체","반도체 검사용 소켓과 프로브를 제조하는 기업","중형","보통",214000,2.9],
  ["hpsp","403870","HPSP","코스닥크","AI·반도체","고압 수소 어닐링 반도체 장비 기업","중형","높음",43200,-2.1],
  ["naver","035420","NAVER","코스피아","플랫폼·콘텐츠","검색·커머스·클라우드·AI 플랫폼 기업","대형","보통",211000,-2.3],
  ["kakao","035720","카카오","코스피아","플랫폼·콘텐츠","메신저 기반 콘텐츠와 금융 생태계를 운영","대형","높음",57600,-3.6],
  ["krafton","259960","크래프톤","코스피아","플랫폼·콘텐츠","글로벌 게임 IP를 개발·서비스하는 기업","대형","보통",318000,3.2],
  ["pearlabyss","263750","펄어비스","코스닥크","플랫폼·콘텐츠","온라인·콘솔 게임을 개발하는 게임사","중형","높음",42800,5.1],
  ["jyp","035900","JYP Ent.","코스닥크","플랫폼·콘텐츠","아티스트와 글로벌 음악 콘텐츠를 제작","중형","높음",81200,-1.8],
  ["hyundai-motor","005380","현대차","코스피아","자동차·배터리","완성차와 미래 모빌리티 사업을 운영","대형","보통",238000,-1.7],
  ["kia","000270","기아","코스피아","자동차·배터리","승용·상용차와 전동화 차량을 생산","대형","보통",114600,1.4],
  ["lg-energy","373220","LG에너지솔루션","코스피아","자동차·배터리","자동차·ESS용 배터리 셀을 제조","대형","보통",361000,2.6],
  ["ecopro-bm","247540","에코프로비엠","코스닥크","자동차·배터리","전기차 배터리용 양극재를 생산","중형","높음",91400,4.2],
  ["chunbo","278280","천보","코스닥크","자동차·배터리","배터리 전해질과 전자 소재를 제조","중형","높음",67800,-2.8],
  ["samsung-biologics","207940","삼성바이오로직스","코스피아","바이오·헬스케어","바이오의약품 위탁개발생산 기업","대형","보통",924000,2.1],
  ["celltrion","068270","셀트리온","코스피아","바이오·헬스케어","바이오시밀러를 개발하고 세계에 공급","대형","보통",173400,-0.8],
  ["yuhan","000100","유한양행","코스피아","바이오·헬스케어","의약품 연구개발과 판매를 수행","대형","보통",112500,3.6],
  ["alteogen","196170","알테오젠","코스닥크","바이오·헬스케어","바이오의약품 전달 플랫폼을 개발","중형","높음",312000,7.1],
  ["ligachem","141080","리가켐바이오","코스닥크","바이오·헬스케어","항체약물접합체 신약을 연구개발","중형","높음",104200,5.4],
  ["kb-financial","105560","KB금융","코스피아","금융","은행·증권·보험을 아우르는 금융그룹","대형","낮음",87600,1.8],
  ["shinhan","055550","신한지주","코스피아","금융","은행 중심의 종합 금융 서비스를 운영","대형","낮음",48600,1.2],
  ["samsung-securities","016360","삼성증권","코스피아","금융","자산관리와 투자은행 업무를 수행","중형","보통",51200,2.4],
  ["woori-tech-invest","041190","우리기술투자","코스닥크","금융","벤처기업과 신기술 사업에 투자","소형","높음",7820,6.3],
  ["sbi-investment","019550","SBI인베스트먼트","코스닥크","금융","중소·벤처기업 투자금융을 수행","소형","높음",1120,-2.6],
  ["doosan-enerbility","034020","두산에너빌리티","코스피아","에너지·전력","원전·가스터빈 등 발전 설비를 제작","대형","보통",24650,3.4],
  ["kepco","015760","한국전력","코스피아","에너지·전력","전력 판매와 송배전망을 운영","대형","낮음",21800,1.1],
  ["hanwha-solutions","009830","한화솔루션","코스피아","에너지·전력","태양광과 화학 소재 사업을 운영","대형","보통",28750,-1.1],
  ["seojin-system","178320","서진시스템","코스닥크","에너지·전력","ESS와 통신장비 부품을 제조","중형","높음",31400,4.7],
  ["gnc-energy","119850","지엔씨에너지","코스닥크","에너지·전력","비상발전기와 분산에너지 사업을 운영","소형","높음",8740,2.8],
  ["hd-ksoe","009540","HD한국조선해양","코스피아","조선·산업재","조선 계열사를 총괄하는 중간지주사","대형","보통",198500,2.5],
  ["hanwha-ocean","042660","한화오션","코스피아","조선·산업재","상선·특수선과 해양 설비를 건조","대형","보통",39700,2.9],
  ["hyundai-ec","000720","현대건설","코스피아","조선·산업재","국내외 건축·토목·플랜트 사업을 수행","대형","보통",35200,-0.6],
  ["tk-corp","023160","태광","코스닥크","조선·산업재","산업용 배관 피팅을 제조","중형","보통",18900,3.1],
  ["sungkwang-bend","014620","성광벤드","코스닥크","조선·산업재","조선·플랜트용 관이음쇠를 생산","중형","보통",15820,1.7],
  ["amorepacific","090430","아모레퍼시픽","코스피아","소비·유통","화장품 브랜드를 국내외에 전개","대형","보통",137800,2.1],
  ["emart","139480","이마트","코스피아","소비·유통","대형마트와 온라인 유통 사업을 운영","중형","낮음",72600,0.7],
  ["korean-air","003490","대한항공","코스피아","소비·유통","국제 여객과 항공 화물을 운송","대형","보통",22400,-1.4],
  ["cosmecca","241710","코스메카코리아","코스닥크","소비·유통","화장품 연구개발·생산을 대행","중형","높음",71400,4.6],
  ["yellow-balloon","104620","노랑풍선","코스닥크","소비·유통","여행상품과 항공권을 판매","소형","높음",6230,-2.2],
];

export const realCompanies: Company[] = seeds.map((seed, index) => {
  const [id, code, name, legacyMarket, sector, description, cap, volatility, price, change] = seed;
  const market: Market = legacyMarket === "코스피아" ? "코스피" : "코스닥";
  const [sectorImageUrl, sectorImageCredit] = sectorImages[sector];
  const officialWebsite = officialSites[id];
  const sensitivities = { ...sectorSensitivity[sector], ...companyOverrides[id] };
  const influenceAreas = Object.entries(sensitivities).sort((a,b)=>Math.abs(b[1]??0)-Math.abs(a[1]??0)).slice(0,5).map(([factor,value])=>`${factor} ${Number(value)>0?"수혜":"부담"}`);
  const base = Math.round(price / 1000);
  return {
    id, code, name, market, sector, description, cap, volatility, price, change,
    traits: [cap + "주", volatility === "높음" ? "고변동성" : "시장 대표", sector + " 민감"],
    history: [base * .92, base * .96, base * .94, base * .98, base].map(Math.round),
    imageUrl: sectorImageUrl,
    imageCredit: `${sectorImageCredit} · ${sector} 관련 이미지`,
    founded: `${1965 + (index * 3) % 48}년`, employees: `${(1200 + index * 731).toLocaleString()}명`,
    gameRevenue: 3800 + index * 1470, gameOperatingMargin: Number((5.4 + (index % 9) * 1.7).toFixed(1)),
    officialWebsite, influenceAreas, sensitivities,
  };
});
