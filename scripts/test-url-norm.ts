/* Quick verification of normalizePostgresUrl in src/lib/db.ts */
import { normalizePostgresUrl } from "../src/lib/db";

const cases: Array<[string, string]> = [
  [
    "postgresql://postgres.abc:pw@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
    "session pooler (5432) → +connection_limit&pool_timeout",
  ],
  [
    "postgresql://postgres.abc:pw@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
    "transaction pooler (6543) → +pgbouncer&connection_limit&pool_timeout",
  ],
  [
    "postgresql://postgres.abc:pw@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1",
    "already-parameterized → untouched",
  ],
  [
    "postgresql://postgres.abc:p%40ss@aws-0-eu.pooler.supabase.com:5432/postgres",
    "encoded password preserved",
  ],
  [
    "postgresql://u:p@db.xxxx.supabase.com:5432/postgres",
    "direct (non-pooler) host → untouched",
  ],
  [
    "postgresql://postgres.abc:pw@aws-0-eu.pooler.supabase.com:5432/postgres?sslmode=require",
    "existing params kept + new ones appended",
  ],
];

for (const [input, label] of cases) {
  console.log(`\n[${label}]\n  in : ${input}\n  out: ${normalizePostgresUrl(input)}`);
}
