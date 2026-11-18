---
week: w00
minimum: true
---

# w00 · Publish pipeline

Study repo → blog, without copy-paste

**The scenario:** You push a post in the study repo on Saturday. It must appear on buildwithvibs.in with no manual step, and never publish a draft.

**Core (6 hours):** Create the system-design-public repo. In the site's deploy workflow, check out the study repo and copy posts marked published into blog/posts before the build. Merge posts.json. Daily schedule plus a manual run button. Timebox: 4 hours.

**Break it:** Push a draft (must not appear). Push two posts with the same slug. Run the deploy twice in a row: nothing should change the second time.

**Concepts:** push vs pull, least privilege tokens, why GITHUB_TOKEN pushes don't trigger workflows, idempotent builds, single source of truth

**Read:** GitHub docs: triggering a workflow from a workflow (the GITHUB_TOKEN section)

## How to run

<!-- Commands to start this week's project, e.g. docker compose up -->

---

Short on time this week? Set `minimum: true` above, write one diagram in design.md and a short post. It keeps the streak.
