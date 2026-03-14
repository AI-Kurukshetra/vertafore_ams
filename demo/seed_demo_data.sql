-- SmartAgency Pro demo seed (idempotent)
-- Demo credentials created/updated:
-- demo.admin@smartagency.local   / Demo@1234
-- demo.manager@smartagency.local / Demo@1234
-- demo.agent@smartagency.local   / Demo@1234

begin;

insert into auth.users (
  id, aud, role, email, encrypted_password,
  email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
select
  u.id,
  'authenticated',
  'authenticated',
  u.email,
  crypt('Demo@1234', gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'full_name', u.full_name, 'email_verified', true),
  now(),
  now()
from (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, 'demo.admin@smartagency.local'::text, 'Demo Admin'::text),
    ('22222222-2222-4222-8222-222222222222'::uuid, 'demo.manager@smartagency.local'::text, 'Demo Manager'::text),
    ('33333333-3333-4333-8333-333333333333'::uuid, 'demo.agent@smartagency.local'::text, 'Demo Agent'::text)
) as u(id, email, full_name)
where not exists (select 1 from auth.users au where au.email = u.email);

update auth.users
set
  encrypted_password = crypt('Demo@1234', gen_salt('bf')),
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
  raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('email_verified', true),
  updated_at = now()
where email in ('demo.admin@smartagency.local', 'demo.manager@smartagency.local', 'demo.agent@smartagency.local');

insert into auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
select
  gen_random_uuid(),
  au.id::text,
  au.id,
  jsonb_build_object('sub', au.id::text, 'email', au.email, 'email_verified', true, 'full_name', coalesce(au.raw_user_meta_data->>'full_name','Demo User')),
  'email',
  now(),
  now()
from auth.users au
where au.email in ('demo.admin@smartagency.local', 'demo.manager@smartagency.local', 'demo.agent@smartagency.local')
  and not exists (
    select 1 from auth.identities ai where ai.provider = 'email' and ai.provider_id = au.id::text
  );

insert into public.profiles (id, full_name, email, role)
select
  au.id,
  coalesce(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  au.email,
  case
    when au.email = 'demo.admin@smartagency.local' then 'admin'
    when au.email = 'demo.manager@smartagency.local' then 'manager'
    when au.email = 'demo.agent@smartagency.local' then 'agent'
    else 'agent'
  end
from auth.users au
where au.email in ('demo.admin@smartagency.local', 'demo.manager@smartagency.local', 'demo.agent@smartagency.local')
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  updated_at = now();

delete from public.policies where policy_number like 'DPL-%';
delete from public.clients where client_id like 'DEMO%';

with demo_clients as (
  insert into public.clients (
    client_id, first_name, last_name, email, phone, date_of_birth, gender,
    address, city, state, pincode, occupation, company_name, status, notes, created_by
  )
  values
    ('DEMO001','Aarav','Sharma','aarav.sharma.demo@smartagency.local','9876541001','1989-02-14','male','14 MG Road','Bengaluru','Karnataka','560001','Engineer','Nimbus Labs','active','High-value bundled account.', '11111111-1111-4111-8111-111111111111'),
    ('DEMO002','Isha','Patel','isha.patel.demo@smartagency.local','9876541002','1992-07-09','female','22 Park Street','Kolkata','West Bengal','700016','Architect','Studio Axis','prospect','Warm lead from referral.', '22222222-2222-4222-8222-222222222222'),
    ('DEMO003','Rohan','Mehta','rohan.mehta.demo@smartagency.local','9876541003','1985-10-21','male','9 C Scheme','Jaipur','Rajasthan','302001','Business Owner','Mehta Traders','active','Interested in commercial expansion.', '11111111-1111-4111-8111-111111111111'),
    ('DEMO004','Neha','Verma','neha.verma.demo@smartagency.local','9876541004','1994-01-19','female','11 Banjara Hills','Hyderabad','Telangana','500034','Consultant','Verma Advisory','active','Annual review due next quarter.', '33333333-3333-4333-8333-333333333333'),
    ('DEMO005','Kunal','Joshi','kunal.joshi.demo@smartagency.local','9876541005','1988-11-02','male','4 Law Garden','Ahmedabad','Gujarat','380006','Doctor','CareOne Clinic','inactive','Paused due to budget constraints.', '22222222-2222-4222-8222-222222222222'),
    ('DEMO006','Priya','Nair','priya.nair.demo@smartagency.local','9876541006','1991-05-26','female','18 Marine Drive','Mumbai','Maharashtra','400002','Product Manager','BlueOrbit','active','Strong cross-sell potential.', '33333333-3333-4333-8333-333333333333'),
    ('DEMO007','Vivek','Singh','vivek.singh.demo@smartagency.local','9876541007','1983-03-30','male','5 Civil Lines','Lucknow','Uttar Pradesh','226001','Retail Owner','Singh Mart','churned','Moved to competitor in 2025.', '11111111-1111-4111-8111-111111111111'),
    ('DEMO008','Ananya','Rao','ananya.rao.demo@smartagency.local','9876541008','1996-09-13','female','33 Anna Salai','Chennai','Tamil Nadu','600002','Designer','Rao Creative','active','Digital-first communication.', '33333333-3333-4333-8333-333333333333'),
    ('DEMO009','Harsh','Kapoor','harsh.kapoor.demo@smartagency.local','9876541009','1990-12-08','male','7 Sector 17','Chandigarh','Chandigarh','160017','Lawyer','Kapoor Legal','prospect','Comparing premium options.', '22222222-2222-4222-8222-222222222222'),
    ('DEMO010','Sana','Khan','sana.khan.demo@smartagency.local','9876541010','1993-04-05','female','19 Hazratganj','Lucknow','Uttar Pradesh','226010','HR Lead','PeopleFirst','active','Renewal coming in 20 days.', '11111111-1111-4111-8111-111111111111'),
    ('DEMO011','Manav','Gupta','manav.gupta.demo@smartagency.local','9876541011','1987-08-17','male','27 Salt Lake','Kolkata','West Bengal','700091','CA','Gupta & Co','active','Prefers annual consolidated billing.', '33333333-3333-4333-8333-333333333333'),
    ('DEMO012','Tanya','Malhotra','tanya.malhotra.demo@smartagency.local','9876541012','1995-06-11','female','42 Connaught Place','New Delhi','Delhi','110001','Marketing Head','BrightWave','active','Potential life policy add-on.', '22222222-2222-4222-8222-222222222222')
  returning id, client_id
)
insert into public.policies (
  policy_number, client_id, policy_type, carrier_name, premium_amount, coverage_amount,
  deductible, effective_date, expiration_date, status, notes, created_by
)
select * from (
  select 'DPL-001'::text, c1.id, 'auto'::text, 'ICICI Lombard'::text, 36500::numeric, 500000::numeric, 10000::numeric, current_date - 160, current_date + 205, 'active'::text, 'Family sedan comprehensive cover.'::text, '11111111-1111-4111-8111-111111111111'::uuid from demo_clients c1 where c1.client_id='DEMO001'
  union all select 'DPL-002', c1.id, 'home', 'HDFC Ergo', 24800, 7500000, 25000, current_date - 120, current_date + 245, 'active', 'Apartment structure + content.', '11111111-1111-4111-8111-111111111111' from demo_clients c1 where c1.client_id='DEMO001'
  union all select 'DPL-003', c2.id, 'commercial', 'Tata AIG', 81200, 15000000, 50000, current_date - 20, current_date + 345, 'pending', 'Awaiting final inspection report.', '22222222-2222-4222-8222-222222222222' from demo_clients c2 where c2.client_id='DEMO002'
  union all select 'DPL-004', c3.id, 'commercial', 'Bajaj Allianz', 96500, 25000000, 75000, current_date - 300, current_date + 60, 'active', 'Warehouse inventory + fire rider.', '11111111-1111-4111-8111-111111111111' from demo_clients c3 where c3.client_id='DEMO003'
  union all select 'DPL-005', c3.id, 'liability', 'New India Assurance', 45600, 10000000, 0, current_date - 300, current_date + 60, 'active', 'Public liability for retail operations.', '11111111-1111-4111-8111-111111111111' from demo_clients c3 where c3.client_id='DEMO003'
  union all select 'DPL-006', c4.id, 'health', 'Star Health', 29800, 1000000, 5000, current_date - 220, current_date + 145, 'active', 'Corporate floater, 3 members.', '33333333-3333-4333-8333-333333333333' from demo_clients c4 where c4.client_id='DEMO004'
  union all select 'DPL-007', c5.id, 'life', 'LIC', 18400, 2000000, 0, current_date - 600, current_date - 235, 'expired', 'Term plan expired, no renewal yet.', '22222222-2222-4222-8222-222222222222' from demo_clients c5 where c5.client_id='DEMO005'
  union all select 'DPL-008', c6.id, 'auto', 'Reliance General', 33200, 650000, 15000, current_date - 45, current_date + 320, 'active', 'SUV with zero dep add-on.', '33333333-3333-4333-8333-333333333333' from demo_clients c6 where c6.client_id='DEMO006'
  union all select 'DPL-009', c6.id, 'health', 'Niva Bupa', 21200, 500000, 5000, current_date - 45, current_date + 320, 'active', 'Individual health base plan.', '33333333-3333-4333-8333-333333333333' from demo_clients c6 where c6.client_id='DEMO006'
  union all select 'DPL-010', c7.id, 'commercial', 'SBI General', 54200, 8000000, 50000, current_date - 470, current_date - 100, 'cancelled', 'Cancelled due to non-payment.', '11111111-1111-4111-8111-111111111111' from demo_clients c7 where c7.client_id='DEMO007'
  union all select 'DPL-011', c8.id, 'home', 'Acko', 16500, 4200000, 20000, current_date - 200, current_date + 165, 'active', 'Condo insurance + electronics rider.', '33333333-3333-4333-8333-333333333333' from demo_clients c8 where c8.client_id='DEMO008'
  union all select 'DPL-012', c9.id, 'liability', 'Cholamandalam', 27500, 7000000, 10000, current_date - 10, current_date + 355, 'pending', 'Underwriting in progress.', '22222222-2222-4222-8222-222222222222' from demo_clients c9 where c9.client_id='DEMO009'
  union all select 'DPL-013', c10.id, 'life', 'Max Life', 22600, 3000000, 0, current_date - 340, current_date + 25, 'active', 'Premium due next month.', '11111111-1111-4111-8111-111111111111' from demo_clients c10 where c10.client_id='DEMO010'
  union all select 'DPL-014', c10.id, 'health', 'Care Health', 18800, 600000, 7000, current_date - 340, current_date + 25, 'renewed', 'Renewed with preventive cover.', '11111111-1111-4111-8111-111111111111' from demo_clients c10 where c10.client_id='DEMO010'
  union all select 'DPL-015', c11.id, 'commercial', 'Oriental Insurance', 63900, 12000000, 65000, current_date - 150, current_date + 210, 'active', 'Professional indemnity package.', '33333333-3333-4333-8333-333333333333' from demo_clients c11 where c11.client_id='DEMO011'
  union all select 'DPL-016', c11.id, 'liability', 'IFFCO Tokio', 31200, 5000000, 20000, current_date - 150, current_date + 210, 'active', 'Errors & omissions rider.', '33333333-3333-4333-8333-333333333333' from demo_clients c11 where c11.client_id='DEMO011'
  union all select 'DPL-017', c12.id, 'life', 'HDFC Life', 20500, 2500000, 0, current_date - 95, current_date + 270, 'active', 'Young family protection plan.', '22222222-2222-4222-8222-222222222222' from demo_clients c12 where c12.client_id='DEMO012'
  union all select 'DPL-018', c12.id, 'auto', 'Kotak General', 27400, 550000, 10000, current_date - 95, current_date + 270, 'active', 'Hatchback comprehensive cover.', '22222222-2222-4222-8222-222222222222' from demo_clients c12 where c12.client_id='DEMO012'
) t(policy_number, client_id, policy_type, carrier_name, premium_amount, coverage_amount, deductible, effective_date, expiration_date, status, notes, created_by);

commit;
