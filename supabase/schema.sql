create extension if not exists "uuid-ossp";

create table if not exists tournaments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text default 'Libre',
  season text default '2026',
  created_at timestamptz default now()
);

create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references tournaments(id) on delete cascade,
  name text not null,
  coach text,
  logo_url text,
  created_at timestamptz default now()
);

create table if not exists players (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references teams(id) on delete cascade,
  full_name text not null,
  number int,
  position text,
  created_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references tournaments(id) on delete cascade,
  home_team_id uuid references teams(id) on delete cascade,
  away_team_id uuid references teams(id) on delete cascade,
  match_date timestamptz not null,
  field text default 'Cancha 1',
  home_goals int,
  away_goals int,
  status text default 'programado',
  created_at timestamptz default now()
);

create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  minute int,
  created_at timestamptz default now()
);

create table if not exists cards (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  card_type text check (card_type in ('amarilla', 'roja')),
  minute int,
  created_at timestamptz default now()
);

create or replace view standings_view as
select
  t.id,
  t.name,
  count(m.id) filter (where m.status = 'finalizado')::int as pj,
  count(m.id) filter (
    where m.status = 'finalizado' and (
      (m.home_team_id = t.id and m.home_goals > m.away_goals) or
      (m.away_team_id = t.id and m.away_goals > m.home_goals)
    )
  )::int as pg,
  count(m.id) filter (where m.status = 'finalizado' and m.home_goals = m.away_goals)::int as pe,
  count(m.id) filter (
    where m.status = 'finalizado' and (
      (m.home_team_id = t.id and m.home_goals < m.away_goals) or
      (m.away_team_id = t.id and m.away_goals < m.home_goals)
    )
  )::int as pp,
  coalesce(sum(case when m.home_team_id = t.id then m.home_goals when m.away_team_id = t.id then m.away_goals else 0 end) filter (where m.status = 'finalizado'), 0)::int as gf,
  coalesce(sum(case when m.home_team_id = t.id then m.away_goals when m.away_team_id = t.id then m.home_goals else 0 end) filter (where m.status = 'finalizado'), 0)::int as gc,
  (
    coalesce(sum(case when m.home_team_id = t.id then m.home_goals when m.away_team_id = t.id then m.away_goals else 0 end) filter (where m.status = 'finalizado'), 0) -
    coalesce(sum(case when m.home_team_id = t.id then m.away_goals when m.away_team_id = t.id then m.home_goals else 0 end) filter (where m.status = 'finalizado'), 0)
  )::int as dg,
  (
    count(m.id) filter (
      where m.status = 'finalizado' and (
        (m.home_team_id = t.id and m.home_goals > m.away_goals) or
        (m.away_team_id = t.id and m.away_goals > m.home_goals)
      )
    ) * 3 +
    count(m.id) filter (where m.status = 'finalizado' and m.home_goals = m.away_goals)
  )::int as pts
from teams t
left join matches m on m.home_team_id = t.id or m.away_team_id = t.id
group by t.id, t.name;

create or replace view scorers_view as
select
  p.full_name as player,
  t.name as team,
  count(g.id)::int as goals
from goals g
join players p on p.id = g.player_id
join teams t on t.id = g.team_id
group by p.full_name, t.name
order by goals desc;

create or replace view matches_public_view as
select
  m.id,
  ht.name as home_team,
  at.name as away_team,
  m.match_date,
  m.field,
  m.home_goals,
  m.away_goals,
  m.status
from matches m
join teams ht on ht.id = m.home_team_id
join teams at on at.id = m.away_team_id
order by m.match_date asc;

alter table tournaments enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table goals enable row level security;
alter table cards enable row level security;

create policy "Public read tournaments" on tournaments for select using (true);
create policy "Public read teams" on teams for select using (true);
create policy "Public read players" on players for select using (true);
create policy "Public read matches" on matches for select using (true);
create policy "Public read goals" on goals for select using (true);
create policy "Public read cards" on cards for select using (true);

create policy "Public insert tournaments" on tournaments for insert with check (true);
create policy "Public insert teams" on teams for insert with check (true);
create policy "Public insert players" on players for insert with check (true);
create policy "Public insert matches" on matches for insert with check (true);
create policy "Public update matches" on matches for update using (true);

insert into tournaments (name, category, season)
values ('Torneo Apertura Malvagol', 'Fútbol 7', '2026')
on conflict do nothing;
