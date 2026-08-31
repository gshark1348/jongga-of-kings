"use client";

import { Newspaper, X } from "lucide-react";
import { useState } from "react";
import type { NewsIssue } from "@/lib/types";
import type { MarketEvent } from "@/lib/event-catalog";
import { getIssueMood } from "@/lib/news-engine";
import { Button } from "./ui";

export function NewsPaperPopup({ issue, turn, autoOpen = true }: { issue: NewsIssue; turn: number; autoOpen?: boolean }) {
  const [open, setOpen] = useState(autoOpen);
  return <>
    <button className="news-trigger" onClick={() => setOpen(true)}><Newspaper size={17}/><span>제{turn}턴 뉴스</span><b>신문 보기</b></button>
    {open && <div className="news-popup-backdrop" role="presentation" onMouseDown={() => setOpen(false)}><section className="news-popup" role="dialog" aria-modal="true" aria-labelledby="turn-headline" onMouseDown={(event) => event.stopPropagation()}>
      <button className="news-popup-close" aria-label="신문 닫기" onClick={() => setOpen(false)}><X size={20}/></button>
      <div className="news-popup-masthead"><span>코스피 경제</span><b>THE CLOSING BELL</b><span>제{turn}턴 조간</span></div>
      <div className="news-popup-meta"><span>MARKET SPECIAL</span><span>시장 심리 · {getIssueMood(issue as MarketEvent)}</span></div>
      <p className="eyebrow">오늘의 헤드라인</p><h2 id="turn-headline">{issue.headline}</h2>
      <figure className="news-hero"><div style={{backgroundImage:`linear-gradient(180deg,transparent 45%,rgba(20,19,17,.65)),url(${issue.imageUrl})`}}/><figcaption>{issue.imageCredit}</figcaption></figure>
      <div className="news-popup-briefs">{issue.briefs.map((brief,index)=><article key={`${issue.id}-${index}`}><small>{index===0?"파급 신호":"교차 산업 단신"} {String(index+1).padStart(2,"0")}</small><strong>{brief}</strong></article>)}</div>
      <footer><span>기사 본문은 제공되지 않습니다. 헤드라인의 연결고리를 추론하세요.</span><Button onClick={() => setOpen(false)}>시장 확인하기</Button></footer>
    </section></div>}
  </>;
}
