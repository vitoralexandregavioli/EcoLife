-- EcoLife: estrutura inicial do banco de dados no Supabase.
-- Execute este arquivo no SQL Editor do projeto Supabase.
-- As políticas abaixo deixam cada usuário acessar somente os próprios dados.

-- Tabela de categorias usadas para organizar os desafios.
-- A restrição (user_id, id) permite que as chaves estrangeiras abaixo
-- garantam também que as relações pertençam ao mesmo usuário.
create table if not exists public.categorias (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  nome text not null,
  descricao text,
  created_at timestamptz not null default now(),
  constraint categorias_user_id_id_unique unique (user_id, id)
);

-- Tabela de desafios. Cada desafio pertence a um usuário e a uma categoria
-- do mesmo usuário. Uma categoria com desafios não pode ser excluída.
create table if not exists public.desafios (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  categoria_id bigint not null,
  titulo text not null,
  descricao text,
  xp integer not null check (xp > 0),
  dificuldade text not null default 'facil'
    check (dificuldade in ('facil', 'medio', 'dificil')),
  created_at timestamptz not null default now(),
  constraint desafios_user_id_id_unique unique (user_id, id),
  constraint desafios_categoria_do_mesmo_usuario_fk
    foreign key (user_id, categoria_id)
    references public.categorias (user_id, id)
    on delete restrict
);

-- Tabela dos registros de ações realizadas ou pendentes.
-- Ao excluir um desafio, seus registros relacionados também são excluídos.
create table if not exists public.registros (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  desafio_id bigint not null,
  data_realizacao date not null default current_date,
  observacao text,
  status text not null default 'concluido'
    check (status in ('pendente', 'concluido')),
  created_at timestamptz not null default now(),
  constraint registros_desafio_do_mesmo_usuario_fk
    foreign key (user_id, desafio_id)
    references public.desafios (user_id, id)
    on delete cascade
);

-- Índices para acelerar consultas e relacionamentos filtrados por usuário.
create index if not exists desafios_user_id_idx
  on public.desafios (user_id);
create index if not exists desafios_categoria_id_idx
  on public.desafios (categoria_id);
create index if not exists registros_user_id_idx
  on public.registros (user_id);
create index if not exists registros_desafio_id_idx
  on public.registros (desafio_id);

-- Ativa Row Level Security nas três tabelas. Sem uma política permissiva,
-- a tabela não fica acessível pelo cliente autenticado.
alter table public.categorias enable row level security;
alter table public.desafios enable row level security;
alter table public.registros enable row level security;

-- Concede operações às sessões autenticadas; as políticas RLS abaixo
-- continuam limitando essas operações às linhas do próprio usuário.
grant select, insert, update, delete on table
  public.categorias, public.desafios, public.registros to authenticated;

-- Políticas de categorias: leitura, inclusão, alteração e exclusão próprias.
drop policy if exists "categorias_select_proprias" on public.categorias;
create policy "categorias_select_proprias"
  on public.categorias for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "categorias_insert_proprias" on public.categorias;
create policy "categorias_insert_proprias"
  on public.categorias for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "categorias_update_proprias" on public.categorias;
create policy "categorias_update_proprias"
  on public.categorias for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "categorias_delete_proprias" on public.categorias;
create policy "categorias_delete_proprias"
  on public.categorias for delete to authenticated
  using (auth.uid() = user_id);

-- Políticas de desafios: leitura, inclusão, alteração e exclusão próprios.
drop policy if exists "desafios_select_proprios" on public.desafios;
create policy "desafios_select_proprios"
  on public.desafios for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "desafios_insert_proprios" on public.desafios;
create policy "desafios_insert_proprios"
  on public.desafios for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "desafios_update_proprios" on public.desafios;
create policy "desafios_update_proprios"
  on public.desafios for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "desafios_delete_proprios" on public.desafios;
create policy "desafios_delete_proprios"
  on public.desafios for delete to authenticated
  using (auth.uid() = user_id);

-- Políticas de registros: leitura, inclusão, alteração e exclusão próprios.
drop policy if exists "registros_select_proprios" on public.registros;
create policy "registros_select_proprios"
  on public.registros for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "registros_insert_proprios" on public.registros;
create policy "registros_insert_proprios"
  on public.registros for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "registros_update_proprios" on public.registros;
create policy "registros_update_proprios"
  on public.registros for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "registros_delete_proprios" on public.registros;
create policy "registros_delete_proprios"
  on public.registros for delete to authenticated
  using (auth.uid() = user_id);
