alter table public.teams add column if not exists focus text not null default 'AI·반도체';
alter table public.teams add column if not exists turnover_rate numeric(5,2) not null default 0;
alter table public.teams add column if not exists total_return numeric(8,2) not null default 0;
alter table public.teams add column if not exists turn_return numeric(8,2) not null default 0;
alter table public.teams add column if not exists previous_rank smallint not null default 1;
alter table public.team_standings add column if not exists submitted boolean not null default false;

create table public.game_admin_secrets (
  game_id uuid primary key references public.games(id) on delete cascade,
  token_hash text not null,
  created_at timestamptz not null default now()
);

create table public.team_secrets (
  team_id uuid primary key references public.teams(id) on delete cascade,
  token_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.game_admin_secrets enable row level security;
alter table public.team_secrets enable row level security;
revoke all on public.game_admin_secrets, public.team_secrets from anon, authenticated;
create policy "admin secrets are never exposed" on public.game_admin_secrets for select to anon, authenticated using (false);
create policy "team secrets are never exposed" on public.team_secrets for select to anon, authenticated using (false);

create index teams_game_created_idx on public.teams(game_id, created_at);
