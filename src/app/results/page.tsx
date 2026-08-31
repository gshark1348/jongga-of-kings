import Link from "next/link";
import { Crown, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button, Delta, PageHeader, Shell } from "@/components/ui";
import { news, teams } from "@/lib/mock-data";
import { classifyInvestorProfile, investorProfiles, teamInvestorMetrics } from "@/lib/investor-profiles";

export default function Results() {
  return <><SiteHeader/><Shell>
    <PageHeader eyebrow="MARKET CLOSED · FINAL" title="최종 종이 울렸습니다" description="제1회 투자왕 결정전의 최종 결과입니다." actions={<Link href="/"><Button variant="paper"><RotateCcw size={15}/> 새 게임</Button></Link>}/>
    <section className="winner"><Crown size={38}/><p className="eyebrow">WINNER · RETURN +18.42%</p><h2>여의도 불개미</h2><p>최종 자산 ₩118,420,000</p></section>

    <div className="section-heading"><h2>최종 순위</h2><p>초기 자산 ₩100,000,000</p></div>
    <div className="table-scroll"><table className="data-table"><thead><tr><th>순위</th><th>팀명</th><th>최종 자산</th><th>누적 수익률</th><th>최고 턴</th><th>최대 손실</th></tr></thead><tbody>{teams.map(team=><tr key={team.id}><td className="rank-number">{team.rank.toString().padStart(2,"0")}</td><td><strong>{team.name}</strong></td><td className="number">₩{team.assets.toLocaleString()}</td><td><Delta value={team.totalReturn}/></td><td className="up">+{Math.max(team.turnReturn,2.14).toFixed(2)}%</td><td className="down">-{Math.abs(Math.min(team.turnReturn,-1.24)).toFixed(2)}%</td></tr>)}</tbody></table></div>

    <div className="profile-intro"><div><p className="eyebrow">PORTFOLIO PERSONALITY TEST</p><h2>그래서, 우리는 어떤 투자자였을까?</h2><p>8개 턴 동안의 집중도, 분산, 위험 선호, 매매 빈도와 뉴스 반응을 분석했습니다. 수익률과는 별개로 각 팀만의 투자 습관을 유쾌하게 확인해보세요.</p></div><Sparkles size={42}/></div>
    <div className="team-profile-grid">{teams.map((team,index)=>{const metrics=teamInvestorMetrics[team.id] ?? teamInvestorMetrics.ants;const result=classifyInvestorProfile(metrics);return <article className={`team-profile ${index===0?"profile-featured":""}`} key={team.id}>
      <div className="profile-top"><span className="profile-no">TYPE {result.number.toString().padStart(2,"0")}</span><span className="profile-stamp">{result.stamp}</span></div>
      <p className="profile-team">{team.rank}위 · {team.name}</p><h3><small>“{result.catchphrase}”</small>{result.name}</h3><p className="profile-description">{result.description}</p>
      <div className="profile-notes"><p><ShieldCheck size={15}/><span><b>이 팀의 무기</b>{result.strength}</span></p><p><TriangleAlert size={15}/><span><b>다음 게임 주의보</b>{result.caution}</span></p></div>
      <div className="profile-bars"><span>집중력 <i style={{width:`${metrics.concentration}%`}}/></span><span>모험심 <i style={{width:`${metrics.volatility}%`}}/></span><span>뉴스 반응 <i style={{width:`${metrics.newsReaction}%`}}/></span></div>
    </article>})}</div>

    <details className="profile-index"><summary>16가지 투자자 유형 도감 보기 <span>+</span></summary><div className="profile-index-grid">{investorProfiles.map(item=><article key={item.id}><b>{item.number.toString().padStart(2,"0")}</b><div><small>“{item.catchphrase}”</small><strong>{item.name}</strong><p>{item.description}</p></div></article>)}</div></details>

    <div className="section-heading"><h2>이번 게임의 시장 연대기</h2><p>ISSUE CHAIN ARCHIVE</p></div><div>{news.map((item,index)=><article className="history-row" key={item.id}><b className="number">TURN {index+1}</b><div><h3>{item.headline}</h3><small>{item.impact}</small></div></article>)}</div>
  </Shell></>;
}
