# Measures of Central Tendency — `stats-central-tendency`

Sim: `js/simulations_statistics_datalab.js` (`mode: 'datalab'`). Syllabus:
`XI-A-U3-CENTRAL-TENDENCY`.

## What

Mean, Median, Mode computed live from a student-editable table of values.

## Why

Three different ways to answer "what's typical here?", each with a different
sensitivity to the shape of the data.

## Assumptions

- Ungrouped (raw, not class-interval) data — matches the syllabus's Unit 3
  ordering, where ungrouped measures are taught before grouped-data formulas.
- Mode is reported as **all** values tied for highest frequency, not
  arbitrarily the first one — a genuine multi-modal dataset must show every
  mode, not silently pick one (`js/simulations_statistics_datalab.js:41-43`).

## Variables

`values[]` (the Marks column, 0–100, 4–20 rows).

## Relationship / Math

- Mean `x̄ = Σx / n`.
- Median = middle value of the sorted array (average of the two middle
  values when `n` is even).
- Mode = value(s) with the highest frequency; `maxFreq <= 1` (every value
  unique) is reported as "No mode," not a fabricated one.

## Skewness inference (the `interpretation` line)

`mean > median + 0.5` ⇒ reported as positively skewed; `mean < median - 0.5`
⇒ negatively skewed; otherwise "roughly symmetric." This is a **direct,
correct** consequence of the definitions — a positive skew (a long right
tail of a few high outliers) pulls the mean above the median because the
mean uses the outliers' magnitude while the median only uses their rank.
The ±0.5 tolerance exists so noise in small datasets doesn't flip the label
on a near-symmetric distribution — verified by hand for the sim's own
default 8-row dataset (mean 53, median 52 ⇒ correctly "roughly symmetric").

## Comparative statics

| Change | Mean | Median | Mode |
|---|---|---|---|
| Add one high outlier | Moves the most | Barely moves | Unaffected unless it repeats |
| Two values tie for most frequent | Unaffected | Unaffected | Reports both, correctly bimodal |
| All values become equal | Converges to that value | Converges to that value | Converges to that value |

## Interpretation

The Mean/Median gap is the standard, board-tested signal for skew direction;
the sim makes that relationship discoverable by direct manipulation instead
of asserted in prose.

## Limitation

Ungrouped only — the syllabus also covers Mean/Median/Mode for grouped
(class-interval) data with different formulas (assumed mid-point, cumulative
frequency for median, modal-class formula); this sim does not model that
extension, and does not claim to (its `dataLab.columns` are single raw
values, not class intervals).

## Misconception

"A dataset always has exactly one mode." False — this sim's own no-mode and
multi-modal cases are reachable by editing the table, precisely so a student
can see both "no mode" (all-unique) and "bimodal" (a genuine tie) rather
than assuming a mode always exists and is unique.

## Simulation mapping

`calculate(rows)` → `{traces, layout, stats, metrics: {mean, median, mode, n}, interpretation}`,
consumed directly by `datalab-engine.js`; `challenge.check` reads
`metrics.mean/median/mode` (never re-derives them), so the challenge cannot
drift from what's actually plotted.
