"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Brand } from "./ui";
import { useGame } from "./game-provider";

export function SiteHeader({ admin = false }: { admin?: boolean }) {
  const { status, turn, totalTurns, gameCode } = useGame();
  return <div className="site-header">
    <Brand compact />
    <div className="site-meta">
      {gameCode&&<span className="mono">GAME {gameCode}</span>}<span className="mono">TURN {turn.toString().padStart(2,"0")} / {totalTurns.toString().padStart(2,"0")}</span>
      <span className={`status status-${status}`}>{status === "lobby" ? "참가 대기" : status === "calculating" ? "시장 계산 중" : status === "finished" ? "게임 종료" : turn===1 ? "초기 편성 중" : "장 진행 중"}</span>
      {admin && <Link href="/display" className="text-link">프로젝터 <ExternalLink size={14}/></Link>}
    </div>
  </div>;
}
