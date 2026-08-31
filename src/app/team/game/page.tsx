"use client";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Landmark,
  Newspaper,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useGame } from "@/components/game-provider";
import { NewsPaperPopup } from "@/components/news-paper-popup";
import { SiteHeader } from "@/components/site-header";
import { Button, Delta, Shell } from "@/components/ui";
import { companies, sectorPerformance, sectors } from "@/lib/mock-data";
import { getNewsIssue } from "@/lib/news-engine";
import {
  BANK_NAME,
  getBorrowingLimit,
  getNetAssets,
} from "@/lib/market-engine";

export default function TeamGame() {
  const {
    initialBudget,
    turn,
    teams,
    currentTeam,
    currentPortfolio,
    loanRate,
    baseRate,
    activeRateHeadline,
    borrow,
    repay,
    status,
    gameCode,
  } = useGame();
  const [loanAmount, setLoanAmount] = useState(10000000);
  const initialSetup = turn === 1;
  const issue = getNewsIssue(gameCode, turn);
  if (!currentTeam)
    return (
      <>
        <SiteHeader />
        <Shell>
          <div className="opening-brief">
            <strong>팀 정보를 불러올 수 없습니다.</strong>
            <p>팀으로 참가했던 브라우저에서 다시 접속해주세요.</p>
            <Link href="/">참가 화면으로 이동</Link>
          </div>
        </Shell>
      </>
    );
  const team = currentTeam;
  const loanLimit = getBorrowingLimit(initialBudget, team.loanBalance);
  const positions = currentPortfolio.length
    ? currentPortfolio
    : [
        { companyId: "samsung-electronics", weight: 40 },
        { companyId: "sk-hynix", weight: 35 },
        { companyId: "ecopro-bm", weight: 25 },
      ];
  if (status === "lobby")
    return (
      <>
        <SiteHeader />
        <Shell wide>
          <section className="team-waiting-hero">
            <div>
              <p className="eyebrow">TEAM ENTRY COMPLETE · {team.name}</p>
              <h1>
                관리자가 시장을 열 때까지
                <br />
                게임 흐름을 익혀두세요.
              </h1>
              <div className="waiting-game-code">
                <small>GAME CODE · 함께 참가할 팀에게 공유하세요</small>
                <strong>{gameCode}</strong>
              </div>
              <p>
                현재 {teams.length}개 팀이 참가했습니다. 게임 시작 전에는
                포트폴리오 편성, 대출, 시장 뉴스가 모두 잠겨 있습니다.
              </p>
            </div>
            <div className="waiting-ticket">
              <Clock3 size={22} />
              <small>GAME STATUS</small>
              <strong>개장 대기 중</strong>
              <span>관리자 시작 신호를 기다립니다</span>
            </div>
          </section>
          <div className="waiting-progress">
            <div>
              <span>01</span>
              <b>팀 참가</b>
              <em>완료</em>
            </div>
            <div className="active">
              <span>02</span>
              <b>규칙 확인</b>
              <em>현재 단계</em>
            </div>
            <div>
              <span>03</span>
              <b>초기 포트폴리오</b>
              <em>게임 시작 후</em>
            </div>
            <div>
              <span>04</span>
              <b>뉴스와 시장</b>
              <em>2턴부터</em>
            </div>
          </div>
          <section className="waiting-guide">
            <article>
              <BookOpen />
              <small>STEP 01</small>
              <h2>초기 포트폴리오 편성</h2>
              <p>
                관리자가 게임을 시작하면 초기 예산을 1~8개 기업에 배분합니다.
                비중 합계는 정확히 100%여야 합니다. 첫 편성에는 최소 변경률이
                적용되지 않습니다.
              </p>
            </article>
            <article>
              <Newspaper />
              <small>STEP 02</small>
              <h2>헤드라인 읽기</h2>
              <p>
                초기 편성이 끝난 뒤부터 매 턴 시장 헤드라인과 기업 단신 2개가
                공개됩니다. 기사 본문은 없으므로 산업 간 연결고리를 팀원들과
                추론해야 합니다.
              </p>
            </article>
            <article>
              <TrendingUp />
              <small>STEP 03</small>
              <h2>포트폴리오 재조정</h2>
              <p>
                뉴스 공개 후 정해진 최소 변경률 이상 비중을 바꿔 제출합니다.
                미제출 상태로 턴이 마감되면 직전 포트폴리오가 그대로 유지됩니다.
              </p>
            </article>
            <article>
              <Landmark />
              <small>STEP 04</small>
              <h2>대출과 최종 순자산</h2>
              <p>
                종가중앙은행에서 초기 예산의 50%까지 빌릴 수 있습니다. 금리는
                시장 기준금리에 따라 변하고, 원금과 누적 이자는 최종 평가액에서
                차감됩니다.
              </p>
            </article>
          </section>
          <section className="waiting-rules">
            <div>
              <ShieldCheck />
              <div>
                <h2>승리 조건</h2>
                <p>
                  마지막 턴 종료 시 투자 평가액에서 대출 원금과 미납 이자를
                  차감한 순자산이 가장 높은 팀이 승리합니다.
                </p>
              </div>
            </div>
            <ul>
              <li>상승은 적색 ▲, 하락은 청색 ▼로 표시됩니다.</li>
              <li>모든 종목은 매 턴 크거나 작은 영향을 받습니다.</li>
              <li>관리자 돌발 이슈는 자동 뉴스와 함께 반영될 수 있습니다.</li>
              <li>게임 종료 후 팀별 포트폴리오와 대출 원장은 삭제됩니다.</li>
            </ul>
          </section>
        </Shell>
      </>
    );
  return (
    <>
      <SiteHeader />
      <Shell wide>
        <div className="team-console-head">
          <div>
            <p className="eyebrow">TEAM · {team.name}</p>
            <h1>
              {initialSetup ? "첫 포트폴리오를 준비하세요" : "우리 팀의 장부"}
            </h1>
          </div>
          <div className="header-actions">
            {issue && (
              <NewsPaperPopup key={issue.id} issue={issue} turn={turn} />
            )}
            <Link href="/team/portfolio">
              <Button>
                {initialSetup ? "초기 포트폴리오 구성" : "포트폴리오 수정"}{" "}
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
        {initialSetup && (
          <div className="opening-brief">
            <span className="mono">BEFORE THE OPENING BELL</span>
            <strong>아직 시장 뉴스가 없습니다.</strong>
            <p>
              초기 예산을 1~8개 기업에 100% 배분하세요. 모든 팀이 제출하면 첫
              뉴스와 함께 시장이 움직입니다.
            </p>
          </div>
        )}
        <div className="compact-metrics">
          <div>
            <span>투자 평가액</span>
            <strong>₩{(team.assets / 1000000).toFixed(2)}M</strong>
          </div>
          <div>
            <span>대출·미납이자</span>
            <strong className="down">
              -₩
              {((team.loanBalance + team.accruedInterest) / 1000000).toFixed(2)}
              M
            </strong>
          </div>
          <div>
            <span>순자산</span>
            <strong>₩{(getNetAssets(team) / 1000000).toFixed(2)}M</strong>
          </div>
          <div>
            <span>현재 순위</span>
            <strong>
              {team.rank.toString().padStart(2, "0")} /{" "}
              {teams.length.toString().padStart(2, "0")}
            </strong>
          </div>
          <div>
            <span>제출 상태</span>
            <strong className={team.submitted ? "status-ready" : "down"}>
              {team.submitted ? "확정 완료" : "편성 중"}
            </strong>
          </div>
        </div>
        <section className="bank-desk">
          <div className="bank-title">
            <Landmark size={19} />
            <div>
              <small>ONE BANK · TURN LOAN</small>
              <strong>{BANK_NAME}</strong>
            </div>
          </div>
          <div className="rate-quote">
            <span>
              기준금리 <b>{baseRate.toFixed(2)}%</b>
            </span>
            <span>
              대출금리 <b>{loanRate.toFixed(2)}%</b>
            </span>
            <small>{activeRateHeadline}</small>
          </div>
          <label>
            <span>거래 금액</span>
            <select
              value={loanAmount}
              onChange={(event) => setLoanAmount(Number(event.target.value))}
            >
              <option value="5000000">500만원</option>
              <option value="10000000">1,000만원</option>
              <option value="20000000">2,000만원</option>
            </select>
          </label>
          <div className="bank-actions">
            <Button
              variant="gold"
              disabled={loanAmount > loanLimit}
              onClick={() => void borrow(team.id, loanAmount)}
            >
              대출 실행
            </Button>
            <Button
              variant="paper"
              disabled={team.loanBalance + team.accruedInterest === 0}
              onClick={() =>
                void repay(
                  team.id,
                  Math.min(loanAmount, team.loanBalance + team.accruedInterest),
                )
              }
            >
              상환
            </Button>
          </div>
          <p>
            한도 ₩{(loanLimit / 1000000).toFixed(0)}M · 매 턴 이자 부과 · 최종
            순자산에서 원금과 이자 차감
          </p>
        </section>
        <div className="team-console-grid">
          <section className="compact-panel portfolio-panel">
            <div className="compact-panel-head">
              <div>
                <p className="eyebrow">PORTFOLIO</p>
                <h2>내 포트폴리오</h2>
              </div>
              <span>
                배분 합계{" "}
                {positions.reduce((sum, item) => sum + item.weight, 0)}%
              </span>
            </div>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>기업</th>
                  <th>비중</th>
                  <th>현재가</th>
                  <th>등락</th>
                  <th>평가금액</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const company = companies.find(
                    (item) => item.id === position.companyId,
                  );
                  if (!company) return null;
                  return (
                    <tr key={company.id}>
                      <td>
                        <strong>{company.name}</strong>
                        <small>{company.sector}</small>
                      </td>
                      <td className="number">{position.weight}%</td>
                      <td className="number">
                        ₩{company.price.toLocaleString()}
                      </td>
                      <td>
                        <Delta value={company.change} />
                      </td>
                      <td className="number">
                        ₩
                        {(
                          (team.assets * position.weight) /
                          100 /
                          1000000
                        ).toFixed(2)}
                        M
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="allocation-line">
              {positions.map((position) => (
                <i
                  key={position.companyId}
                  style={{ width: `${position.weight}%` }}
                />
              ))}
            </div>
          </section>
          <aside className="compact-panel market-panel">
            <div className="compact-panel-head">
              <div>
                <p className="eyebrow">MARKET NOW</p>
                <h2>시장 현황</h2>
              </div>
              <span>TURN {turn}</span>
            </div>
            <div className="index-pair">
              <div>
                <small>코스피아</small>
                <strong className="up">2,874.21 ▲</strong>
              </div>
              <div>
                <small>코스닥크</small>
                <strong className="down">912.48 ▼</strong>
              </div>
            </div>
            <div className="sector-list">
              {sectors.slice(0, 6).map((sector, index) => (
                <div key={sector}>
                  <span>{sector}</span>
                  <Delta value={sectorPerformance[index]} />
                </div>
              ))}
            </div>
          </aside>
          <aside className="compact-panel signal-panel">
            <div className="compact-panel-head">
              <div>
                <p className="eyebrow">TODAY&apos;S SIGNAL</p>
                <h2>{initialSetup ? "개장 전 안내" : "오늘의 신호"}</h2>
              </div>
              <Newspaper size={20} />
            </div>
            <h3>{issue?.headline ?? "뉴스 없이 첫 판단을 시작합니다"}</h3>
            <p>
              {issue
                ? "뉴스 팝업에서 헤드라인과 기업 단신을 확인하세요."
                : "각 기업의 시장 성격과 영향 분야를 살펴보고 초기 전략을 정하세요."}
            </p>
            {issue && (
              <button
                onClick={() =>
                  document
                    .querySelector<HTMLButtonElement>(".news-trigger")
                    ?.click()
                }
              >
                신문 다시 보기 <ArrowRight size={14} />
              </button>
            )}
          </aside>
        </div>
      </Shell>
    </>
  );
}
