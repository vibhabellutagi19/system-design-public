# System design in public

**Build. Break. Write.** One small app a week, one stressful scenario, one number to hit. I build it, break it on purpose, and write up what broke on [buildwithvibs.in](https://buildwithvibs.in).

- **Tracker:** `tracker/index.html` (published to GitHub Pages on every push)
- **Plan:** `plan.json` · **Ideas:** `ideas.md`

## Each week

```bash
npm run week -- w01      # create weeks/w01-…/ from the template
npm run tracker          # refresh the tracker locally, then open tracker/index.html
```

| File | The tracker ticks it when |
|---|---|
| `design.md` | its todo line is gone |
| `src/` | it has code |
| `break-it.md` | its todo line is gone |
| `post/index.md` | `published: true` |

Short week? Set `minimum: true` in the week's README. One diagram and one short post still count.
