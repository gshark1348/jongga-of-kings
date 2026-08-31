alter table public.final_results
  add column if not exists team_name text,
  add column if not exists turn_return numeric(8,2) not null default 0,
  add column if not exists investor_metrics jsonb not null default '{}'::jsonb;

create or replace function public.purge_team_data_after_game()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'finished' and old.status is distinct from 'finished' then
    insert into public.final_results(
      game_id, team_number, team_name, final_rank, final_net_assets,
      total_return, turn_return, investor_profile, investor_metrics
    )
    select
      t.game_id,
      row_number() over(order by t.created_at)::smallint,
      t.name,
      t.rank,
      t.assets - t.loan_balance - t.accrued_interest,
      round(((t.assets - t.loan_balance - t.accrued_interest)::numeric / g.initial_budget - 1) * 100, 2),
      round(t.turn_return::numeric, 2),
      '분석 완료',
      jsonb_build_object(
        'concentration', coalesce((select max((position->>'weight')::numeric) from jsonb_array_elements(t.portfolio) position), 0),
        'sectorCount', greatest(1, least(8, jsonb_array_length(t.portfolio))),
        'volatility', least(100, abs(t.turn_return) * 8 + t.turnover_rate * 0.35),
        'turnover', least(100, t.turnover_rate),
        'newsReaction', least(100, t.turnover_rate * 1.2),
        'contrarian', least(100, 35 + greatest(0, -t.total_return) * 2),
        'holdDuration', greatest(0, 100 - t.turnover_rate),
        'dipBuying', least(100, 40 + greatest(0, -t.turn_return) * 5),
        'profitTaking', least(100, 35 + greatest(0, t.total_return) * 3),
        'largeCapShare', greatest(0, 100 - coalesce((select max((position->>'weight')::numeric) from jsonb_array_elements(t.portfolio) position), 0) * 0.35),
        'smallCapShare', least(100, coalesce((select max((position->>'weight')::numeric) from jsonb_array_elements(t.portfolio) position), 0) * 0.55),
        'timingScore', least(100, 45 + greatest(0, t.turn_return) * 5)
      )
    from public.teams t
    join public.games g on g.id = t.game_id
    where t.game_id = new.id;

    delete from public.teams where game_id = new.id;
  end if;
  return new;
end;
$$;

revoke all on function public.purge_team_data_after_game() from public, anon, authenticated;
