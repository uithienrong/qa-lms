-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table courses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  duration text,
  level text,
  created_at timestamptz default now()
);

create table users (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id),
  name text not null,
  username text unique not null,
  password_hash text not null,
  role text default 'learner' check (role in ('admin','learner')),
  created_at timestamptz default now()
);

create table lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id),
  week_number int not null,
  title text not null,
  content_html text,
  type text default 'theory' check (type in ('theory','exercise')),
  order_index int not null
);

create table submissions (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references lessons(id),
  user_id uuid references users(id),
  note text,
  files text[],
  score numeric,
  feedback text,
  status text default 'pending' check (status in ('pending','graded')),
  submitted_at timestamptz default now()
);

create table progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  lesson_id uuid references lessons(id),
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

-- Seed admin user (password: admin123)
insert into users (name, username, password_hash, role)
values ('Admin', 'admin', encode(digest('admin123','sha256'),'hex'), 'admin');
