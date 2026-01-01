import React from "react";
import { Outlet } from "react-router";
export default function Rules() {
  return (
    <React.Fragment>
      <section className="rules" aria-labelledby="rules-title">
        <header className="rules__hero">
          <div className="rules__heroInner">
            <p className="rules__kicker">CTF Rules</p>
            <h1 id="rules-title" className="rules__title">Rules of Play</h1>
            <p className="rules__subtitle">
              These rules exist to keep the game fair, keep the infrastructure stable, and protect other players.
              By participating, you agree to follow this ruleset.
            </p>
            <p className="rules__meta">
              Last updated: <time datetime="2025-12-27">December 27, 2025</time>
            </p>
          </div>
        </header>

        <main className="rules__content">
          <section className="card" aria-labelledby="overview-title">
            <h2 id="overview-title" className="card__title">1) Overview</h2>
            <ul className="list">
              <li>
                <strong>Scope:</strong> Only attack targets explicitly provided by this platform (challenge endpoints,
                downloadable files, and challenge containers that the platform assigns to you).
              </li>
              <li>
                <strong>Fair play:</strong> Solve challenges using your own work. Compete honestly and avoid actions that
                degrade the experience for others.
              </li>
              <li>
                <strong>Safety:</strong> Do not attempt to access, disrupt, or exfiltrate data from platform infrastructure,
                other player accounts, or third-party systems.
              </li>
            </ul>
          </section>

          <section className="card" aria-labelledby="account-title">
            <h2 id="account-title" className="card__title">2) Accounts, Teams, and Identity</h2>
            <ul className="list">
              <li>
                <strong>One person, one account:</strong> Do not create multiple accounts to gain an advantage.
              </li>
              <li>
                <strong>Team play:</strong> If team mode is enabled for an event, follow the event-specific rules regarding
                team size and eligibility.
              </li>
              <li>
                <strong>Account sharing:</strong> Do not share credentials or tokens. You are responsible for activity
                performed under your account.
              </li>
              <li>
                <strong>Respect privacy:</strong> Do not dox, harass, or threaten other participants. Do not attempt to
                obtain private information about other players.
              </li>
            </ul>
          </section>

          <section className="card" aria-labelledby="allowed-title">
            <h2 id="allowed-title" className="card__title">3) Allowed and Disallowed Actions</h2>

            <div className="twoCol" role="list">
              <article className="panel panel--ok" role="listitem" aria-labelledby="allowed-actions-title">
                <h3 id="allowed-actions-title" className="panel__title">Allowed</h3>
                <ul className="panel__list">
                  <li>Reverse engineering binaries and scripts provided as part of a challenge.</li>
                  <li>Analyzing packet captures, memory dumps, disk images, logs, and artifacts provided by challenges.</li>
                  <li>Interacting with challenge services and containers <strong>assigned to you</strong>.</li>
                  <li>Using common security tools and techniques against in-scope targets.</li>
                  <li>Automating your own solution workflow (scripts, notebooks, tooling), within rate limits.</li>
                  <li>Asking for hints in IRC without posting flags or full solutions.</li>
                </ul>
              </article>

              <article className="panel panel--no" role="listitem" aria-labelledby="disallowed-actions-title">
                <h3 id="disallowed-actions-title" className="panel__title">Not Allowed</h3>
                <ul className="panel__list">
                  <li>
                    <strong>Attacking the platform:</strong> attempts to exploit the website, APIs, authentication, or
                    infrastructure outside of challenge intent.
                  </li>
                  <li>
                    <strong>Attacking other players:</strong> phishing, credential stuffing, session/token theft, or any
                    attempt to access another player’s account or assigned environment.
                  </li>
                  <li>
                    <strong>Denial-of-service:</strong> traffic floods, resource exhaustion, or abusive automation that
                    impacts availability for others.
                  </li>
                  <li>
                    <strong>Out-of-scope scanning:</strong> port scanning or vulnerability scanning of platform IP ranges or
                    third-party networks except where explicitly instructed by a challenge.
                  </li>
                  <li>
                    <strong>Data exfiltration:</strong> accessing or copying sensitive data not intended by a challenge
                    (including platform logs, secrets, keys, databases, or other users’ data).
                  </li>
                  <li>
                    <strong>Cheating:</strong> sharing flags publicly, selling flags/solves, or using leaked solutions.
                  </li>
                  <li>
                    <strong>Malware propagation:</strong> launching worms, botnets, or any code intended to self-replicate or
                    spread beyond the challenge scope.
                  </li>
                </ul>
              </article>
            </div>

            <p className="callout" role="note">
              If a challenge appears to enable unintended access to platform systems, stop and report it. Do not continue
              exploiting beyond what is necessary to demonstrate the issue.
            </p>
          </section>

          <section className="card" aria-labelledby="flags-title">
            <h2 id="flags-title" className="card__title">4) Flags, Submissions, and Writeups</h2>
            <ul className="list">
              <li>
                <strong>Flags:</strong> Treat flags as sensitive. Do not post them in public channels, screenshots, streams,
                gists, or repositories.
              </li>
              <li>
                <strong>Submission:</strong> Only submit flags you personally earned. If team play is enabled, follow the
                event rules for team credit and collaboration.
              </li>
              <li>
                <strong>Writeups:</strong> If writeups are allowed, wait until the platform explicitly announces the
                challenge/event has ended or the challenge is archived. When in doubt, ask in IRC.
              </li>
              <li>
                <strong>Brute force:</strong> Brute forcing flags or credentials is disallowed unless a challenge explicitly
                states that brute force is intended and provides appropriate constraints.
              </li>
            </ul>
          </section>

          <section className="card" aria-labelledby="automation-title">
            <h2 id="automation-title" className="card__title">5) Automation, Rate Limits, and Resource Use</h2>
            <ul className="list">
              <li>
                <strong>Be a good citizen:</strong> Keep requests reasonable. Respect rate limits and back off if you see
                errors indicating throttling.
              </li>
              <li>
                <strong>No noisy scanning:</strong> Automated scanning of targets is disallowed unless a challenge directs
                you to do so.
              </li>
              <li>
                <strong>Container usage:</strong> If you are granted a challenge container, use it only for that challenge.
                Do not attempt to mine cryptocurrency, run unrelated services, or use it as general compute.
              </li>
              <li>
                <strong>Cleanup:</strong> Stop environments when finished so resources remain available for other players.
              </li>
            </ul>
          </section>

          <section className="card" aria-labelledby="reporting-title">
            <h2 id="reporting-title" className="card__title">6) Reporting Issues and Responsible Disclosure</h2>
            <ul className="list">
              <li>
                <strong>Challenge bugs:</strong> If you find a bug that breaks a challenge (but not platform security), report
                it so it can be fixed.
              </li>
              <li>
                <strong>Security vulnerabilities:</strong> If you believe you’ve found a platform vulnerability, do not
                exploit it beyond minimal proof. Report it immediately.
              </li>
              <li>
                <strong>Include details:</strong> What you did, what you expected, what happened, and any relevant logs or
                steps to reproduce.
              </li>
            </ul>

            <div className="reportBox" aria-label="Contact placeholders">
              <p className="reportBox__title"><strong>Report channels</strong></p>
              <ul className="reportBox__list">
                <li><strong>IRC:</strong> Contact a moderator in <code>#your-ctf</code> (do not paste flags).</li>
                <li><strong>Email:</strong> <code>security@example.org</code> (replace with your real address).</li>
                <li><strong>Preferred:</strong> Provide a short reproduction and impact summary.</li>
              </ul>
            </div>
          </section>

          <section className="card" aria-labelledby="scoring-title">
            <h2 id="scoring-title" className="card__title">7) Scoring, Ties, and Enforcement</h2>
            <ul className="list">
              <li>
                <strong>Scoring:</strong> Points are awarded per challenge. Some challenges may be dynamic or time-based.
              </li>
              <li>
                <strong>Ties:</strong> If two players have the same score, tie-breakers may include earliest solve time or
                other event-defined criteria.
              </li>
              <li>
                <strong>Moderation:</strong> Moderators may remove points, hide solves, reset instances, or suspend accounts
                for violations.
              </li>
              <li>
                <strong>No appeal guarantee:</strong> We will review reports in good faith, but final decisions are at the
                platform’s discretion.
              </li>
            </ul>

            <p className="fineprint">
              This ruleset may be updated to address new challenge types or operational needs. Material changes will be
              announced in IRC and/or on the site.
            </p>
          </section>

          <footer className="footer" aria-label="Rules footer">
            <p className="footer__text">
              When in doubt: stay in scope, avoid disruption, and ask in IRC.
            </p>
          </footer>
        </main>
      </section>
    </React.Fragment>
  );
}
