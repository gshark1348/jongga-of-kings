"use client";

import { Maximize, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/game-provider";
import { Brand, Delta } from "@/components/ui";
import { companies } from "@/lib/mock-data";
import { getMarketMood, getNewsIssue } from "@/lib/news-engine";

const modes = ["종합 현황", "뉴스 집중", "랭킹 집중", "시장 현황"] as const;

export default function Display() {
  const { teams, status, turn, totalTurns, gameCode, currentNews } = useGame();
  const router = useRouter();
  const [mode, setMode] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setMode((value) => (value + 1) % modes.length), 10000);
    return () => window.clearInterval(id);
  }, [auto]);
  useEffect(() => { if (status === "finished") router.replace("/results"); }, [router, status]);

  const initialSetup = turn === 1;
  const issue = currentNews?.issue ?? getNewsIssue(gameCode, turn);
  const marketMood = currentNews?.marketMood ?? getMarketMood(gameCode, turn);
  const showNews = mode === 0 || mode === 1;
  const showRanking = mode === 0 || mode === 2;
  const showMarket = mode === 0 || mode === 3;

  if (status === "lobby") return <main className="display-page">
    <div className="display-header"><Brand/><span className="mono">PUBLIC DISPLAY · {gameCode || "NO GAME"}</span></div>
    <section className="display-waiting"><div><p className="eyebrow">OPENING SOON</p><h1>팀 참가를<br/>기다리고 있습니다</h1><div className="display-game-code"><small>GAME CODE</small><strong>{gameCode}</strong></div><p>현재 {teams.length}개 팀이 개장을 준비하고 있습니다.</p></div></section>
    <div className="ticker"><div className="ticker-track"><span>종가의 제왕</span><span>게임 코드와 팀명을 입력하면 즉시 참가 목록에 추가됩니다</span><span>종가의 제왕</span><span>게임 코드와 팀명을 입력하면 즉시 참가 목록에 추가됩니다</span></div></div>
  </main>;

  return <main className={`display-page display-mode-${mode}`}>
    <div className="display-header"><Brand/><div className="display-meta"><span className="live-dot">● LIVE</span><span>GAME {gameCode}</span><span>TURN {turn.toString().padStart(2,"0")} / {totalTurns.toString().padStart(2,"0")}</span><span>{initialSetup?"INITIAL SETUP":`제${turn}턴 조간`}</span></div></div>

    <div className="display-stage">
      {status === "calculating" ? <section className="display-waiting"><div><p className="eyebrow">MARKET CALCULATION</p><h1>시장이 움직이고<br/>있습니다</h1><p>모든 종목에 새로운 이슈의 여파가 반영됩니다.</p></div></section>
      : initialSetup ? <section className="display-waiting preopen-display"><div><p className="eyebrow">INITIAL PORTFOLIO</p><h1>뉴스 공개 전,<br/>첫 전략을 세우는 시간</h1><p>각 팀이 초기 예산을 배분하고 있습니다. 모든 팀이 제출하면 첫 시장 뉴스가 공개됩니다.</p></div><aside className="ranking"><h2>초기 편성 현황</h2>{teams.map(team=><div className="rank-row" key={team.id}><b>{team.rank.toString().padStart(2,"0")}</b><div><strong>{team.name}</strong><small>{team.submitted?"포트폴리오 확정":"편성 중"}</small></div><span className={team.submitted?"up":""}>{team.submitted?"완료":"대기"}</span></div>)}</aside></section>
      : issue && <>
        {(showNews || showRanking) && <section className={`editorial-grid ${showNews&&!showRanking?"news-only":""} ${showRanking&&!showNews?"ranking-only":""}`}>
          {showNews && <div className="newspaper"><div className="newspaper-meta"><span>KOSPI ECONOMIC REVIEW</span><span>MARKET MOOD / {marketMood.label} {marketMood.score}</span></div><div className="display-news-photo" style={{backgroundImage:`linear-gradient(180deg,transparent,rgba(20,19,17,.48)),url(${issue.imageUrl})`}}/><h1 className="news-title">{issue.headline}</h1><div className="brief-grid">{issue.briefs.map((brief,index)=><p key={`${issue.id}-${index}`}><b>{index===0?"파급 신호":"교차 산업"}</b><br/>{brief}</p>)}{currentNews?.companyEvents.map(event=><p key={event.id}><b>{event.companyName}{event.chainStage&&event.chainLength?` · 연속보도 ${event.chainStage}/${event.chainLength}`:""}</b><br/>{event.headline}</p>)}</div>{currentNews?.surpriseEvent&&<div className="notice"><strong>돌발 속보</strong> {currentNews.surpriseEvent.headline}</div>}</div>}
          {showRanking && <aside className="ranking"><h2>실시간 팀 랭킹</h2>{teams.map(team=><div className="rank-row" key={team.id}><b>{team.rank.toString().padStart(2,"0")}</b><div><strong>{team.name}</strong><small>₩{(team.assets/1000000).toFixed(2)}M</small></div><Delta value={team.totalReturn}/></div>)}</aside>}
        </section>}
        {showMarket && <section className="display-market-focus"><div className="market-strip"><div><small>코스피</small><strong className="up">2,874.21 ▲</strong></div><div><small>코스닥</small><strong className="down">912.48 ▼</strong></div><div><small>최고 산업</small><strong className="up">AI +5.90%</strong></div><div><small>시장 심리</small><strong>{marketMood.label} {marketMood.score}</strong></div></div>{mode===3&&<div className="display-market-board">{companies.slice(0,12).map(company=><div key={company.id}><small>{company.code}</small><strong>{company.name}</strong><span>₩{company.price.toLocaleString()}</span><Delta value={company.change}/></div>)}</div>}</section>}
      </>}
    </div>

    {!initialSetup&&<div className="ticker"><div className="ticker-track">{[...companies.slice(0,10),...companies.slice(0,10)].map((company,index)=><span key={`${company.id}-${index}`}>{company.name} ₩{company.price.toLocaleString()} <Delta value={company.change}/></span>)}</div></div>}
    <div className="display-controls"><span>하단 표시</span><button aria-pressed={auto} onClick={()=>setAuto(value=>!value)}>{auto?<Pause size={14}/>:<Play size={14}/>} {auto?"자동 순환 중 · 10초":"자동 순환"}</button>{modes.map((label,index)=><button key={label} aria-pressed={mode===index} onClick={()=>{setMode(index);setAuto(false)}}>{label}</button>)}<button onClick={()=>document.documentElement.requestFullscreen?.()} aria-label="전체화면"><Maximize size={14}/></button></div>
  </main>;
}
