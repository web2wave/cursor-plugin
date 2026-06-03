---
name: web2wave-experiments
description: Analyze web2wave A/B experiments — fetch snapshots, summarize winners, and write ship/keep-running verdicts. Use when the user asks about experiment results, variant lift, p-values, or whether to ship a funnel change.
---

# web2wave A/B experiment readout

## Workflow

1. `web2wave_list_experiments` — find the experiment ID.
2. `web2wave_get_experiment({ id })` — confirm setup (variants, traffic split, linked quiz/paywall).
3. `web2wave_summarize_experiment({ id, primary_metric: "conversion_to_subscribe" })` — verdict per metric: winner / inconclusive / needs_more_data with lift and p-value.
4. Optional deep dive: `web2wave_get_experiment_snapshots({ id, latest: true, format: "grouped" })` for cumulative history charts.
5. Optional: trigger MCP prompt `web2wave-experiment-readout` for a Slack-ready narrative.

## Primary metrics

Common metrics from snapshots:

- `users` — sample size per variant
- `subscribe` — subscription count
- `conversion_to_subscribe` — main funnel KPI
- `arpu` — revenue per user

Pass the metric that matches the experiment hypothesis.

## Interpretation

- **Winner** — statistically significant lift; check absolute sample size before recommending ship.
- **Inconclusive** — overlapping confidence intervals or high p-value; suggest longer run or higher traffic.
- **Needs more data** — early snapshot; do not ship yet.

Cross-check trend: compare latest snapshot to prior rows via `web2wave_get_experiment_snapshots` (without `latest`) if the user cares about stability over time.

## Output format

Give the user:

1. One-line headline (winner + lift % + p-value)
2. Sample sizes per variant
3. Recommendation: ship winner / keep running / stop early
4. Caveats (seasonality, broken variant, uneven traffic)
