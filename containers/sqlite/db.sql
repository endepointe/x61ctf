PRAGMA foreign_keys = ON;

-- 1) USERS ------------------------------------------------------------
CREATE TABLE users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT UNIQUE NOT NULL,
  handle         TEXT UNIQUE NOT NULL,
  password_hash  TEXT,                 -- nullable if using SSO only
  is_admin       INTEGER NOT NULL DEFAULT 0,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login_at  INTEGER
);

-- 2) TEAMS ------------------------------------------------------------
CREATE TABLE teams (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT UNIQUE NOT NULL,
  affiliation    TEXT,                 -- school/company/none
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  hidden         INTEGER NOT NULL DEFAULT 0  -- for testing or banned teams
);

CREATE TABLE team_members (
  team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role           TEXT NOT NULL DEFAULT 'member',   -- 'member' or 'captain'
  joined_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (team_id, user_id)
);

-- 3) EVENTS (CTF instances) ------------------------------------------
CREATE TABLE events (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  slug           TEXT UNIQUE NOT NULL,           -- "winter-2025"
  name           TEXT NOT NULL,
  description    TEXT,
  starts_at      INTEGER NOT NULL,
  ends_at        INTEGER NOT NULL,
  frozen_at      INTEGER,                        -- optional score freeze
  created_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

-- which teams are playing in which event
CREATE TABLE event_teams (
  event_id       INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  invited        INTEGER NOT NULL DEFAULT 0,
  eligible       INTEGER NOT NULL DEFAULT 1,     -- 0 = guest/non-scoring
  PRIMARY KEY (event_id, team_id)
);

-- 4) CATEGORIES -------------------------------------------------------
CREATE TABLE categories (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT UNIQUE NOT NULL            -- web, crypto, misc, pwn...
);

-- 5) CHALLENGES -------------------------------------------------------
CREATE TABLE challenges (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id       INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category_id    INTEGER REFERENCES categories(id),
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL,                 -- "otp-warmup"
  description_md TEXT,                          -- rendered to players
  base_points    INTEGER NOT NULL,              -- starting value
  min_points     INTEGER NOT NULL DEFAULT 0,    -- for dynamic scoring
  max_attempts   INTEGER,                       -- null = unlimited
  is_visible     INTEGER NOT NULL DEFAULT 0,    -- released to players?
  is_deleted     INTEGER NOT NULL DEFAULT 0,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE (event_id, slug)
);

-- 6) FLAGS ------------------------------------------------------------
-- Common pattern: one "static" flag per challenge; this schema also supports
-- multiple flags (e.g. regex) if you need them later.
CREATE TABLE flags (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id   INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  type           TEXT NOT NULL DEFAULT 'static', -- 'static', 'regex', etc.
  content_hash   TEXT NOT NULL,                  -- hash/HMAC or pattern
  case_sensitive INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 7) HINTS ------------------------------------------------------------
CREATE TABLE hints (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id   INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  content_md     TEXT NOT NULL,
  cost_points    INTEGER NOT NULL DEFAULT 0,     -- points to subtract
  order_index    INTEGER NOT NULL DEFAULT 0,     -- ordering per challenge
  created_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE hint_unlocks (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  hint_id        INTEGER NOT NULL REFERENCES hints(id) ON DELETE CASCADE,
  team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  unlocked_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (hint_id, team_id)
);

-- 8) FILES / ATTACHMENTS ---------------------------------------------
CREATE TABLE files (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id   INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  filename       TEXT NOT NULL,
  storage_path   TEXT NOT NULL,   -- path or URL
  created_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

-- 9) SUBMISSIONS ------------------------------------------------------
CREATE TABLE submissions (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id       INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  challenge_id   INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id        INTEGER REFERENCES users(id),
  submitted_flag TEXT NOT NULL,
  ip             TEXT,
  user_agent     TEXT,
  is_correct     INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 0,   -- 0 on wrong or late submissions
  created_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_submissions_event ON submissions(event_id);
CREATE INDEX idx_submissions_team ON submissions(team_id);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);

-- 10) SOLVES (one per team/challenge) --------------------------------
CREATE TABLE solves (
  event_id       INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  challenge_id   INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  first_blood    INTEGER NOT NULL DEFAULT 0,
  solve_points   INTEGER NOT NULL,             -- points given at the time
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (event_id, challenge_id, team_id)
);

CREATE INDEX idx_solves_event ON solves(event_id);
CREATE INDEX idx_solves_team ON solves(team_id);

