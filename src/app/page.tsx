"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, BookOpen, MonitorUp, ShieldCheck, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import { useGame } from "@/components/game-provider";
import { Brand, Button } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const { addTeam, createGame, selectGame, error, loading } = useGame();
  const [panel, setPanel] = useState<"admin" | "team" | "display" | null>(null);
  const [teamName, setTeamName] = useState("");
  const [gameCode, setGameCode] = useState("");

  async function join(event: FormEvent) {
    event.preventDefault();
    if (!await addTeam(teamName,gameCode)) return;
    router.push("/team/game");
  }

  return <main className="landing">
    <header className="landing-top"><Brand/></header>
    <section className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">가상 증권시장 전략 게임</p>
        <h1>뉴스를 읽고,<br/><em>시장을 지배하라.</em></h1>
        <p>팀과 함께 포트폴리오를 설계하고, 매 턴 펼쳐지는 시장의 변화를 가장 먼저 읽어내세요.</p>
        <div className="market-tape"><span>KOSPI <b className="up">▲ 2.14%</b></span><span>KOSDAQ <b className="down">▼ 0.72%</b></span><span>MARKET MOOD <b>GAME READY</b></span></div>
      </div>
      <div className="entry-grid">
        <button className="entry entry-primary" onClick={() => setPanel("team")}><span>01 / PLAYER</span><Users/><strong>팀으로 참가하기</strong><small>팀명만 입력하고 바로 입장</small><ArrowRight className="entry-arrow"/></button>
        <button className="entry" onClick={() => setPanel("admin")}><span>02 / MASTER</span><ShieldCheck/><strong>관리자 게임 만들기</strong><small>팀을 모으고 시장을 개장</small><ArrowRight className="entry-arrow"/></button>
        <button className="entry entry-display" onClick={() => setPanel("display")}><span>03 / LIVE</span><MonitorUp/><strong>프로젝터 조회</strong><small>게임 코드로 바로 보기</small><ArrowRight className="entry-arrow"/></button>
        <Link className="entry" href="/how-to-play"><span>04 / GUIDE</span><BookOpen/><strong>게임 방법</strong><small>4단계로 익히는 시장 규칙</small><ArrowRight className="entry-arrow"/></Link>
      </div>
    </section>

    <section className="steps">
      <div><span>01</span><BarChart3/><h2>포트폴리오 구성</h2><p>최대 8개 종목에 자산 100%를 배분합니다.</p></div>
      <div><span>02</span><BookOpen/><h2>뉴스와 시장 변동</h2><p>헤드라인과 단신 속 연결된 신호를 읽습니다.</p></div>
      <div><span>03</span><MonitorUp/><h2>최종 수익률 경쟁</h2><p>마지막 종이 울릴 때 가장 높은 자산을 지키세요.</p></div>
    </section>

    {panel && <div className="modal-backdrop" onMouseDown={() => setPanel(null)}><section className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
      <button className="modal-close" aria-label="닫기" onClick={() => setPanel(null)}>×</button>
      <p className="eyebrow">{panel === "team" ? "PLAYER ENTRY" : panel === "display" ? "PUBLIC DISPLAY" : "GAME MASTER"}</p>
      <h2>{panel === "team" ? "팀으로 참가하기" : panel === "display" ? "프로젝터 조회" : "새 게임 만들기"}</h2>
      {panel === "team" ? <form onSubmit={join} className="form-stack">
        <label>게임 코드<input value={gameCode} onChange={(e) => setGameCode(e.target.value.toUpperCase())} placeholder="예: A7K9Q2" autoFocus maxLength={6}/></label>
        <label>팀명<input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="예: 여의도 불개미" maxLength={16}/></label>
        {error && <p className="form-error">{error}</p>}
        <Button type="submit" disabled={loading}>대기실 참가 <ArrowRight size={16}/></Button>
        <p className="form-note">관리자에게 받은 6자리 게임 코드와 팀명을 입력하세요.</p>
      </form> : panel === "display" ? <form className="form-stack" onSubmit={async(e)=>{e.preventDefault();if(await selectGame(gameCode))router.push("/display")}}>
        <label>게임 코드<input value={gameCode} onChange={(e)=>setGameCode(e.target.value.toUpperCase())} placeholder="예: A7K9Q2" autoFocus maxLength={6}/></label>
        {error&&<p className="form-error">{error}</p>}
        <Button type="submit" variant="gold" disabled={loading}>조회 화면 열기 <MonitorUp size={16}/></Button>
      </form> : <form className="form-stack" onSubmit={async(e) => {e.preventDefault();const form=new FormData(e.currentTarget);if(await createGame(String(form.get("gameName")),Number(form.get("totalTurns")),Number(form.get("initialBudget")),Number(form.get("minimumTurnover")),Number(form.get("maxTeams"))))router.push("/admin/lobby");}}>
        <label>게임명<input name="gameName" defaultValue="제1회 투자왕 결정전"/></label>
        <div className="form-row"><label>총 턴 수<select name="totalTurns" defaultValue="8">{Array.from({length:16},(_,index)=>index+5).map(value=><option key={value}>{value}</option>)}</select></label><label>최대 팀 수<select name="maxTeams" defaultValue="12">{Array.from({length:11},(_,index)=>index+2).map(value=><option key={value}>{value}</option>)}</select></label></div>
        <label>팀별 초기 지급 예산<select name="initialBudget" defaultValue="100000000"><option value="50000000">5천만 원</option><option value="100000000">1억 원 · 추천</option><option value="200000000">2억 원</option><option value="500000000">5억 원</option></select></label>
        <label>턴별 최소 포트폴리오 변경률<select name="minimumTurnover" defaultValue="20"><option value="10">10% · 가볍게</option><option value="20">20% · 추천</option><option value="30">30% · 적극적</option><option value="40">40% · 역동적</option></select></label>
        {error&&<p className="form-error">{error}</p>}
        <Button type="submit" variant="gold" disabled={loading}>게임 만들기 <ArrowRight size={16}/></Button>
      </form>}
    </section></div>}
  </main>;
}
