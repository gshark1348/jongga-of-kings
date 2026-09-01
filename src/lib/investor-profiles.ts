import type { InvestorMetrics, InvestorProfile } from "./types";

export const investorProfiles: InvestorProfile[] = [
  { id:"all-in",number:1,catchphrase:"인생은 한 방!",name:"몰빵형 투자자들",description:"확신이 드는 한두 종목에 화력을 집중합니다.",strength:"맞히는 순간 순위표를 뒤집는 폭발력",caution:"한 번의 악재가 포트폴리오 전체를 흔들 수 있어요",stamp:"ALL IN" },
  { id:"steady",number:2,catchphrase:"뭘 그리 욕심이 과해유~",name:"안정형 투자자들",description:"변동이 작은 대형주와 방어주를 차분히 모읍니다.",strength:"거친 장에서도 흔들리지 않는 안정감",caution:"강한 상승장에서는 추월당할 수 있어요",stamp:"STEADY" },
  { id:"textbook",number:3,catchphrase:"계란은 여러 바구니에!",name:"교과서 분산형",description:"산업과 종목을 고르게 나누는 정석 포트폴리오입니다.",strength:"예상 밖의 이슈에도 손실을 잘 흡수해요",caution:"확실한 기회에도 수익이 희석될 수 있어요",stamp:"BALANCED" },
  { id:"trend",number:4,catchphrase:"뜨는 데는 이유가 있지!",name:"테마 추격형",description:"뉴스에 등장한 주도 산업을 빠르게 따라갑니다.",strength:"상승 흐름을 발견하면 누구보다 빠릅니다",caution:"막차에 올라타면 내릴 곳을 놓칠 수 있어요",stamp:"TREND" },
  { id:"value",number:5,catchphrase:"싸게 샀으면 기다려야지!",name:"가치 존버형",description:"외면받는 기업을 골라 긴 호흡으로 기다립니다.",strength:"시장 관심이 돌아올 때 큰 보상을 얻어요",caution:"싼 데에는 이유가 있을 수도 있습니다",stamp:"VALUE" },
  { id:"detective",number:6,catchphrase:"단신 한 줄도 놓치지 않아",name:"뉴스 탐정형",description:"헤드라인과 단신의 연결고리를 집요하게 추적합니다.",strength:"다음 이슈를 한발 먼저 예상하는 추리력",caution:"가짜 신호에 너무 깊이 빠질 수 있어요",stamp:"DETECTIVE" },
  { id:"contrarian",number:7,catchphrase:"다들 산다고? 우린 판다!",name:"청개구리 역발상형",description:"시장 다수와 반대편에서 기회를 찾습니다.",strength:"과열과 공포의 반전을 잘 포착해요",caution:"시장 흐름이 오래가면 외로운 시간이 옵니다",stamp:"CONTRA" },
  { id:"panic",number:8,catchphrase:"어어, 일단 나가고 보자!",name:"공포 탈출형",description:"악재가 보이면 누구보다 빠르게 위험을 줄입니다.",strength:"대형 폭락을 피하는 생존 본능",caution:"작은 흔들림에도 좋은 종목을 놓칠 수 있어요",stamp:"ESCAPE" },
  { id:"dip",number:9,catchphrase:"내려왔네? 한 접시 더!",name:"무한리필 물타기형",description:"가격이 내려갈수록 비중을 더하는 강심장입니다.",strength:"반등이 오면 평균단가의 마법을 보여줘요",caution:"반등 없는 하락에는 그릇이 끝없이 늘어납니다",stamp:"REFILL" },
  { id:"profit",number:10,catchphrase:"수익 났으면 칼퇴합니다",name:"익절 칼퇴형",description:"목표 수익을 채우면 미련 없이 자리를 뜹니다.",strength:"번 돈을 실제 수익으로 지키는 결단력",caution:"대세 상승의 긴 꼬리를 놓칠 수 있어요",stamp:"CLOCK OUT" },
  { id:"thrill",number:11,catchphrase:"심장이 뛰어야 투자지!",name:"고위험 스릴형",description:"변동성이 큰 성장주와 소형주를 즐겨 선택합니다.",strength:"변화가 클수록 기회를 만들어내는 배짱",caution:"수익률도 심장도 롤러코스터를 탑니다",stamp:"HIGH RISK" },
  { id:"bluechip",number:12,catchphrase:"역시 큰형이 든든하지",name:"대형주 신뢰형",description:"시장을 대표하는 큰 기업을 중심으로 구성합니다.",strength:"위기에도 버틸 체력과 정보가 충분해요",caution:"작은 기업의 폭발적인 반등은 남의 몫",stamp:"BLUE CHIP" },
  { id:"treasure",number:13,catchphrase:"아직 아무도 모르는 보석!",name:"소형주 보물찾기형",description:"관심 밖의 작은 기업에서 가능성을 발굴합니다.",strength:"발견이 맞으면 독보적인 수익을 얻어요",caution:"정보가 적고 변동성이 매우 큽니다",stamp:"TREASURE" },
  { id:"rotation",number:14,catchphrase:"다음 주도주는 이쪽입니다",name:"순환매 철새형",description:"자금이 이동하는 산업을 따라 부지런히 갈아탑니다.",strength:"소외 산업의 반등을 빠르게 잡아내요",caution:"잦은 이동으로 흐름을 엇갈릴 수 있어요",stamp:"ROTATION" },
  { id:"timing",number:15,catchphrase:"사고팔고, 타이밍이 예술!",name:"신의 손 타이밍형",description:"매수와 매도 시점을 절묘하게 맞춘 팀입니다.",strength:"변동을 수익으로 바꾸는 탁월한 감각",caution:"다음 게임에도 신의 손일지는 아무도 몰라요",stamp:"GOD HAND" },
  { id:"fixed",number:16,catchphrase:"샀으면 종 칠 때까지 간다",name:"무념무상 고정형",description:"처음 세운 전략을 끝까지 거의 바꾸지 않습니다.",strength:"소음에 휘둘리지 않는 놀라운 일관성",caution:"상황이 완전히 바뀌어도 그대로일 수 있어요",stamp:"HOLD" },
];

const profile = (id: string) => investorProfiles.find((item) => item.id === id)!;

export function classifyInvestorProfile(m: InvestorMetrics): InvestorProfile {
  const sectors = Math.min(100, Math.max(0, (m.sectorCount - 1) * 20));
  const diversification = Math.min(100, (100 - m.concentration) * .75 + sectors * .25);
  const capBalance = Math.max(0, 100 - Math.abs(m.largeCapShare - m.smallCapShare));
  const gate = (eligible: boolean, bonus = 32) => eligible ? bonus : -bonus;
  const scores: Record<string, number> = {
    "all-in": m.concentration * .8 + (100 - sectors) * .25 + m.leverage * .15 + gate(m.concentration >= 55 && m.sectorCount <= 3),
    steady: (100 - m.volatility) * .45 + m.largeCapShare * .25 + (100 - m.turnover) * .2 + (100 - m.leverage) * .1 + gate(m.volatility <= 45 && m.leverage <= 30),
    textbook: diversification * .55 + capBalance * .2 + (100 - m.volatility) * .15 + (100 - m.leverage) * .1 + gate(m.sectorCount >= 4 && m.concentration <= 40),
    trend: m.newsReaction * .45 + m.turnover * .25 + m.performance * .2 + m.volatility * .1 + gate(m.newsReaction >= 55 && m.performance >= 48),
    value: m.contrarian * .35 + m.holdDuration * .35 + (100 - m.newsReaction) * .2 + (100 - m.leverage) * .1 + gate(m.holdDuration >= 65 && m.contrarian >= 45 && m.newsReaction <= 40 && m.turnover <= 35),
    detective: m.newsReaction * .4 + m.timingScore * .35 + m.profitTaking * .15 + sectors * .1 + gate(m.newsReaction >= 50 && m.timingScore >= 58),
    contrarian: m.contrarian * .55 + m.dipBuying * .2 + m.holdDuration * .15 + (100 - m.newsReaction) * .1 + gate(m.contrarian >= 60),
    panic: m.turnover * .4 + (100 - m.performance) * .35 + (100 - m.holdDuration) * .15 + (100 - m.dipBuying) * .1 + gate(m.turnover >= 45 && m.performance <= 45),
    dip: m.dipBuying * .5 + m.contrarian * .2 + m.holdDuration * .15 + m.leverage * .15 + gate(m.dipBuying >= 58 && m.performance <= 55),
    profit: m.profitTaking * .5 + m.performance * .25 + m.turnover * .15 + m.timingScore * .1 + gate(m.profitTaking >= 60 && m.performance >= 55),
    thrill: m.volatility * .4 + m.smallCapShare * .25 + m.leverage * .25 + m.concentration * .1 + gate(m.volatility >= 70 && (m.smallCapShare >= 45 || m.leverage >= 40)),
    bluechip: m.largeCapShare * .55 + (100 - m.volatility) * .25 + (100 - m.leverage) * .1 + m.holdDuration * .1 + gate(m.largeCapShare >= 65),
    treasure: m.smallCapShare * .5 + m.contrarian * .2 + m.volatility * .15 + (100 - m.concentration) * .15 + gate(m.smallCapShare >= 65),
    rotation: m.turnover * .4 + sectors * .3 + m.newsReaction * .2 + diversification * .1 + gate(m.turnover >= 50 && m.sectorCount >= 4),
    timing: m.timingScore * .45 + m.performance * .3 + m.profitTaking * .15 + m.turnover * .1 + gate(m.timingScore >= 72 && m.performance >= 60),
    fixed: m.holdDuration * .55 + (100 - m.newsReaction) * .2 + (100 - m.turnover) * .15 + (100 - m.leverage) * .1 + gate(m.turnover <= 15),
  };
  return profile(Object.entries(scores).sort((a,b) => b[1] - a[1])[0][0]);
}

export const teamInvestorMetrics: Record<string, InvestorMetrics> = {
  ants:{concentration:92,sectorCount:2,volatility:78,turnover:55,newsReaction:72,contrarian:18,holdDuration:48,dipBuying:52,profitTaking:45,largeCapShare:38,smallCapShare:62,timingScore:67,leverage:40,performance:68},
  value:{concentration:42,sectorCount:5,volatility:26,turnover:18,newsReaction:30,contrarian:72,holdDuration:91,dipBuying:63,profitTaking:26,largeCapShare:82,smallCapShare:18,timingScore:54,leverage:0,performance:58},
  fullbuy:{concentration:58,sectorCount:4,volatility:83,turnover:74,newsReaction:93,contrarian:32,holdDuration:34,dipBuying:40,profitTaking:62,largeCapShare:22,smallCapShare:78,timingScore:86,leverage:80,performance:82},
  cash:{concentration:31,sectorCount:7,volatility:18,turnover:12,newsReaction:21,contrarian:48,holdDuration:88,dipBuying:28,profitTaking:50,largeCapShare:76,smallCapShare:24,timingScore:42,leverage:0,performance:54},
  charts:{concentration:54,sectorCount:5,volatility:62,turnover:91,newsReaction:77,contrarian:44,holdDuration:20,dipBuying:35,profitTaking:75,largeCapShare:46,smallCapShare:54,timingScore:72,leverage:20,performance:47},
  dividend:{concentration:38,sectorCount:6,volatility:20,turnover:8,newsReaction:14,contrarian:57,holdDuration:96,dipBuying:42,profitTaking:18,largeCapShare:88,smallCapShare:12,timingScore:38,leverage:0,performance:43},
};
