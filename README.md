Short answer: it’s very doable on $0–20/month. You can run a polished jeopardy-style CTF with a free/open-source scoreboard, free static hosting, and either (a) free tunnels to your homelab challenges or (b) a single low-cost VPS for containerized challenges.

Here’s a pragmatic, low-cost blueprint tailored to the skills you want to practice.

# Pick a free/open-source scoreboard

* **CTFd (Apache-2.0, very popular)** – theming, plugins, admin UX; self-host for $0. ([GitHub][1])
* **rCTF (now maintained by OtterSec)** – lightweight modern stack; docs + Docker; challenge deploy handled separately (rCDS optional). ([GitHub][2])
* **RootTheBox** – “game-ified” features (banking, teams, etc.), self-host. ([GitHub][3])

# $0 hosting for the site + API

* **Cloudflare Pages** for your React front-end: free plan = unlimited static requests & bandwidth; 500 builds/mo. ([Cloudflare Pages][4])
* **Cloudflare Workers** for a tiny REST/GraphQL gateway (scoreboard API, webhooks): free includes **100k requests/day**; static requests are free & unlimited; D1 calls allowed. ([Cloudflare Workers][5])
* **Cloudflare D1 (SQLite)** for metadata (users, solves, hints, scores) on the edge; has a free plan for prototyping. ([Cloudflare Docs][6])

> Why Cloudflare? It keeps monthly spend at $0 while giving you CI-style deploys and global CDN for your front-end, plus a free serverless tier for lightweight APIs.

# Where to run challenges (two cheap paths)

**A) $0 homelab + Cloudflare Tunnel**
Run each challenge in Docker on your Proxmox/K8s and expose only via Tunnel; you get HTTPS, stable URLs, and no inbound ports. Cloudflare’s free plan + Tunnel works well for hobby use. ([Cloudflare][7])

**B) $5–$12 VPS**
If you prefer not to expose your home network, one small VPS can host a reverse proxy and spin up per-challenge containers (Traefik/Caddy + Docker Compose). (Vendor pricing varies, but one box typically stays under your $20 cap.)

# CI/CD for $0

* **GitHub Actions**: free for public repos (unlimited minutes), great for building your React app, running unit tests, seeding DB, and deploying to Pages/Workers. ([GitHub Docs][8])
* **GitLab**: free tier exists but only ~400 CI minutes/mo, so GitHub is usually the cheaper choice here. ([eesel AI][9])

# Suggested architecture (MVP → scalable)

1. **MVP (weekend build)**

   * Front-end: React (Pages)
   * API: Workers (simple REST or GraphQL resolver)
   * DB: D1 (tables: users, teams, challenges, solves, hints, submissions, notifications)
   * Scoreboard: either embed your own UI or reverse-proxy CTFd/rCTF under `/admin` and keep your React site as the public portal. ([GitHub][1])

2. **Challenges**

   * Start with pure “static” jeopardy (files, text, web) → hosted as Pages static assets or object storage.
   * Add containerized services for web/pwn/crypto misc. Use docker-compose with per-challenge networks + resource limits; publish only via Tunnel or reverse proxy.

3. **Scaling knobs (still cheap)**

   * Move metadata to **Neon** free Postgres if you outgrow D1/SQLite. (Neon’s Free plan covers small projects.) ([Neon][10])
   * For heavy, timed events, switch the scoreboard to **CTFd** or **rCTF** behind your domain; both ship Docker setups. ([GitHub][1])

# How this hits your learning goals

* **Python**: write challenge checkers, flag validators, seeders, and admin scripts; build a small FastAPI admin tool if you’d like (or Workers in JS for contrast).
* **SQL**: design the scoreboard schema; write analytics (first-bloods, solve times, difficulty curves). Move from D1 (SQLite) to Postgres (Neon) when ready. ([Neon][10])
* **React**: build the portal (landing, rules, scoreboard, team pages, write-up viewer, hint store), admin dashboards, and a challenge player.
* **Data structures & algorithms**: add “algo tracks” or autograded challenges (upload code → run in sandbox → score), and compute rankings efficiently server-side.
* **GraphQL & REST**: expose both—REST for simple fetches, GraphQL for scoreboard/search/filters. Workers make either cheap to run. ([Cloudflare Workers][5])
* **Cloud & IaC (Terraform)**: codify Cloudflare (DNS, Pages project, Workers, D1 bindings) and your VPS/docker infra.
* **CI/CD**: GitHub Actions for build/test/deploy; nightly challenge health checks and container image rebuilds. ([GitHub Docs][8])

# Concrete starter options (choose one)

* **Zero-dollar starter (homelab)**

  * React front-end on Cloudflare Pages → API on Workers → D1 DB → Challenges on your Proxmox via Cloudflare Tunnel. Cost: **$0**. ([Cloudflare Pages][4])
* **Low-cost VPS starter**

  * rCTF or CTFd in Docker on a single VPS; challenges as sibling containers; optional React portal on Pages. Cost: **$5–$12** VPS + **$0** Pages. ([GitHub][1])

# Open-source platforms to evaluate

* **CTFd** – mature ecosystem, theming, plugins, Docker images. ([GitHub][1])
* **rCTF (OtterSec)** – modern, efficient, docs; uses rCDS for challenge deployment if you want that path. ([GitHub][2])
* **RootTheBox** – gamified twist if you want something different. ([GitHub][3])

# Rough cost math

* Pages (front-end): free unlimited static requests/bandwidth. ([Cloudflare Pages][4])
* Workers (API): free up to ~**100k requests/day** (and static requests don’t count). ([Cloudflare Workers][5])
* D1 (DB): free prototyping plan. ([Cloudflare Docs][6])
* CI/CD: GitHub Actions free for public repos. ([GitHub Docs][8])
* Challenges: either **$0** (Tunnel to homelab) or **$5–$12** (one VPS). ([BlockQueue Systems Limited][11])

# A tiny first milestone (what to build this week)

1. Create a repo with a React portal (Rules, Challenges, Scoreboard).
2. Deploy to Cloudflare Pages. ([Cloudflare Pages][4])
3. Add a Workers API with endpoints: `/challenges`, `/submit`, `/scoreboard`; back it by D1 tables. ([Cloudflare Docs][6])
4. Stand up **one** Docker web challenge in your homelab and publish it via Cloudflare Tunnel. ([BlockQueue Systems Limited][11])
5. Wire GitHub Actions to run unit tests, Lint, build portal, deploy Pages, and `wrangler deploy` the Worker on every tag. ([GitHub Docs][8])

If you want, I can scaffold a minimal repo structure (React + Workers + D1 schema + GH Actions + one sample challenge/docker-compose) that you can drop into your homelab or a $5 VPS.

[1]: https://github.com/CTFd/CTFd?utm_source=chatgpt.com "CTFd/CTFd: CTFs as you need them"
[2]: https://github.com/otter-sec/rctf "GitHub - otter-sec/rctf"
[3]: https://github.com/moloch--/RootTheBox?utm_source=chatgpt.com "moloch--/RootTheBox: A Game of Hackers (CTF ..."
[4]: https://pages.cloudflare.com/?utm_source=chatgpt.com "Cloudflare Pages"
[5]: https://workers.cloudflare.com/pricing?utm_source=chatgpt.com "Pricing"
[6]: https://developers.cloudflare.com/d1/platform/pricing/?utm_source=chatgpt.com "Pricing · Cloudflare D1 docs"
[7]: https://www.cloudflare.com/plans/free/?utm_source=chatgpt.com "Free Plan Overview"
[8]: https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions?utm_source=chatgpt.com "GitHub Actions billing"
[9]: https://www.eesel.ai/blog/gitlab-pricing?utm_source=chatgpt.com "A clear guide to GitLab pricing in 2025"
[10]: https://neon.com/pricing?utm_source=chatgpt.com "Neon pricing"
[11]: https://blockqueue.io/blog/2025-08-13-cloudflared-an-nginx-alternative?utm_source=chatgpt.com "Free, Stable, and Custom: How to Use Cloudflare Tunnel with ..."

