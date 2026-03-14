# Demo Guide (SmartAgency Pro)

## Demo Login Credentials
- Admin: `demo.admin@smartagency.local` / `Demo@1234`
- Manager: `demo.manager@smartagency.local` / `Demo@1234`
- Agent: `demo.agent@smartagency.local` / `Demo@1234`

## Demo URLs
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Dashboard: `http://localhost:3000/dashboard`
- Clients: `http://localhost:3000/clients`
- Policies: `http://localhost:3000/policies`

## Seed / Refresh Demo Data
Use `demo/seed_demo_data.sql` against your Supabase project.

The seed script is idempotent and does the following:
- Ensures demo auth users exist and are email-confirmed
- Ensures profiles exist with roles (`admin`, `manager`, `agent`)
- Refreshes `DEMO*` clients and `DPL-*` policies with realistic records

## Demo Walkthrough (Recommended)
1. Login as admin and show dashboard KPIs + expiring policies.
2. Open clients list, filter by status/gender, and view details.
3. Add a new client and verify dashboard/client counts update.
4. Open policies list, filter by type/status, then edit a policy.
5. Login as manager and repeat read/update actions.
6. Login as agent and show role-limited behavior for restricted actions.

## Notes
- Existing non-demo records are preserved.
- Only records matching `client_id LIKE 'DEMO%'` and `policy_number LIKE 'DPL-%'` are replaced.
