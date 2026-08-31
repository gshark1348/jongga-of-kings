import { marketEventCatalog, type HiddenMarketState, type MarketEvent } from "./event-catalog";
import type { MarketFactor } from "./types";

export type MarketState = Record<HiddenMarketState, number>;

const initialState: MarketState = {
  growth: 50, inflation: 45, liquidity: 50, risk: 55,
  credit: 40, supply: 35, techHeat: 40, consumption: 50,
};

function stableHash(value: string) {
  return [...value].reduce((hash, character) => ((hash * 33) ^ character.charCodeAt(0)) >>> 0, 5381);
}

function clamp(value: number) { return Math.max(0, Math.min(100, value)); }

function relatedness(left: MarketEvent, right: MarketEvent) {
  const factors = new Set(Object.keys(left.factors) as MarketFactor[]);
  return (Object.keys(right.factors) as MarketFactor[]).filter((factor) => factors.has(factor)).length;
}

function stateFit(event: MarketEvent, state: MarketState) {
  return (Object.entries(event.stateAffinity) as [HiddenMarketState, number][]).reduce((score, [key, direction]) => {
    const displacement = (state[key] - 50) / 50;
    return score + displacement * Math.sign(direction) * Math.min(5, Math.abs(direction) / 3);
  }, 0);
}

function applyEvent(state: MarketState, event: MarketEvent): MarketState {
  const next = { ...state };
  for (const [key, change] of Object.entries(event.stateChanges) as [HiddenMarketState, number][]) {
    next[key] = clamp(next[key] + change);
  }
  return next;
}

function weightedPick(candidates: MarketEvent[], weights: number[], seed: string) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = (stableHash(seed) / 0xffffffff) * total;
  for (let index = 0; index < candidates.length; index += 1) {
    cursor -= weights[index];
    if (cursor <= 0) return candidates[index];
  }
  return candidates.at(-1)!;
}

export function getNewsSequence(gameCode: string, count: number) {
  if (count <= 0) return [];
  const sequence: MarketEvent[] = [];
  const used = new Set<string>();
  let state = { ...initialState };

  while (sequence.length < Math.min(count, marketEventCatalog.length)) {
    const previous = sequence.at(-1);
    const candidates = marketEventCatalog.filter((event) => !used.has(event.id));
    const weights = candidates.map((event) => {
      let weight = event.baseWeight;
      if (!previous) {
        weight += event.phase === "확산" ? 28 : event.phase === "독립" ? 10 : 0;
      } else {
        if (previous.successors.includes(event.id)) weight += 45;
        weight += relatedness(previous, event) * 4;
        if (event.sector !== previous.sector) weight += 3;
      }
      weight += Math.max(-8, Math.min(25, stateFit(event, state)));
      if (event.phase === "조정" && (state.risk > 67 || state.techHeat > 68)) weight += 20;
      if (event.phase === "회복" && state.risk < 38) weight += 14;
      if (event.phase === "독립") weight += 10;
      return Math.max(1, weight);
    });
    const current = weightedPick(candidates, weights, `${gameCode || "JONGGA"}-${sequence.length}-${state.risk}-${state.techHeat}`);
    sequence.push(current);
    used.add(current.id);
    state = applyEvent(state, current);
  }
  return sequence;
}

export function getNewsIssue(gameCode: string, turn: number) {
  if (turn < 2) return null;
  return getNewsSequence(gameCode, turn - 1)[turn - 2] ?? null;
}

export function getMarketState(gameCode: string, turn: number) {
  return getNewsSequence(gameCode, Math.max(0, turn - 1)).reduce(applyEvent, { ...initialState });
}
