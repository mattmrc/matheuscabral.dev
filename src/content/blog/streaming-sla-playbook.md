---
title: Building Reliable ETL in Databricks
summary: A practical playbook + checklist for keeping Python and PySpark pipelines stable as reporting needs evolve.
date: 2025-02-14
tags: [ETL, Databricks, Reliability]
readingTime: 10 min read
---

Reliable ETL doesn’t happen by accident — it’s the outcome of **clear interfaces**, **repeatable patterns**, and **observable behavior**. This playbook is a pragmatic set of practices you can adopt in Databricks to keep pipelines stable even as sources change, stakeholders add new KPIs, and “quick fixes” start to pile up.

The goal is simple: **your dashboards should be boring** — predictable refreshes, explainable numbers, and alerts that fire only when something truly breaks.

## Key takeaways

- Treat ETL as a product: define **inputs, outputs, owners, and expectations** (freshness, completeness, correctness).
- Prefer small, composable transforms over “one giant notebook” to reduce blast radius and increase reuse.
- Bake in validation and observability so failures are **caught before** they reach reporting tables.

## What “reliable” means in practice

Reliability is easiest to operationalize as a small set of measurable promises:

- **Freshness / latency:** how quickly data becomes available after it is produced.
- **Completeness:** whether you have *all* the expected records for a time window or partition.
- **Correctness:** whether data follows schema rules and business constraints.
- **Stability:** whether code changes can ship without causing regressions.

If you already track SLAs/SLOs, map the promises above directly to them. If you don’t, start with a single “north-star” promise for your most important table (e.g., “daily revenue ready by 08:30 with <0.5% missing rows”).

## Architecture patterns that keep pipelines sane

### 1) Layer your data model (Bronze → Silver → Gold)

Even if you don’t fully implement “medallion architecture,” the concept is useful:

- **Bronze (ingest):** append-only, raw-ish, minimal assumptions.
- **Silver (clean):** standardized schema, deduplication, conformance, basic quality gates.
- **Gold (serve):** KPI-ready aggregates/dimensions aligned with stakeholder definitions.

When things break, this layering tells you *where* to look first (source vs. transform vs. metric logic).

### 2) Make transforms composable

Avoid notebooks that do everything. Prefer a structure like:

- `io/` (read/write helpers)
- `transforms/` (pure functions: input DF → output DF)
- `checks/` (validation rules + expectations)
- `jobs/` (orchestrate tasks, parameters, and dependencies)

A good rule: **each transform should do one thing well** and be testable in isolation.

### 3) Parameterize partitions and time windows

Hard-coded dates and ad-hoc filters are a reliability killer. Build consistent conventions:

- `run_date`, `start_ts`, `end_ts`
- `env` (dev/stage/prod)
- partition keys (e.g., `event_date`, `ingest_date`)

Databricks Jobs parameters + widgets + task values can keep this consistent.

## Validation: catch issues before dashboards do

You don’t need a heavyweight framework on day one — start with a few high-signal checks and grow over time.

### Schema & contract checks

- Ensure required columns exist and types are correct.
- Block breaking changes (renamed columns, widened numeric types, altered semantics).
- Version expectations when a change is intentional.

### Row count & completeness checks

- Compare counts to historical baselines (same weekday, same hour).
- Verify expected partitions exist and are non-empty.
- Detect “silent truncation” (e.g., upstream stopped emitting a category).

### Business rule checks (the important ones)

Focus on constraints stakeholders actually care about:

- revenue ≥ 0, discounts within bounds, timestamps not in the future (beyond clock drift),
- foreign keys match known dimension values,
- event ordering constraints when applicable.

When a rule fails, your job should do one of:
- **fail fast** (hard gate), or
- **quarantine** bad records + continue with a clear warning, depending on risk.

## Observability: make pipelines easy to debug

### Emit the right metrics

At minimum, record per table (and ideally per partition):

- input/output row counts
- null-rate for critical columns
- distinct counts for key identifiers
- processing time per step
- “late data” rate (if streaming/micro-batch)

Store these metrics in a small **pipeline telemetry table** so you can graph trends and set alert thresholds.

### Logs that help at 3AM

Prefer structured logging (key/value) over long print statements. Always include:

- `job_name`, `run_id`, `task_name`
- dataset/table name
- partition or window boundaries
- record counts and checkpoint ids (where relevant)

### Alerts tied to impact

Not all failures are equal. Route alerts by severity:

- **SEV1:** KPIs will be wrong or missing (e.g., gold tables not updated).
- **SEV2:** partial degradation (e.g., late partitions, elevated null-rate).
- **SEV3:** internal issues without user impact (e.g., slow job, retry storm).

## Releases: ship changes without fear

### Treat ETL code like application code

- PR reviews with a checklist (below)
- automated tests for core transforms
- staging runs against production-like data
- explicit rollbacks (previous job version or tag)

### Prefer additive changes

Most “breaking ETL incidents” are schema-related. When possible:

- add new columns instead of renaming,
- introduce new tables/views and deprecate old ones,
- version outputs (`gold_sales_v2`) and switch consumers intentionally.

## Checklist

Use this as a lightweight audit or PR gate. Start with what’s feasible and iterate.

### Code structure & reuse

- [ ] Shared PySpark utilities for common transformations (deduping, standardizing timestamps, common joins).
- [ ] Transforms are small and composable (pure DF → DF functions where possible).
- [ ] No duplicated KPI logic across multiple notebooks (centralize in one place).

### Data quality & validation

- [ ] Schema checks for required columns and data types before writing curated tables.
- [ ] Row count and partition completeness checks against recent baselines.
- [ ] Business-rule checks for the top 3–5 most critical KPIs.
- [ ] Invalid records are either blocked (fail-fast) or quarantined with a clear policy.

### Reliability & performance

- [ ] Partitioning strategy matches query patterns (avoid unnecessary shuffles).
- [ ] Incremental processing (MERGE/upserts) is used where appropriate, not full reloads by default.
- [ ] Idempotent writes (re-runs don’t duplicate data or corrupt outputs).
- [ ] Backfills have a documented and repeatable procedure.

### Monitoring & on-call readiness

- [ ] Pipeline telemetry table (row counts, null rates, timings) exists and is updated per run.
- [ ] Alerts are tied to **user impact** (freshness, completeness, correctness) with clear severities.
- [ ] Runbooks exist for common incidents (upstream delay, schema change, partial partition).
- [ ] Ownership is explicit: who gets paged and who signs off on SLA changes.

### Documentation & stakeholder trust

- [ ] KPI definitions are documented (inputs, filters, business assumptions, edge cases).
- [ ] Each serving table has an owner, refresh cadence, and a “known limitations” section.
- [ ] Changes to definitions are communicated and versioned (no silent metric drift).

## A simple starting point

If you’re improving an existing pipeline that’s already in production, start with this order:

1. Add telemetry (counts, null rates, timings) so you can see reality.
2. Add a single hard gate for the most damaging failure mode (often schema or missing partitions).
3. Refactor the pipeline into smaller transforms so future changes are safer.
4. Only then optimize performance — reliability first, speed second.
