"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown, GitBranch, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { useGame } from "@/components/game-provider";
import { SiteHeader } from "@/components/site-header";
import { Button, Delta, PageHeader, Shell } from "@/components/ui";
import { classifyInvestorProfile, investorProfiles } from "@/lib/investor-profiles";
import { getNewsSequence } from "@/lib/news-engine";
import { calculateInvestorMetrics } from "@/lib/investor-metrics";
import type { FinalResult, InvestorMetrics, MarketFactor, PersistedNews, Team } from "@/lib/types";

const characterBasePath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/investor-characters`;

function characterImage(profile: { id: string; number: number }) {
  return `${characterBasePath}/${profile.number.toString().padStart(2, "0")}-${profile.id}.png`;
}

function localMetrics(team: Team, initialBudget: number): InvestorMetrics {
  return calculateInvestorMetrics(team.portfolio??[],team.previousPortfolio??[],team.turnoverRate,team.turnReturn,team.totalReturn,team.loanBalance,initialBudget);
}

function resultFromTeam(team: Team, initialBudget: number): FinalResult {
  return {
    id: team.id,
    teamName: team.name,
    rank: team.rank,
    assets: team.assets - team.loanBalance - team.accruedInterest,
    totalReturn: team.totalReturn,
    turnReturn: team.turnReturn,
    metrics: localMetrics(team, initialBudget),
  };
}

type StoryIssue = PersistedNews["issue"] & { sector?: string; phase?: string; successors?: string[] };

const factorLabels: Record<MarketFactor,string> = {
  AI수요:"AI 투자심리", 반도체공급:"반도체 공급", 금리:"금리", 원달러환율:"환율", 유가:"국제유가",
  원자재:"원자재", 소비심리:"소비심리", 정부정책:"정책", 규제:"규제", 임상성과:"임상성과",
  수출경기:"수출경기", 전력수요:"전력수요", 운임:"운임", 외국인수급:"외국인 수급", 시장공포:"시장공포",
};

function importantFactors(issue: PersistedNews["issue"]) {
  return (Object.entries(issue.factors) as [MarketFactor,number][]).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3);
}

function connectionLabel(current: StoryIssue, next: StoryIssue) {
  const shared=(Object.keys(current.factors) as MarketFactor[]).filter(factor=>factor in next.factors).sort((a,b)=>Math.abs(Number(next.factors[b]??0))-Math.abs(Number(next.factors[a]??0)));
  if(current.successors?.includes(next.id))return {kind:"직접 후속",detail:shared.slice(0,2).map(factor=>factorLabels[factor]).join(" · ")||"숨은 시장 상태 계승"};
  if(shared.length)return {kind:current.sector&&next.sector&&current.sector!==next.sector?"교차 산업 전이":"시장 심리 전이",detail:shared.slice(0,2).map(factor=>factorLabels[factor]).join(" · ")};
  return {kind:"시장 상태 누적",detail:"유동성 · 위험선호 변화"};
}

export default function Results() {
  const { finalResults, teams, status, gameCode, initialBudget, totalTurns, loading, newsHistory } = useGame();
  const results = (finalResults.length ? finalResults : teams.map(team=>resultFromTeam(team,initialBudget))).toSorted((a, b) => a.rank - b.rank);
  const winner = results[0];
  const issueHistory = newsHistory.length?newsHistory.map(news=>news.issue):getNewsSequence(gameCode, Math.max(0, totalTurns - 1));
  const storyHistory: PersistedNews[] = newsHistory.length?newsHistory:issueHistory.map((issue,index)=>({turn:index+2,issue,companyEvents:[],surpriseEvent:null,marketMood:{label:"중립",score:50},sectorAttention:{}}));

  if (loading && !winner) {
    return <><SiteHeader/><Shell><section className="portfolio-locked"><p className="eyebrow">FINAL CLEARING</p><h1>최종 장부를 불러오고 있습니다</h1></section></Shell></>;
  }

  if (status !== "finished" || !winner) {
    return <><SiteHeader/><Shell><section className="portfolio-locked"><p className="eyebrow">MARKET STILL OPEN</p><h1>아직 확정된 결과가 없습니다</h1><p>마지막 턴이 종료되면 실제 참가 팀의 최종 순위와 투자자 유형이 이곳에 표시됩니다.</p><Link href="/"><Button variant="paper">시작 화면으로</Button></Link></section></Shell></>;
  }

  return <><SiteHeader/><Shell>
    <PageHeader eyebrow={`MARKET CLOSED · ${gameCode}`} title="최종 종이 울렸습니다" description={`${totalTurns}턴 동안 진행된 실제 게임의 최종 결과입니다.`} actions={<Link href="/"><Button variant="paper"><RotateCcw size={15}/> 새 게임</Button></Link>}/>
    <section className="winner"><Crown size={38}/><p className="eyebrow">WINNER · RETURN {winner.totalReturn>=0?"+":""}{winner.totalReturn.toFixed(2)}%</p><h2>{winner.teamName}</h2><p>최종 순자산 ₩{winner.assets.toLocaleString()}</p></section>

    <div className="section-heading"><h2>최종 순위</h2><p>초기 자산 ₩{initialBudget.toLocaleString()}</p></div>
    <div className="table-scroll"><table className="data-table"><thead><tr><th>순위</th><th>팀명</th><th>최종 순자산</th><th>누적 수익률</th><th>마지막 턴</th><th>투자자 유형</th></tr></thead><tbody>{results.map(result=>{const profile=classifyInvestorProfile(result.metrics);return <tr key={result.id}><td className="rank-number">{result.rank.toString().padStart(2,"0")}</td><td><strong>{result.teamName}</strong></td><td className="number">₩{result.assets.toLocaleString()}</td><td><Delta value={result.totalReturn}/></td><td><Delta value={result.turnReturn}/></td><td>{profile.name}</td></tr>})}</tbody></table></div>

    <div className="profile-intro"><div><p className="eyebrow">PORTFOLIO PERSONALITY TEST</p><h2>그래서, 우리는 어떤 투자자였을까?</h2><p>종목·산업 집중도, 회전율, 시가총액 성향, 수익 대응과 대출 활용을 함께 분석했습니다. 최종 순위와는 별개로 각 팀이 실제로 선택한 전략을 확인해보세요.</p></div><Sparkles size={42}/></div>
    <div className="team-profile-grid">{results.map((result,index)=>{const metrics=result.metrics;const profile=classifyInvestorProfile(metrics);return <article className={`team-profile ${index===0?"profile-featured":""}`} key={result.id}>
      <div className="profile-top"><span className="profile-no">TYPE {profile.number.toString().padStart(2,"0")}</span><span className="profile-stamp">{profile.stamp}</span></div>
      <div className="profile-character"><Image src={characterImage(profile)} alt={`${profile.name} 투자자 캐릭터`} fill sizes="(max-width: 620px) 100vw, 50vw" unoptimized/></div>
      <p className="profile-team">{result.rank}위 · {result.teamName}</p><h3><small>“{profile.catchphrase}”</small>{profile.name}</h3><p className="profile-description">{profile.description}</p>
      <div className="profile-notes"><p><ShieldCheck size={15}/><span><b>이 팀의 무기</b>{profile.strength}</span></p><p><TriangleAlert size={15}/><span><b>다음 게임 주의보</b>{profile.caution}</span></p></div>
      <div className="profile-bars"><span>집중력 <i style={{width:`${metrics.concentration}%`}}/></span><span>모험심 <i style={{width:`${metrics.volatility}%`}}/></span><span>뉴스 반응 <i style={{width:`${metrics.newsReaction}%`}}/></span></div>
    </article>})}</div>

    <details className="profile-index"><summary>16가지 투자자 유형 도감 보기 <span>+</span></summary><div className="profile-index-grid">{investorProfiles.map(item=><article key={item.id}><div className="profile-index-character"><Image src={characterImage(item)} alt="" fill sizes="(max-width: 620px) 34vw, (max-width: 900px) 18vw, 11vw" unoptimized/><b>{item.number.toString().padStart(2,"0")}</b></div><div><small>“{item.catchphrase}”</small><strong>{item.name}</strong><p>{item.description}</p></div></article>)}</div></details>

    <div className="section-heading"><h2>이번 게임의 시장 연대기</h2><p>ISSUE CHAIN ARCHIVE</p></div><div>{issueHistory.map((item,index)=><article className="history-row" key={item.id}><b className="number">TURN {index+2}</b><div><h3>{item.headline}</h3><small>{item.impact}</small></div></article>)}</div>

    <section className="market-causality"><div className="market-causality-head"><div><p className="eyebrow">MARKET CAUSALITY MAP</p><h2>사건은 어떻게 다음 사건이 되었나</h2><p>헤드라인의 핵심 신호가 심리와 산업을 건너 다음 턴에 이어진 실제 게임의 인과 흐름입니다.</p></div><GitBranch size={35}/></div>
      <div className="causality-legend"><span><i className="positive"/> 시장에 긍정 압력</span><span><i className="negative"/> 시장에 부정 압력</span><span><b>→</b> 다음 턴으로 이어진 신호</span></div>
      <div className="causality-scroll"><div className="causality-track">{storyHistory.map((news,index)=>{const issue=news.issue as StoryIssue;const next=storyHistory[index+1]?.issue as StoryIssue|undefined;const connection=next?connectionLabel(issue,next):null;return <div className="causality-unit" key={`${news.turn}-${issue.id}`}><article className="causality-node">
        <div className="causality-node-meta"><b>TURN {news.turn.toString().padStart(2,"0")}</b><span>{issue.sector??"전 시장"} · {news.marketMood.label}</span></div>
        <h3>{issue.headline}</h3>
        {news.surpriseEvent&&<p className="causality-surprise"><TriangleAlert size={13}/><span><b>관리자 돌발 이슈</b>{news.surpriseEvent.headline}</span></p>}
        <div className="causality-factors">{importantFactors(issue).map(([factor,value])=><span className={value>=0?"positive":"negative"} key={factor}>{value>=0?"▲":"▼"} {factorLabels[factor]}</span>)}</div>
        <p className="causality-impact"><b>시장 파급</b>{issue.impact}</p>
        {news.companyEvents.length>0&&<div className="causality-company"><small>기업 단신으로 구체화</small>{news.companyEvents.slice(0,2).map(event=><p key={event.id}><b>{event.companyName}</b>{event.headline}</p>)}</div>}
      </article>{connection&&<div className="causality-link"><span>{connection.kind}</span><ArrowRight size={22}/><small>{connection.detail}</small></div>}</div>})}</div></div>
      <p className="causality-note">※ 연결선은 실제 선택된 이벤트의 지정 후속 관계와 공통 시장 요인을 우선 사용합니다. 직접 연결이 없을 때에는 이전 턴이 남긴 숨은 시장 상태와 위험선호 변화를 표시합니다.</p>
    </section>
  </Shell></>;
}
