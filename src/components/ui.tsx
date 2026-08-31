import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="brand" aria-label="종가의 제왕 홈">
    <span className="brand-mark">終</span>
    <span><strong>종가의 제왕</strong>{!compact && <small>THE CLOSING BELL</small>}</span>
  </Link>;
}

export function Button({ className = "", variant = "ink", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "ink" | "paper" | "danger" | "gold" }) {
  return <button className={`button button-${variant} ${className}`} {...props} />;
}

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <main className={`shell ${wide ? "shell-wide" : ""}`}>{children}</main>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description?: string; actions?: ReactNode }) {
  return <header className="page-header">
    <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="lede">{description}</p>}</div>
    {actions && <div className="header-actions">{actions}</div>}
  </header>;
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value > 0;
  return <span className={up ? "up" : "down"}>{up ? "▲" : "▼"} {up ? "+" : ""}{value.toFixed(2)}{suffix}</span>;
}

export function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values); const min = Math.min(...values); const range = max - min || 1;
  const points = values.map((value, index) => `${index * 25},${30 - ((value - min) / range) * 26}`).join(" ");
  const up = values.at(-1)! >= values[0];
  return <svg className={`mini-chart ${up ? "chart-up" : "chart-down"}`} viewBox="0 0 100 34" role="img" aria-label="최근 5턴 가격 추이"><polyline points={points} fill="none" vectorEffect="non-scaling-stroke" /></svg>;
}
