"use client";

import Link from "next/link";
import { Crown, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { useGame } from "@/components/game-provider";
import { SiteHeader } from "@/components/site-header";
import { Button, Delta, PageHeader, Shell } from "@/components/ui";
import { classifyInvestorProfile, investorProfiles } from "@/lib/investor-profiles";
import { getNewsSequence } from "@/lib/news-engine";
import { calculateInvestorMetrics } from "@/lib/investor-metrics";
import type { FinalResult, InvestorMetrics, Team } from "@/lib/types";

function localMetrics(team: Team): InvestorMetrics {
  return calculateInvestorMetrics(team.portfolio??[],team.previousPortfolio??[],team.turnoverRate,team.turnReturn,team.totalReturn);
}

function resultFromTeam(team: Team): FinalResult {
  return {
    id: team.id,
    teamName: team.name,
    rank: team.rank,
    assets: team.assets - team.loanBalance - team.accruedInterest,
    totalReturn: team.totalReturn,
    turnReturn: team.turnReturn,
    metrics: localMetrics(team),
  };
}

export default function Results() {
  const { finalResults, teams, status, gameCode, initialBudget, totalTurns, loading, newsHistory } = useGame();
  const results = (finalResults.length ? finalResults : teams.map(resultFromTeam)).toSorted((a, b) => a.rank - b.rank);
  const winner = results[0];
  const issueHistory = newsHistory.length?newsHistory.map(news=>news.issue):getNewsSequence(gameCode, Math.max(0, totalTurns - 1));

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

    <div className="profile-intro"><div><p className="eyebrow">PORTFOLIO PERSONALITY TEST</p><h2>그래서, 우리는 어떤 투자자였을까?</h2><p>최종 포트폴리오 집중도, 변동성, 변경률과 뉴스 반응을 분석했습니다. 수익률과는 별개로 각 팀만의 투자 습관을 확인해보세요.</p></div><Sparkles size={42}/></div>
    <div className="team-profile-grid">{results.map((result,index)=>{const metrics=result.metrics;const profile=classifyInvestorProfile(metrics);return <article className={`team-profile ${index===0?"profile-featured":""}`} key={result.id}>
      <div className="profile-top"><span className="profile-no">TYPE {profile.number.toString().padStart(2,"0")}</span><span className="profile-stamp">{profile.stamp}</span></div>
      <p className="profile-team">{result.rank}위 · {result.teamName}</p><h3><small>“{profile.catchphrase}”</small>{profile.name}</h3><p className="profile-description">{profile.description}</p>
      <div className="profile-notes"><p><ShieldCheck size={15}/><span><b>이 팀의 무기</b>{profile.strength}</span></p><p><TriangleAlert size={15}/><span><b>다음 게임 주의보</b>{profile.caution}</span></p></div>
      <div className="profile-bars"><span>집중력 <i style={{width:`${metrics.concentration}%`}}/></span><span>모험심 <i style={{width:`${metrics.volatility}%`}}/></span><span>뉴스 반응 <i style={{width:`${metrics.newsReaction}%`}}/></span></div>
    </article>})}</div>

    <details className="profile-index"><summary>16가지 투자자 유형 도감 보기 <span>+</span></summary><div className="profile-index-grid">{investorProfiles.map(item=><article key={item.id}><b>{item.number.toString().padStart(2,"0")}</b><div><small>“{item.catchphrase}”</small><strong>{item.name}</strong><p>{item.description}</p></div></article>)}</div></details>

    <div className="section-heading"><h2>이번 게임의 시장 연대기</h2><p>ISSUE CHAIN ARCHIVE</p></div><div>{issueHistory.map((item,index)=><article className="history-row" key={item.id}><b className="number">TURN {index+2}</b><div><h3>{item.headline}</h3><small>{item.impact}</small></div></article>)}</div>
  </Shell></>;
}
