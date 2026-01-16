create schema x61ctf authorization x61ctf;

set search_path to x61ctf,public;

-- for testing, leave these drop uncommented
drop table if exists users;
drop table if exists teams;
drop table if exists challenges;
drop table if exists solves;

create table users (
  id uuid primary key default get_random_uuid(),
  oid text unique not null,
  email varchar(255) unique not null,
  username varchar(50) unique not null,
  team_id uuid references teams(id) on delete set null,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) unique not null,
  invite_code varchar(20) unique not null,
  created_at timestamp with time zone default now()
);

create table challenges (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  category varchar(50) not null,
  description text,
  points integer not null default 0,
  flag_hash text not null,
  resource_url text,
  is_active boolean default true
);

create table solves (
  id serial primary key,
  user_id uuid references users(id),
  team_id uuid references teams(id),
  challenge_id uuid references challenges(id),
  created_at timestamp with time zone default now(),
  unique(team_id,challenge_id)
);
