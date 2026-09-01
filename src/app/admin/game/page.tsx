"use client";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/components/game-provider";
import { SiteHeader } from "@/components/site-header";
import { Button, Delta, PageHeader, Shell } from "@/components/ui";
import { sectors, surpriseEvents } from "@/lib/mock-data";
import { getNetAssets } from "@/lib/market-engine";
import { getMarketMood, getNewsIssue, getSectorAttention } from "@/lib/news-engine";

export default function AdminGame(){
  const{teams,turn,nextTurn,minimumTurnover,baseRate,loanRate,activeRateHeadline,error,loading,gameCode,status,currentNews,surpriseUsed}=useGame();
  const router=useRouter();const[selected,setSelected]=useState<string|null>(null);const[confirm,setConfirm]=useState(false);
  const submitted=teams.filter(team=>team.submitted).length;const selectedEvent=surpriseEvents.find(event=>event.id===selected)??null;const firstNewsRelease=turn===1;
  const currentIssue=currentNews?.issue??getNewsIssue(gameCode,turn);const marketMood=currentNews?.marketMood??getMarketMood(gameCode,turn);const attention=currentNews?.sectorAttention??getSectorAttention(teams);
  useEffect(()=>{if(status==="finished")router.replace("/results")},[router,status]);
  return <><SiteHeader admin/><Shell wide>
    <PageHeader eyebrow="GAME MASTER · CONTROL ROOM" title="시장 관제실" description="팀의 선택과 시장의 숨은 흐름을 확인하세요." actions={<Button variant="danger" disabled={loading} onClick={()=>setConfirm(true)}>{firstNewsRelease?"첫 뉴스 공개 및 2턴 시작":"턴 마감 및 다음 뉴스 공개"}<ArrowRight size={16}/></Button>}/>
    {error&&<div className="notice" role="alert"><strong>진행 오류:</strong> {error}</div>}
    <div className="rate-banner"><div><span className="mono">RATE WATCH</span><strong>{activeRateHeadline}</strong></div><div><small>기준금리</small><b>{baseRate.toFixed(2)}%</b></div><div><small>은행 대출금리</small><b>{loanRate.toFixed(2)}%</b></div></div>
    <div className="metric-grid"><div className="metric"><span>포트폴리오 제출</span><strong>{submitted} / {teams.length}</strong></div><div className="metric"><span>시장 심리</span><strong>{marketMood.label} {marketMood.score}</strong></div><div className="metric"><span>총 대출 잔액</span><strong>₩{(teams.reduce((sum,team)=>sum+team.loanBalance,0)/1_000_000).toFixed(0)}M</strong></div><div className="metric"><span>돌발 이슈</span><strong>{surpriseUsed} / 2</strong></div></div>
    <div className="section-heading"><h2>팀 현황</h2><p>TURN {turn.toString().padStart(2,"0")} · 최소 변경률 {minimumTurnover}%</p></div>
    <div className="table-scroll"><table className="data-table"><thead><tr><th>순위</th><th>팀명</th><th>순자산</th><th>대출·이자</th><th>누적 수익률</th><th>변경률</th><th>주요 산업</th><th>제출</th></tr></thead><tbody>{teams.map(team=><tr key={team.id}><td className="rank-number">{team.rank.toString().padStart(2,"0")}</td><td><strong>{team.name}</strong></td><td className="number">₩{getNetAssets(team).toLocaleString()}</td><td className="number">₩{((team.loanBalance+team.accruedInterest)/1_000_000).toFixed(2)}M</td><td><Delta value={team.totalReturn}/></td><td><strong className={turn===1||team.turnoverRate>=minimumTurnover?"up":"down"}>{turn===1?"첫 턴 면제":`${team.turnoverRate}%`}</strong></td><td><span className="tag">{team.focus}</span></td><td>{team.submitted?<span className="tag tag-solid"><Check size={11}/> 완료</span>:<span className="tag">대기</span>}</td></tr>)}</tbody></table></div>
    <div className="admin-grid"><section><div className="section-heading"><h2>시장 집중도</h2><p>팀 포트폴리오 실제 합산</p></div><div className="analysis-bars">{sectors.map(sector=>{const width=attention[sector]??0;return <div className="bar-row" key={sector}><span>{sector}</span><div className="bar-track"><div className="bar-fill" style={{width:`${Math.min(100,width*3)}%`}}/></div><b className="number">{width.toFixed(1)}%</b></div>})}</div><div className="notice"><strong>시스템 관측:</strong> 비중 18% 이상 산업은 과열·병목·조정 사건 확률이 높아지고, 5% 이하 산업은 확산·회복 확률이 높아집니다.</div></section><section><div className="section-heading"><h2>확정 자동 이슈</h2><p>서버 뉴스판</p></div><div style={{padding:"24px 0"}}><p className="eyebrow">{turn===1?"PRE-OPEN / LOCKED":"EVENT CHAIN / PERSISTED"}</p><h3 style={{fontFamily:"var(--font-noto-serif-kr)",fontSize:25}}>{currentIssue?.internalName??"첫 포트폴리오 편성 중"}</h3><p>{currentIssue?.impact??"초기 포트폴리오 확정 후 첫 뉴스가 서버에 저장됩니다."}</p></div></section></div>
    <div className="section-heading"><h2>관리자 돌발 이슈</h2><p>{surpriseUsed}회 사용 · 최대 2회 · 한 턴 1회</p></div><div className="event-list">{surpriseEvents.map(event=><button key={event.id} disabled={firstNewsRelease||surpriseUsed>=2} className={`event-card ${selected===event.id?"selected":""}`} onClick={()=>setSelected(selected===event.id?null:event.id)}><span>{event.category}</span><strong>{event.headline}</strong><small>{event.impact}</small></button>)}</div>
    {confirm&&<div className="modal-backdrop"><section className="modal"><button className="modal-close" onClick={()=>setConfirm(false)}>×</button><AlertTriangle color="var(--burgundy)"/><h2>{firstNewsRelease?"첫 뉴스를 공개할까요?":"현재 턴을 마감할까요?"}</h2><div className="notice">미제출 팀 {teams.length-submitted}개{selectedEvent&&!firstNewsRelease?` · 돌발 이슈 “${selectedEvent.headline}” 적용`:""}</div><p>{firstNewsRelease?"팀 포트폴리오 집중도를 분석해 첫 뉴스와 기업 단신 2개를 확정 저장합니다.":"수익률 계산 후 다음 뉴스가 모든 화면에 동일하게 공개됩니다."}</p><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Button variant="paper" onClick={()=>setConfirm(false)}>취소</Button><Button variant="danger" disabled={loading} onClick={()=>{void nextTurn(firstNewsRelease?null:selectedEvent);setConfirm(false);setSelected(null)}}>{firstNewsRelease?"뉴스 공개":"턴 마감"}</Button></div></section></div>}
  </Shell></>;
}
