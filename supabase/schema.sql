-- Suggested production schema. Do not expose marks using Student ID alone.
create table public.students (
  id uuid primary key default gen_random_uuid(),
  student_id text unique not null,
  full_name text not null,
  intake text not null default '64',
  section text not null default '4',
  program text not null default 'BBA',
  created_at timestamptz not null default now()
);

create table public.semester_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  semester text not null,
  cgpa numeric(3,2),
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique(student_id, semester)
);

create table public.course_marks (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.semester_results(id) on delete cascade,
  course_code text not null,
  course_title text not null,
  class_test numeric(5,2),
  midterm numeric(5,2),
  final_exam numeric(5,2),
  total numeric(5,2),
  letter_grade text,
  unique(result_id, course_code)
);

-- Enable RLS before adding any real student information.
alter table public.students enable row level security;
alter table public.semester_results enable row level security;
alter table public.course_marks enable row level security;

-- Intentionally no public SELECT policies are created here.
-- Add authenticated, server-verified policies only after deciding how students
-- prove their identity. A student ID is an identifier, not a secret/password.
-- Keep service-role keys on the server only; never put them in NEXT_PUBLIC_* vars.
