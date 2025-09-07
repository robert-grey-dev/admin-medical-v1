
-- Убедимся, что включен RLS (на случай если он был выключен)
alter table public.doctors enable row level security;

-- Разрешаем владельцам/админам/модераторам добавлять врачей
create policy "Admins and moderators can insert doctors"
  on public.doctors
  for insert
  to authenticated
  with check (public.get_user_role(auth.uid()) in ('owner','admin','moderator'));

-- Разрешаем владельцам/админам/модераторам обновлять врачей (на будущее)
create policy "Admins and moderators can update doctors"
  on public.doctors
  for update
  to authenticated
  using (public.get_user_role(auth.uid()) in ('owner','admin','moderator'))
  with check (public.get_user_role(auth.uid()) in ('owner','admin','moderator'));

-- Разрешаем владельцам/админам/модераторам удалять врачей
create policy "Admins and moderators can delete doctors"
  on public.doctors
  for delete
  to authenticated
  using (public.get_user_role(auth.uid()) in ('owner','admin','moderator'));
