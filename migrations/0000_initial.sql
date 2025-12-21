-- Feature Pack: crm
-- Initial migration - seeds default pipeline stages
-- Tables are managed by Drizzle. This file only seeds universal data.
-- Idempotent (safe to re-run)

-- Seed default pipeline stages
INSERT INTO "crm_pipeline_stages" ("code", "name", "order", "is_closed_won", "is_closed_lost", "is_system", "created_by_user_id")
VALUES 
  ('lead', 'Lead', 1, false, false, true, 'system'),
  ('qualified', 'Qualified', 2, false, false, true, 'system'),
  ('proposal', 'Proposal', 3, false, false, true, 'system'),
  ('negotiation', 'Negotiation', 4, false, false, true, 'system'),
  ('closed_won', 'Closed Won', 5, true, false, true, 'system'),
  ('closed_lost', 'Closed Lost', 6, false, true, true, 'system')
ON CONFLICT ("code") DO NOTHING;

