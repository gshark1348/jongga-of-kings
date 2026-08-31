"use client";

import { Building2, X } from "lucide-react";
import { useEffect } from "react";
import type { Company } from "@/lib/types";
import { Delta, MiniChart } from "@/components/ui";

export function CompanyDetailPopup({ company, onClose }: { company: Company; onClose: () => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return <div className="company-popup-backdrop" onMouseDown={onClose}>
    <section className="company-popup" role="dialog" aria-modal="true" aria-labelledby="company-popup-title" onMouseDown={(event) => event.stopPropagation()}>
      <button className="company-popup-close" onClick={onClose} aria-label="기업 정보 닫기"><X size={20}/></button>
      <div className="company-popup-photo" style={{backgroundImage:`linear-gradient(90deg,rgba(20,19,17,.12),rgba(20,19,17,.55)),url(${company.imageUrl})`}}>
        <span>{company.imageCredit}</span>
      </div>
      <header className="company-popup-head">
        <div><p className="eyebrow">COMPANY FILE · {company.market} {company.code}</p><h2 id="company-popup-title">{company.name}</h2><p>{company.description}</p></div>
        <div className="company-popup-price"><small>게임 현재가</small><strong>₩{company.price.toLocaleString()}</strong><Delta value={company.change}/></div>
      </header>
      <div className="company-facts">
        <div><small>산업군</small><strong>{company.sector}</strong></div><div><small>시총 등급</small><strong>{company.cap}</strong></div>
        <div><small>설립</small><strong>{company.founded}</strong></div><div><small>임직원</small><strong>{company.employees}</strong></div>
        <div><small>게임 매출</small><strong>₩{company.gameRevenue.toLocaleString()}억</strong></div><div><small>영업이익률</small><strong>{company.gameOperatingMargin}%</strong></div>
      </div>
      <div className="company-popup-bottom"><div><div className="section-heading"><h3>최근 5턴 흐름</h3><span>GAME INDEX</span></div><MiniChart values={company.history}/><a className="company-official-link" href={company.officialWebsite} target="_blank" rel="noreferrer">공식 홈페이지 확인 ↗</a></div><div><div className="section-heading"><h3>시장 성격과 영향 분야</h3><Building2 size={17}/></div><p className="company-tags">{company.traits.map(trait=><span className="tag tag-solid" key={trait}>{trait}</span>)}</p><div className="sensitivity-list">{Object.entries(company.sensitivities).sort((a,b)=>Math.abs(b[1]??0)-Math.abs(a[1]??0)).slice(0,6).map(([factor,value])=><div key={factor}><span>{factor}</span><i><b style={{width:`${Math.min(100,Math.abs(value??0)/2.2*100)}%`}} className={Number(value)>=0?"positive":"negative"}/></i><em>{Number(value)>=0?"수혜":"부담"} {Math.abs(Number(value)).toFixed(2)}</em></div>)}</div><small>같은 뉴스라도 기업별 민감도, 시장 공통 심리, 금리와 기업 고유 변동이 합산되어 서로 다른 등락률이 계산됩니다.</small></div></div>
    </section>
  </div>;
}
