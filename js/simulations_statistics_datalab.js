// Class XI · Part A — Statistics for Economics: the Data Lab / Concept
// Explorer content that was completely missing before this integration
// pass (Unit 1 Introduction, Unit 2 Collection/Organisation/Presentation
// of Data, Unit 3 Central Tendency). See CLAUDE.md for the data contract.

if (typeof SIMS !== 'undefined') {
    SIMS.push(
        {
            id: 'stats-central-tendency',
            module: 'stats',
            title: 'Measures of Central Tendency: Mean, Median, Mode',
            desc: 'Enter your own dataset and watch Mean, Median and Mode calculate live — with a chart showing exactly where each one sits.',
            class: 'XI', part: 'A', unit: 3, unitTitle: 'Statistical Tools and Interpretation', topicLabel: 'Mean, Median, Mode',
            syllabusIds: ['XI-A-U3-CENTRAL-TENDENCY'],
            mode: 'datalab',
            concept: '<p>Central tendency measures try to summarise a whole dataset with one representative number. The <b>Arithmetic Mean</b> uses every value but is pulled by outliers; the <b>Median</b> is the middle value when sorted, so it resists outliers; the <b>Mode</b> is simply the most frequent value. Edit the data below — a class\'s test marks, by default — and watch all three recalculate, and where they sit relative to each other, live.</p>',
            formulas: ['Mean (x̄) = Σx / n', 'Median = middle value (sorted); average of the two middle values if n is even', 'Mode = most frequently occurring value'],
            dataLab: {
                columns: [
                    { id: 'label', label: 'Student', type: 'text', default: 'Student' },
                    { id: 'value', label: 'Marks', type: 'number', step: 1, min: 0, max: 100, default: 50 }
                ],
                minRows: 4,
                maxRows: 20,
                addRowDefault: { label: 'New Student', value: 50 },
                defaultRows: [
                    { label: 'Aarav', value: 45 }, { label: 'Diya', value: 52 }, { label: 'Kabir', value: 52 },
                    { label: 'Meera', value: 60 }, { label: 'Ishaan', value: 55 }, { label: 'Ananya', value: 50 },
                    { label: 'Vihaan', value: 58 }, { label: 'Sara', value: 52 }
                ],
                calculate(rows) {
                    const values = rows.map(r => r.value);
                    const n = values.length;
                    const mean = values.reduce((s, x) => s + x, 0) / n;
                    const sorted = [...values].sort((a, b) => a - b);
                    const median = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

                    const freq = new Map();
                    values.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
                    const maxFreq = Math.max(...freq.values());
                    const modes = [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v);
                    const modeLabel = maxFreq <= 1 ? 'No mode (all values unique)' : modes.sort((a, b) => a - b).join(', ');
                    const modeValue = maxFreq <= 1 ? null : modes[0];

                    const skew = mean > median + 0.5 ? 'Positively skewed (a few high values pull the mean above the median)'
                        : mean < median - 0.5 ? 'Negatively skewed (a few low values pull the mean below the median)'
                            : 'Roughly symmetric (mean ≈ median)';

                    const traces = [{ x: rows.map(r => r.label), y: values, type: 'bar', name: 'Marks', marker: { color: '#2563eb' } }];
                    if (isFinite(mean)) traces.push({ x: rows.map(r => r.label), y: rows.map(() => mean), mode: 'lines', name: 'Mean', line: { color: '#10b981', width: 2, dash: 'dash' } });
                    if (isFinite(median)) traces.push({ x: rows.map(r => r.label), y: rows.map(() => median), mode: 'lines', name: 'Median', line: { color: '#f59e0b', width: 2, dash: 'dot' } });

                    return {
                        traces,
                        layout: { xaxis: { title: 'Student' }, yaxis: { title: 'Marks' } },
                        stats: [
                            { label: 'n (data points)', value: n },
                            { label: 'Mean (x̄)', value: fmt(mean) },
                            { label: 'Median', value: fmt(median) },
                            { label: 'Mode', value: modeLabel }
                        ],
                        metrics: { mean, median, mode: modeValue, n },
                        interpretation: `${skew}. ${maxFreq <= 1 ? 'With every value unique here, the mode doesn\'t summarise this dataset well — mean or median are more useful.' : `${maxFreq} students share the modal value of ${modeLabel} — the single most common score.`}`
                    };
                }
            },
            practice: [
                { prompt: 'Add one very high outlier (e.g. 99) as a new row. Which measure moves the most — Mean, Median or Mode?', hint: 'Mean moves the most (it uses every value); Median barely moves; Mode is unaffected unless 99 repeats.' },
                { prompt: 'Edit the data so exactly two different values are tied for most frequent.', hint: 'Give two different Marks values the same frequency (e.g. three students score 52 AND three score 60) — the readings panel will list both as the mode.' }
            ],
            challenge: {
                prompt: 'Edit the marks so Mean, Median and Mode are all different from one another.',
                check(state, metrics) {
                    if (!metrics || metrics.mode === null || metrics.mode === undefined) return false;
                    const a = metrics.mean, b = metrics.median, c = metrics.mode;
                    return Math.abs(a - b) > 0.5 && Math.abs(b - c) > 0.5 && Math.abs(a - c) > 0.5;
                }
            }
        },
        {
            id: 'stats-data-organisation',
            module: 'stats',
            title: 'Raw Data → Frequency Distribution → Histogram, Polygon & Ogive',
            desc: 'Type raw observations in; the lab classifies them into a frequency distribution and draws the Histogram, Frequency Polygon and Ogive from it.',
            class: 'XI', part: 'A', unit: 2, unitTitle: 'Collection, Organisation and Presentation of Data', topicLabel: 'Organisation & Frequency Diagrams',
            syllabusIds: ['XI-A-U2-ORG', 'XI-A-U2-PRESENT'],
            mode: 'datalab',
            concept: '<p>Raw, unclassified data is hard to read at a glance. <b>Organisation of Data</b> groups it into a <b>frequency distribution</b> — equal-width class intervals, each with a count (frequency) of how many observations fall in it. That frequency distribution is then <b>presented</b> as a <b>Histogram</b> (bars, no gaps, area ∝ frequency), a <b>Frequency Polygon</b> (line joining each class\'s midpoint, closed to zero at both ends), and an <b>Ogive</b> (cumulative "less than" frequency curve). Type in raw numbers below — marks, ages, incomes, anything — and this lab classifies them into 5 class intervals automatically and draws all three.</p>',
            formulas: ['Class Width = (Max − Min) / Number of Classes', 'Frequency = count of observations within a class interval', 'Cumulative ("less than") Frequency = running total up to a class\'s upper boundary'],
            dataLab: {
                columns: [{ id: 'value', label: 'Raw Observation', type: 'number', step: 1, default: 50 }],
                minRows: 8,
                maxRows: 30,
                addRowDefault: { value: 50 },
                defaultRows: [12, 15, 18, 21, 22, 25, 27, 28, 30, 31, 33, 35, 36, 38, 40, 42, 44, 47, 50, 55].map(value => ({ value })),
                calculate(rows) {
                    const values = rows.map(r => r.value);
                    const n = values.length;
                    const min = Math.min(...values), max = Math.max(...values);
                    const numClasses = 5;
                    let classWidth = (max - min) / numClasses;
                    if (!isFinite(classWidth) || classWidth <= 0) classWidth = 1;

                    const classes = range(numClasses).map(i => {
                        const lower = min + i * classWidth;
                        const upper = i === numClasses - 1 ? max : lower + classWidth;
                        return { lower, upper, midpoint: (lower + upper) / 2 };
                    });
                    const freq = classes.map((c, i) => values.filter(v => (i === numClasses - 1) ? (v >= c.lower && v <= c.upper) : (v >= c.lower && v < c.upper)).length);
                    let running = 0;
                    const cumFreq = freq.map(f => { running += f; return running; });
                    const maxFreq = Math.max(...freq);
                    const modalClassIndex = freq.indexOf(maxFreq);

                    const polygonX = [classes[0].midpoint - classWidth, ...classes.map(c => c.midpoint), classes[numClasses - 1].midpoint + classWidth];
                    const polygonY = [0, ...freq, 0];

                    return {
                        traces: [
                            { x: classes.map(c => c.midpoint), y: freq, type: 'bar', name: 'Histogram', marker: { color: '#93c5fd' }, width: classes.map(() => classWidth * 0.95) },
                            { x: polygonX, y: polygonY, mode: 'lines+markers', name: 'Frequency Polygon', line: { color: '#2563eb', width: 2 } },
                            { x: classes.map(c => c.upper), y: cumFreq, mode: 'lines+markers', name: 'Ogive (Less Than)', line: { color: '#ef4444', width: 2 }, yaxis: 'y2' }
                        ],
                        layout: {
                            xaxis: { title: 'Class Interval (midpoint / upper boundary)' },
                            yaxis: { title: 'Frequency' },
                            yaxis2: { title: 'Cumulative Frequency', overlaying: 'y', side: 'right', range: [0, n * 1.1] }
                        },
                        stats: [
                            { label: 'n (observations)', value: n },
                            { label: 'Range', value: fmt(max - min, 1) },
                            { label: 'Class Width', value: fmt(classWidth, 1) },
                            { label: 'Modal Class', value: `${fmt(classes[modalClassIndex].lower, 1)}–${fmt(classes[modalClassIndex].upper, 1)}` }
                        ],
                        metrics: { modalClassIndex, numClasses, n },
                        interpretation: `Most observations (${maxFreq} of ${n}) fall in the ${fmt(classes[modalClassIndex].lower, 1)}–${fmt(classes[modalClassIndex].upper, 1)} class — the modal class. The Ogive's steepest section lines up with this same class, since that's where cumulative frequency climbs fastest.`
                    };
                }
            },
            practice: [
                { prompt: 'Add several new observations all just above the current maximum. What happens to the Modal Class?', hint: 'New class intervals stretch to cover the new max — watch whether enough of them land in the top class to make it the new mode.' },
                { prompt: 'Make all your observations identical. What happens to the Histogram?', hint: 'Class Width collapses toward a single point and every observation lands in one class — a reminder that Range=0 is a degenerate case the lab guards against crashing on.' }
            ],
            challenge: {
                prompt: 'Edit the data so the highest class interval (not the lowest or middle) becomes the Modal Class.',
                check(state, metrics) { return metrics && metrics.modalClassIndex === metrics.numClasses - 1; }
            }
        },
        {
            id: 'stats-data-presentation',
            module: 'stats',
            title: 'Presentation of Data: Bar & Pie Diagrams',
            desc: 'Enter category totals and see the same data as both a Bar diagram and a Pie diagram, computed from one shared table.',
            class: 'XI', part: 'A', unit: 2, unitTitle: 'Collection, Organisation and Presentation of Data', topicLabel: 'Tabulation & Geometric (Bar/Pie) Diagrams',
            syllabusIds: ['XI-A-U2-PRESENT'],
            mode: 'datalab',
            concept: '<p>The same tabulated data can be presented several ways. <b>Bar diagrams</b> make categories easy to compare by height; <b>Pie diagrams</b> make each category\'s <i>share of the total</i> easy to see at a glance. Both come from exactly the same table — edit any category or value below and both diagrams update together, so you can see they are two views of one dataset, not two different datasets. (An <b>arithmetic line/time-series graph</b> — the third named presentation form — is simply this same idea plotted with Year on the X-axis instead of a category; see the Index Numbers Data Lab for a worked time-series line chart.)</p>',
            formulas: ['Category Share (%) = (Category Value / Total) × 100'],
            dataLab: {
                columns: [
                    { id: 'category', label: 'Category', type: 'text', default: 'Category' },
                    { id: 'value', label: 'Value', type: 'number', step: 1, min: 0, default: 10 }
                ],
                minRows: 3,
                maxRows: 8,
                addRowDefault: { category: 'New Category', value: 10 },
                defaultRows: [
                    { category: 'Food', value: 35 }, { category: 'Housing', value: 20 }, { category: 'Education', value: 15 },
                    { category: 'Transport', value: 10 }, { category: 'Health', value: 8 }, { category: 'Other', value: 12 }
                ],
                calculate(rows) {
                    const total = rows.reduce((s, r) => s + r.value, 0);
                    const withShare = rows.map(r => ({ ...r, share: total > 0 ? (r.value / total) * 100 : 0 }));
                    const largest = withShare.reduce((m, r) => r.value > m.value ? r : m, withShare[0]);
                    const smallest = withShare.reduce((m, r) => r.value < m.value ? r : m, withShare[0]);

                    return {
                        traces: [
                            { x: rows.map(r => r.category), y: rows.map(r => r.value), type: 'bar', name: 'Bar Diagram', marker: { color: '#2563eb' }, xaxis: 'x', yaxis: 'y' },
                            { labels: rows.map(r => r.category), values: rows.map(r => r.value), type: 'pie', name: 'Pie Diagram', domain: { x: [0.58, 1], y: [0.08, 0.95] }, textinfo: 'label+percent', showlegend: false }
                        ],
                        layout: { xaxis: { title: 'Category', domain: [0, 0.42] }, yaxis: { title: 'Value' }, showlegend: false, margin: { t: 20, r: 10, b: 55, l: 60 } },
                        stats: [
                            { label: 'Total', value: fmt(total, 0) },
                            { label: 'Largest Category', value: `${largest.category} (${fmt(largest.share, 1)}%)` },
                            { label: 'Smallest Category', value: `${smallest.category} (${fmt(smallest.share, 1)}%)` }
                        ],
                        metrics: { total, largestShare: largest.share },
                        interpretation: `${largest.category} is the biggest slice at ${fmt(largest.share, 1)}% of the total — the bar diagram makes its absolute size easy to compare against the others, while the pie diagram makes its <i>share</i> of the whole immediately visible.`
                    };
                }
            },
            practice: [
                { prompt: 'Increase one category until it is more than half the total. Watch both diagrams update from the same table.', hint: 'The bar for that category grows tallest, and its pie slice passes the halfway point of the circle — both driven by the same edit.' }
            ],
            challenge: {
                prompt: 'Make the largest category account for more than 50% of the total.',
                check(state, metrics) { return metrics && metrics.largestShare > 50; }
            }
        },
        {
            id: 'stats-data-collection',
            module: 'stats',
            title: 'Economics, Statistics & Collecting Data',
            desc: 'What economics and statistics study, and how data gets collected: primary vs secondary, sampling vs census.',
            class: 'XI', part: 'A', unit: 1, unitTitle: 'Introduction', topicLabel: 'Economics, Statistics & Data Collection',
            syllabusIds: ['XI-A-U1-ECONOMICS', 'XI-A-U1-STATS-ROLE', 'XI-A-U2-COLLECTION'],
            mode: 'explorer',
            concept: '<p>Before any calculation, statistics starts with a question: where does the data come from? This explorer walks through what economics and statistics study, and the two big data-collection choices every study makes: <b>primary vs secondary data</b>, and <b>sampling vs a full census</b>.</p>',
            formulas: [],
            explorer: {
                type: 'scenario',
                scenarios: [
                    {
                        id: 'economics', label: 'What is Economics?', summary: 'Economics studies how scarce resources are allocated among competing uses — as a social science, it turns real economic problems into quantitative and qualitative information that can be analysed.',
                        sections: [
                            { heading: 'Scope', items: ['Studies production, distribution and consumption of goods & services', 'Uses both quantitative information (numbers) and qualitative information (descriptions, institutions, policy)'] }
                        ],
                        insight: 'Every simulation, data lab and explorer in this app is one economics question turned into either a variable relationship, a dataset, or a policy/historical narrative — that three-way split is exactly what "quantitative vs qualitative economic information" means in practice.'
                    },
                    {
                        id: 'stats-role', label: 'Role of Statistics in Economics', summary: 'Statistics gives economics its tools for turning raw data into evidence: collection, organisation, presentation, and analysis of numerical information.',
                        sections: [
                            { heading: 'Functions', items: ['Presents economic facts in a definite, comparable form', 'Simplifies complex, unwieldy data into a manageable summary', 'Helps formulate and test economic hypotheses', 'Helps forecast future economic trends'] }
                        ],
                        insight: 'This is why the Statistics for Economics part of the syllabus (Mean/Median/Mode, Correlation, Index Numbers) comes before the applied Micro/Macro chapters — it supplies the analytical tools those later chapters lean on.'
                    },
                    {
                        id: 'primary-secondary', label: 'Primary vs Secondary Data', summary: 'Primary data is collected first-hand, directly for the investigator\'s own purpose. Secondary data was already collected by someone else for a different purpose, and is reused.',
                        sections: [
                            { heading: 'Primary Data', items: ['Collected directly — e.g. a survey, interview, or personal observation', 'More relevant and current, but more expensive and time-consuming to collect'] },
                            { heading: 'Secondary Data', items: ['Reused from an existing source — e.g. government reports, published statistics', 'Named official sources: Census of India, National Sample Survey Organisation (NSSO)', 'Cheaper and faster, but may not exactly fit the current question'] }
                        ],
                        insight: 'Every Data Lab in this app lets you enter your own numbers — that\'s primary data, collected by you, for your own investigation.'
                    },
                    {
                        id: 'sampling', label: 'Sampling vs Census', summary: 'A census studies every single unit in the population. Sampling studies a representative subset and infers conclusions about the whole population from it.',
                        sections: [
                            { heading: 'Census (Complete Enumeration)', items: ['Covers every unit — most accurate, but expensive and slow', 'India\'s Census of India is conducted once every 10 years'] },
                            { heading: 'Sampling', items: ['Studies a smaller, representative subset', 'Much faster and cheaper — used for most economic surveys', 'NSSO conducts large-scale nationwide sample surveys between Census years'] }
                        ],
                        insight: 'The 8–20 rows you can enter in this app\'s Data Labs are a small sample, not a census — exactly the trade-off (speed & cost vs completeness) this topic is about.'
                    }
                ]
            },
            practice: [
                { prompt: 'Which data source would you use to study your own class\'s average marks — primary or secondary?', hint: 'Primary — you would collect it yourself, directly, for your own purpose.' },
                { prompt: 'Which data source would you use to study India\'s population by state — primary or secondary?', hint: 'Secondary — you would use the already-published Census of India figures rather than counting yourself.' }
            ]
        }
    );
}
