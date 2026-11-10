-- Supabase 대시보드 > SQL Editor 에 통째로 붙여 넣고 Run

create table public.topics (
  id bigint generated always as identity primary key,
  subject varchar(40) not null,
  type varchar(40) not null,
  interest varchar(40) not null,
  level smallint not null check (level between 1 and 3),
  title varchar(200) not null,
  description text,
  direction text,
  keyword varchar(60),
  res jsonb,
  created_at timestamptz default now(),
  unique (title, subject, type, interest)
);

create table public.favorites (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  topic_id bigint not null references public.topics(id) on delete cascade,
  saved_at timestamptz default now(),
  primary key (user_id, topic_id)
);

-- AI 호출 간격(8초) 제한용. 서버 함수만 접근
create table public.ai_log (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_at timestamptz not null
);

alter table public.topics enable row level security;
alter table public.favorites enable row level security;
alter table public.ai_log enable row level security;

-- 로그인한 사용자는 주제를 읽기만 가능 (쓰기는 서버 함수만)
create policy "topics read" on public.topics for select to authenticated using (true);

-- 즐겨찾기는 본인 것만
create policy "fav read" on public.favorites for select to authenticated using (user_id = auth.uid());
create policy "fav add" on public.favorites for insert to authenticated with check (user_id = auth.uid());
create policy "fav del" on public.favorites for delete to authenticated using (user_id = auth.uid());
-- ai_log 는 정책 없음 = 클라이언트 접근 불가
