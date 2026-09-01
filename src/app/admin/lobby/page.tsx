"use client";
import Link from "next/link";
import { Copy, MonitorUp, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGame } from "@/components/game-provider";
import { SiteHeader } from "@/components/site-header";
import { Button, PageHeader, Shell } from "@/components/ui";

export default function AdminLobby() {
  const { teams, startGame, gameCode, initialBudget, maxTeams, connectionMode, error } = useGame(); const router = useRouter(); const [copied,setCopied]=useState(false); const slots=Array.from({length:Math.max(0,maxTeams-teams.length)});
  return <><SiteHeader admin/><Shell><PageHeader eyebrow="GAME MASTER · LOBBY" title="개장 준비실" description="팀들이 모이면 관리자가 시장의 문을 엽니다." actions={<Link href="/display" target="_blank" rel="noopener noreferrer"><Button variant="paper"><MonitorUp size={16}/> 프로젝터 열기</Button></Link>}/>
  {error&&<p className="notice" role="alert">{error}</p>}<div className="metric-grid"><div className="metric"><span>게임 코드 {copied&&"· 복사됨"}</span><strong>{gameCode||"------"}</strong> <button aria-label="코드 복사" onClick={()=>{navigator.clipboard?.writeText(gameCode);setCopied(true)}}><Copy size={14}/></button></div><div className="metric"><span>초기 지급 예산</span><strong>₩{(initialBudget/100000000).toFixed(initialBudget<100000000?1:0)}억</strong></div><div className="metric"><span>연결 상태</span><strong>{connectionMode==="supabase"?"SUPABASE":"LOCAL"}</strong></div><div className="metric"><span>참가 현황</span><strong>{teams.length} / {maxTeams}</strong></div></div>
  <div className="section-heading"><h2>참가 팀</h2><p>팀명 입력 즉시 이 목록과 조회 화면에 반영됩니다.</p></div><div className="lobby-list">{teams.map((team,index)=><div className="lobby-team" key={team.id}><div><small className="mono">TEAM {(index+1).toString().padStart(2,"0")}</small><strong style={{display:"block",marginTop:7}}>{team.name}</strong></div><span className="waiting-dot"/></div>)}{slots.map((_,index)=><div className="lobby-team empty-team" key={index}>참가자를 기다리는 중…</div>)}</div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,marginTop:28}}><p className="notice">최소 2개 팀이 참가하면 게임을 시작할 수 있습니다. 시작 후 참가 팀은 변경할 수 없습니다.</p><Button disabled={teams.length<2} variant="danger" onClick={async()=>{await startGame();router.push("/admin/game")}}>게임 시작 <Play size={16}/></Button></div></Shell></>;
}
