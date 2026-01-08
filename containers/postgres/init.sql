create schema x61ctf authorization x61ctf;

set search_path to x61ctf,public;

create table if not exists seasoning (
  salt text not null,
  -- store the pepper in cupboard
);

create table if not exists users (
  user_id serial primary key,
  username varchar(50) not null,
  password_hash text
);

insert into users (name,age) values
  ('testuser',29),
  ('betatester',31),
  ('flaggetter',24);
