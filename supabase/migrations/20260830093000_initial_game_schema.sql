create extension if not exists pgcrypto;

create table public.games (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9]{4,10}$'),
  name text not null,
  status text not null default 'lobby' check (status in ('lobby','playing','calculating','finished')),
  current_turn smallint not null default 1 check (current_turn between 1 and 20),
  total_turns smallint not null default 8 check (total_turns between 3 and 20),
  max_teams smallint not null default 12 check (max_teams between 2 and 12),
  initial_budget bigint not null default 100000000 check (initial_budget > 0),
  minimum_turnover numeric(5,2) not null default 20,
  base_rate numeric(5,2) not null default 3,
  loan_spread numeric(5,2) not null default 1.5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 16),
  assets bigint not null,
  loan_balance bigint not null default 0 check (loan_balance >= 0),
  accrued_interest bigint not null default 0 check (accrued_interest >= 0),
  rank smallint not null default 1,
  submitted boolean not null default false,
  portfolio jsonb not null default '[]'::jsonb,
  previous_portfolio jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(game_id, name)
);

create table public.market_events (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn smallint not null,
  event_type text not null check (event_type in ('automatic','surprise','rate')),
  headline text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.news_board (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn smallint not null,
  headline text not null,
  briefs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(game_id, turn)
);

create table public.team_standings (
  team_id uuid primary key references public.teams(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  team_name text not null,
  rank smallint not null,
  net_assets bigint not null,
  total_return numeric(8,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table public.final_results (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  team_number smallint not null,
  final_rank smallint not null,
  final_net_assets bigint not null,
  total_return numeric(8,2) not null,
  investor_profile text not null default '분석 중',
  created_at timestamptz not null default now()
);

alter table public.games enable row level security;
alter table public.teams enable row level security;
alter table public.market_events enable row level security;
alter table public.news_board enable row level security;
alter table public.team_standings enable row level security;
alter table public.final_results enable row level security;
revoke all on public.games, public.teams, public.market_events, public.news_board, public.team_standings, public.final_results from anon, authenticated;
grant select on public.games, public.news_board, public.team_standings, public.final_results to anon, authenticated;

create policy "public game boards are readable" on public.games for select to anon, authenticated using (true);
create policy "public headlines are readable" on public.news_board for select to anon, authenticated using (true);
create policy "public standings are readable" on public.team_standings for select to anon, authenticated using (true);
create policy "anonymous final results are readable" on public.final_results for select to anon, authenticated using (true);

create or replace function public.purge_team_data_after_game()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'finished' and old.status is distinct from 'finished' then
    insert into public.final_results(game_id, team_number, final_rank, final_net_assets, total_return)
    select t.game_id, row_number() over(order by t.created_at)::smallint, t.rank,
      t.assets - t.loan_balance - t.accrued_interest,
      round(((t.assets - t.loan_balance - t.accrued_interest)::numeric / g.initial_budget - 1) * 100, 2)
    from public.teams t join public.games g on g.id = t.game_id
    where t.game_id = new.id;
    delete from public.teams where game_id = new.id;
  end if;
  return new;
end;
$$;
revoke all on function public.purge_team_data_after_game() from public, anon, authenticated;

create trigger purge_teams_on_game_finish
after update of status on public.games
for each row execute function public.purge_team_data_after_game();

alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.news_board;
alter publication supabase_realtime add table public.team_standings;
alter publication supabase_realtime add table public.final_results;

create index teams_game_rank_idx on public.teams(game_id, rank);
create index market_events_game_turn_idx on public.market_events(game_id, turn desc);
create index team_standings_game_rank_idx on public.team_standings(game_id, rank);
