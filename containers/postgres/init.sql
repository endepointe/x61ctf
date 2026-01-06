
create table if not exists users (
  id serial primary key,
  name varchar(50),
  age integer
);

insert into users (name,age) values
  ('testuser',29),
  ('betatester',31),
  ('flaggetter',24);
