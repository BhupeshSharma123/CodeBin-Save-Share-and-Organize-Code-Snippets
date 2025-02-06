create table codebins (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  code text not null,
  language text not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table codebins enable row level security;

-- Create policy for users to see only their own snippets
create policy "Users can view their own snippets"
  on codebins for select
  using (auth.uid() = user_id);

-- Create policy for users to insert their own snippets
create policy "Users can insert their own snippets"
  on codebins for insert
  with check (auth.uid() = user_id);

-- Create policy for users to update their own snippets
create policy "Users can update their own snippets"
  on codebins for update
  using (auth.uid() = user_id);

-- Create policy for users to delete their own snippets
create policy "Users can delete their own snippets"
  on codebins for delete
  using (auth.uid() = user_id);