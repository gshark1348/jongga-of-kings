alter table public.news_board
  add column if not exists event_id text,
  add column if not exists issue jsonb not null default '{}'::jsonb,
  add column if not exists company_events jsonb not null default '[]'::jsonb,
  add column if not exists surprise_event jsonb,
  add column if not exists market_mood jsonb not null default '{}'::jsonb,
  add column if not exists sector_attention jsonb not null default '{}'::jsonb;

create unique index if not exists market_events_one_auto_per_turn
  on public.market_events(game_id, turn) where event_type = 'automatic';
create unique index if not exists market_events_one_surprise_per_turn
  on public.market_events(game_id, turn) where event_type = 'surprise';
create index if not exists news_board_game_turn_desc_idx
  on public.news_board(game_id, turn desc);
