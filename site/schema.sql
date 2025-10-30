-- x61ctf/schema.sql
PRAGMA foreign_keys=ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- auth subject (or UUID)
  handle TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE team_members (
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,           -- web, pwn, crypto, forensics, misc
  points INTEGER NOT NULL,
  tags TEXT,                        -- CSV or JSON
  url TEXT,                         -- link to your VPS challenge (if applicable)
  validator_mode TEXT NOT NULL DEFAULT 'central', -- 'central' | 'remote'
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- For central validation: store salted hashes, not plaintext flags
CREATE TABLE challenge_flags (
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  scope TEXT NOT NULL,              -- 'global' or 'per_team'
  flag_hash TEXT NOT NULL,          -- hex(HMAC-SHA256(flag, server_secret)) or scrypt/argon2
  team_id TEXT,                     -- if scope = 'per_team'
  UNIQUE (challenge_id, scope, COALESCE(team_id,''))
);

CREATE TABLE submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  submitted TEXT NOT NULL,          -- raw user input (for audit)
  correct INTEGER NOT NULL,         -- 0/1
  ip TEXT,
  ua TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE solves (
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  first_blood INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (team_id, challenge_id)
);

