create policy "team ledgers are never exposed" on public.teams
for select to anon, authenticated using (false);

create policy "hidden market events are never exposed" on public.market_events
for select to anon, authenticated using (false);

create index final_results_game_id_idx on public.final_results(game_id);
