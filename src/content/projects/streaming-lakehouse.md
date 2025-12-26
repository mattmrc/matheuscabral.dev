---
title: Financial ETL Modernization on Databricks
description: Refactored legacy financial ETL into modular PySpark pipelines and SQL models for faster, cleaner reporting.
tags: [ETL, Finance, Data Quality]
stack: [Python, PySpark, SQL, Databricks]
highlights:
  - Reduced repetitive SQL logic by modularizing shared transformations.
  - Added validation checks to improve downstream data quality.
  - Simplified change requests by standardizing pipeline structure.
featured: true
status: Production
---

## Outcome

A streamlined ETL workflow now powers finance reporting with clearer logic, faster updates, and fewer manual fixes.

## What I did

- Rebuilt ingestion and transformation steps in Python and PySpark.
- Standardized shared logic across datasets to reduce duplication.
- Added validation checks before publishing to reporting tables.

## Next steps

Expand automated monitoring to flag data anomalies before stakeholders see them.
