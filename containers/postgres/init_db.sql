
CREATE TABLE users (
  user_id        TEXT PRIMARY KEY,                 -- UUID string
  username       TEXT NOT NULL UNIQUE,
  email          TEXT UNIQUE,

  -- local auth (nullable if SSO-only)
  password_hash  TEXT,

  -- SSO support (Entra/Auth0/etc.)
  auth_provider  TEXT NOT NULL DEFAULT 'local',     -- 'local' | 'entra' | 'auth0' ...
  auth_subject   TEXT,                              -- provider subject/oid
  is_active      INTEGER NOT NULL DEFAULT 1,        -- 1=true, 0=false

  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),

  UNIQUE (auth_provider, auth_subject)
);
CREATE INDEX idx_users_auth ON users (auth_provider, auth_subject);
INSERT into users (user_id,username,email,password_hash,auth_subject,is_active) values ('allthethingsuuid','testusername','testemail','testhashpassword','testauthsubject',1);

CREATE TABLE challenges (
  challenge_id     TEXT PRIMARY KEY,               -- stable id like 'twotimepad'
  title            TEXT NOT NULL,
  category         TEXT NOT NULL,                   -- 'crypto','web','forensics',...
  difficulty       TEXT NOT NULL,                   -- 'easy','medium','hard'
  points           INTEGER NOT NULL CHECK (points > 0),
  is_active        INTEGER NOT NULL DEFAULT 1,

  delivery_type    TEXT NOT NULL,                   -- 'api_text' | 'container' | 'static_file'
  instance_mode    TEXT NOT NULL DEFAULT 'global',  -- 'global' | 'per_user' | 'per_team'
  validator_type   TEXT NOT NULL DEFAULT 'exact',   -- 'exact' | 'hash' | 'service'

  -- store hashed flags rather than plaintext
  flag_hash        TEXT,
  flag_salt        TEXT,

  description_md   TEXT,
  tags_json        TEXT,                            -- JSON array string, e.g. ["otp","xor"]

  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX idx_challenges_active_cat ON challenges (is_active, category);
CREATE INDEX idx_challenges_points ON challenges (points);



CREATE TABLE challenge_instances (
  instance_id      TEXT PRIMARY KEY,               -- UUID string
  challenge_id     TEXT NOT NULL,
  user_id          TEXT,                            -- nullable for global instances
  team_id          TEXT,                            -- nullable unless teams enabled

  seed             TEXT NOT NULL,                   -- deterministic generator seed
  issued_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  expires_at       TEXT,                            -- nullable
  is_revoked       INTEGER NOT NULL DEFAULT 0,

  public_payload_json   TEXT NOT NULL,              -- JSON returned to player
  private_payload_json  TEXT,                       -- JSON not returned (optional)

  FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

  -- enforce one instance per user per challenge (tune as desired)
  UNIQUE (challenge_id, user_id)
);
CREATE INDEX idx_instances_challenge_user ON challenge_instances (challenge_id, user_id);
CREATE INDEX idx_instances_challenge_team ON challenge_instances (challenge_id, team_id);



CREATE TABLE submissions (
  submission_id    TEXT PRIMARY KEY,               -- UUID string
  challenge_id     TEXT NOT NULL,
  user_id          TEXT NOT NULL,
  instance_id      TEXT,                            -- may be null if global/no instance

  submitted_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),

  -- store either raw answer (optional) or a hash; for CTF, storing raw can be sensitive
  answer_text      TEXT,
  answer_hash      TEXT,

  is_correct       INTEGER NOT NULL DEFAULT 0,      -- 1=true, 0=false
  awarded_points   INTEGER NOT NULL DEFAULT 0,
  hint_penalty     INTEGER NOT NULL DEFAULT 0,

  client_ip        TEXT,                            -- optional
  user_agent       TEXT,                            -- optional

  FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (instance_id) REFERENCES challenge_instances(instance_id) ON DELETE SET NULL
);
CREATE INDEX idx_submissions_user_chal_time ON submissions (user_id, challenge_id, submitted_at);
CREATE INDEX idx_submissions_correct ON submissions (is_correct);
CREATE INDEX idx_submissions_chal_correct ON submissions (challenge_id, is_correct);



CREATE TABLE teams (
  team_id      TEXT PRIMARY KEY,                   -- UUID string
  name         TEXT NOT NULL UNIQUE,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE team_members (
  team_id     TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'member',      -- 'owner','admin','member'
  joined_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),

  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_team_members_user ON team_members (user_id);



CREATE TABLE solves (
  solve_id        TEXT PRIMARY KEY,               -- UUID string
  challenge_id    TEXT NOT NULL,
  user_id         TEXT NOT NULL,
  solved_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  points_awarded  INTEGER NOT NULL,

  UNIQUE (challenge_id, user_id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_solves_user ON solves (user_id);
CREATE INDEX idx_solves_chal ON solves (challenge_id);


