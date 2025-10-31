
# Welcome to x61ctf: A Capture the Flag Platform 

## Stack

**React / Cloudflare Pages (Frontend Portal)**
**Cloudflare Workers + D1 (API + source of truth)**
**Terraform + Docker (challenge provisioning on VPS / DigitalOcean)**
**CTFd (scoreboard & team management)**

---

## High-Level Architecture

```
╔════════════════════════════════════════╗        ╔══════════════════════════╗
║               Cloudflare               ║        ║   DigitalOcean Droplet   ║
║----------------------------------------║        ║  (Challenge Runtime)     ║
║  React Portal (Cloudflare Pages)       ║        ║                          ║
║  API Gateway (Cloudflare Workers)      ║        ║   Docker Engine          ║
║  D1 DB (SQLite serverless)             ║ <--->  ║   Terraform-managed      ║
║  Auth / CORS / Rate limiting           ║        ║   challenge containers   ║
╚════════════════════════════════════════╝        ╚══════════════════════════╝
                 │                                              ▲
                 │ submits flag                                 │
                 ▼                                              │
╔═══════════════════════════════════════════════════════════════╝
║               CTFd Scoreboard (AWS or Azure)                  ║
║  - Team mgmt / scoring / UI for results                       ║
║  - Consumes /challenges and /submit endpoints                 ║
╚═══════════════════════════════════════════════════════════════╝

```

## Components

| Component                 | Location               | Responsibility                                                     | Technology           |
| ------------------------- | ---------------------- | ------------------------------------------------------------------ | -------------------- |
| **Frontend React Portal** | Cloudflare Pages       | List challenges, handle submissions, display team info             | React + Tailwind     |
| **API / business logic**  | Cloudflare Workers     | `/challenges`, `/submit`, `/scoreboard` endpoints, flag validation | Workers (TypeScript) |
| **Source of Truth DB**    | Cloudflare D1          | Stores flags, challenges, solves, users, teams                     | SQLite (D1)          |
| **Scoreboard**            | (AWS/Azure/Cloudflare) | Team ranking UI and admin controls                                 | **CTFd**             |
| **Challenge Instances**   | DigitalOcean VPS       | Individual challenges (web, pwn, misc) encapsulated in Docker      | Docker + Terraform   |

---

## Lifecycle & Flow

1. **Developer adds challenge**

   * Write challenge files (`/challenges/<slug>/Dockerfile`).
   * Add metadata + correct flag (hashed) into D1 via a CLI script.

2. **Terraform deployment**

   * Terraform reads challenge metadata from repository
   * Spins up challenge containers on the VPS (Docker provider)
   * Outputs public URLs (e.g., `web1.ctf.x61ctf.xyz`)

3. **Workers API**

   * `/challenges` returns the list with metadata + URLs
   * `/submit` validates the flag and records solve in D1
   * `/scoreboard` exposes simple aggregated scoring
   * `/account` returns validated user token 
   * `/rules` displays rules (add checkbox and field in user table of date and
     time rules were agreed to)

4. **CTFd**

   * Displays scoreboard + team management
   * Pulls challenge list from Workers (optional import)

5. **React Frontend**

   * Calls Workers API
   * Displays challenge list
   * Provides submission UI

---

## Database (D1)

Tables (tentative):

```
users(id, handle, rules_ack)
teams(id, name)
team_members(team_id, user_id)
challenges(id, slug, name, source, category)
challenge_flags(challenge_id, flag_hash, scope, team_id)
solves(team_id, challenge_id, first_blood, created_at)
```

Flags are **never stored in plaintext** — only as `HMAC(secret, flag)`.

---

## Deployment

| Layer        | Deploys via                                          |
| ------------ | ---------------------------------------------------- |
| React portal | Cloudflare Pages → auto deploy on `main`             |
| Workers API  | `wrangler deploy` (CI/CD pipeline on cf)             |
| Database     | `wrangler d1 execute ...` migrations                 |
| Challenges   | Terraform `apply` → Docker containers via DO Droplet |
| Scoreboard   | Docker container running CTFd in some cloud provider |

---

## Local Dev

```bash
# run frontend locally
pnpm install
pnpm run dev

# run worker locally for testing
npx wrangler dev

# create the D1 instance
npx wrangler d1 create <dbname>

# run migrations
npx wrangler d1 execute <dbname> --file=./path/to/<schemaname>.sql
```

---

## Terraform Directory Structure (tentative)

```
infrastructure/
├── main.tf
├── droplet.tf
├── docker-provider.tf
└── challenge_*.tf   # Each challenge container
```

Terraform pattern:

```hcl
resource "docker_container" "web1" {
  name  = "web1"
  image = "ghcr.io/you/ctf-web1:latest"
  ports {
    internal = 8080
    external = 10001
  }
}
```

---

## Workers API Endpoints

| Method | Endpoint      | Description                                    |
| ------ | ------------- | ---------------------------------------------- |
| `GET`  | `/challenges` | Returns challenge metadata + URLs              |
| `POST` | `/submit`     | Validates flag → D1 update → scoreboard update |
| `GET`  | `/scoreboard` | Returns ranking + first blood info             |
| `GET`  | `/rules`      | Returns rules info                             |
| `GET`  | `/account`    | Returns account info                           |

---

## Security Model

* Workers validate flags centrally → challenge containers stay stateless
* No DB access from VPS challenges
* Cloudflare handles WAF, TLS, rate limiting
* Flags stored as **HMAC(secret, flag)**, not plaintext

---

## Notes

* VPS RAM should go towards challenge containers, not scoreboard or DB.
* Using Cloudflare + D1 means **scoreboard DB load never affects challenge runtime**.
* Terraform keeps your challenge infra **deterministic and repeatable**.
* Running CTFd on a separate network resource (cloud vm) keeps load off
  containers.

---

## Backlog / Future Enhancements

* GitHub Actions build & deploy of all challenge images → GHCR
* Per-team dynamic flags
* Remote validation (challenge verifies flag, not API)
* Suggestions?

---

## License

MIT 

---

