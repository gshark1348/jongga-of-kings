import { news } from "./mock-data";
import type { MarketFactor, NewsIssue } from "./types";

function stableHash(value: string) {
  return [...value].reduce((hash, character) => ((hash * 33) ^ character.charCodeAt(0)) >>> 0, 5381);
}

function relatedness(left: NewsIssue, right: NewsIssue) {
  const leftFactors = new Set(Object.keys(left.factors) as MarketFactor[]);
  return (Object.keys(right.factors) as MarketFactor[]).reduce((score, factor) => score + (leftFactors.has(factor) ? 1 : 0), 0);
}

export function getNewsSequence(gameCode: string, count: number) {
  if (count <= 0 || news.length === 0) return [];
  const sequence: NewsIssue[] = [];
  const used = new Set<string>();
  let current = news[stableHash(`${gameCode}-opening`) % news.length];

  while (sequence.length < Math.min(count, news.length)) {
    sequence.push(current);
    used.add(current.id);
    const candidates = news.filter((issue) => !used.has(issue.id));
    if (!candidates.length) break;
    current = candidates.toSorted((a, b) => {
      const scoreA = relatedness(current, a) * 100 + stableHash(`${gameCode}-${sequence.length}-${a.id}`) % 97;
      const scoreB = relatedness(current, b) * 100 + stableHash(`${gameCode}-${sequence.length}-${b.id}`) % 97;
      return scoreB - scoreA;
    })[0];
  }

  return sequence;
}

export function getNewsIssue(gameCode: string, turn: number) {
  if (turn < 2) return null;
  return getNewsSequence(gameCode || "JONGGA", turn - 1)[turn - 2] ?? null;
}
