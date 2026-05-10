# Data Literacy Concepts for Savvas enVision High School

**Purpose:** Transferable data-literacy concepts for embedding in 15-25 minute web-based exploration activities across Algebra 1, Geometry, and Algebra 2 chapters. The goal is "stuff that survives past school" — habits of mind for citizens who will spend their lives swimming in dashboards, headlines, and AI outputs.

**Format for each concept:** sharp explainer → real teachable examples (with sources) → 5-10 min interactive demo idea → math chapter homes.

---

## PART I: LYING WITH STATS / VISUAL DECEPTION

### 1. Truncated Y-Axis

**Explainer.** A bar or line chart's emotional punch comes almost entirely from the y-axis baseline. Cut the bottom off the axis and a 2% change can look like a tripling. This is the single most common visual lie in news media because it's free, fast, and rarely flagged. The honest fix — start at zero — feels boring precisely because the underlying difference often *is* small.

**Teachable examples.**
- The Fox News welfare-vs-jobs chart (2013) showed 108.6M Americans on welfare as a bar roughly **5x taller** than 101.7M with full-time jobs — a 7% difference visualized as a 500% difference. ([Media Matters writeup](https://www.mediamatters.org/fox-friends/dishonest-fox-chart-overstates-comparison-welfare-full-time-work-500-percent))
- The Bush tax cut chart (2012) showing top tax rate of 35% as a tower next to 39.6% as a sliver, by starting the y-axis at 34%. ([History of Fox charts, Media Matters](https://www.mediamatters.org/fox-friends/history-dishonest-fox-charts))
- TikTok / Instagram engagement charts in pitch decks routinely truncate to make 4% MoM growth look like hockey-stick adoption.

**5-min interactive demo: "The Slider of Lies."** Student sees a bar chart of two real values (e.g., Spotify listener counts of two artists). A slider controls the y-axis minimum. They drag it up and watch the visual gap balloon while the underlying numbers stay fixed. Caption updates: "Looks like Artist A has X% more listeners — actually it's Y%." Aha: *the data didn't change, only the picture did.*

**Math homes.** Algebra 1 — linear functions, slope, scale; Algebra 2 — exponential vs linear visual confusion.

---

### 2. Cherry-Picked Time Windows

**Explainer.** Pick the right start and end dates and you can make almost any trend say what you want. The technique exploits the fact that real-world time series are noisy: you find a local peak, start there, and stop at a local trough, presenting the segment as "the trend."

**Teachable examples.**
- "Global warming stopped in 1998" — 1998 was the strongest El Niño of the century, an outlier high. Starting any temperature trend at 1998 underplays warming; starting in 1999 or 2000 shows strong warming. ([Skeptical Science cherry-picking guide](https://skepticalscience.com/cherrypicking-guide.html), [NOAA explainer](https://www.climate.gov/news-features/climate-qa/did-global-warming-stop-1998))
- Stock-market screenshots of "the worst quarter ever" that crop just before a recovery.
- COVID case-count charts cropped to 7 days vs 90 days telling opposite stories.

**Demo: "Pick Your Start Date" game.** Students see a real time series (S&P 500, global temp, Taylor Swift monthly listeners). They drag two handles to pick start/end and the headline auto-generates: "STOCKS CRASH 30%!" or "STOCKS BOOM 200%!" Then the full series is revealed. Aha: *the same data supports six different headlines.*

**Math homes.** Algebra 1 — rate of change, slope between two points; Algebra 2 — sequences, moving averages.

---

### 3. Correlation vs Causation

**Explainer.** Two variables can move together for many reasons: causation in either direction, a shared cause (confounder), pure coincidence, or selection. The rule "correlation does not imply causation" is famous; the harder lesson is that humans *cannot help* inventing a causal story when they see two lines tracking each other.

**Teachable examples.**
- **Tyler Vigen's Spurious Correlations** — Nicolas Cage films per year vs swimming pool drownings (r = 0.666 over 1999-2009). ([National Geographic coverage](https://www.nationalgeographic.com/science/article/nick-cage-movies-vs-drownings-and-more-strange-but-spurious-correlations), [Vigen's site](https://tylervigen.com/spurious-correlations))
- Margarine consumption vs Maine divorce rate (r = 0.99).
- Ice cream sales vs shark attacks (both caused by summer/heat).

**Demo: "Correlation Casino."** Student is given 6 headlines like "Cities with more libraries have more crime!" and asked to vote: causation, reverse causation, confounder, or coincidence. After voting, they see the real explanation (libraries scale with population; population drives both). Bonus round: students generate their own spurious correlation with a built-in dataset of 20 weird time series.

**Math homes.** Algebra 1 — scatter plots, line of best fit; Algebra 2 — correlation coefficient r.

---

### 4. Confounding Variables / Simpson's Paradox

**Explainer.** A trend that holds in every subgroup can completely *reverse* when you aggregate. The fix is to ask: what variable did I forget to condition on? Simpson's paradox is the most counterintuitive thing in introductory stats and the most useful — once you've seen it you stop trusting any single comparison.

**Teachable examples.**
- **UC Berkeley graduate admissions, 1973.** Overall: 44% of men admitted, 35% of women — looks like bias. Department by department: women had *equal or higher* admit rates in most departments. Women applied to harder-to-get-into departments (English) more than easier ones (engineering). ([Wikipedia](https://en.wikipedia.org/wiki/Simpson's_paradox), [Statistics LibreTexts](https://stats.libretexts.org/Bookshelves/Applied_Statistics/Learning_Statistics_with_R_-_A_tutorial_for_Psychology_Students_and_other_Beginners_(Navarro)/01:_Why_Do_We_Learn_Statistics/1.02:_The_Cautionary_Tale_of_Simpsons_Paradox))
- **Kidney stones (Charig 1986).** Treatment A beats Treatment B for small stones AND for large stones, but B wins overall — because B was given to easier cases. ([Critikid explainer](https://critikid.com/simpsons-paradox))
- COVID case fatality rates by country in 2020 — Italy looked deadlier than China overall, but China was deadlier in every age bracket. Italy just had an older population.

**Demo: "Berkeley Admissions Detective."** Students see the aggregate numbers: "Berkeley admits 44% of men, 35% of women — sue them?" They click "investigate by department" and watch the bias reverse in front of them. Then they're asked to *create* their own Simpson's paradox by choosing which subgroups to combine.

**Math homes.** Algebra 1 — proportions, weighted averages; Algebra 2 — conditional probability.

---

### 5. Pictograph Scaling Deception (2x Icon = 4x Area)

**Explainer.** When you double the *height* of a 2D icon, you also double its width — making it look 4x bigger by area. Our brains read area, not height. This is the most common chart-junk lie in infographics.

**Teachable examples.**
- USA Today and infographic-style ticket-price comparisons where a hockey puck doubled in height appears to dwarf a baseball icon. ([Misleading graphs Wikipedia](https://en.wikipedia.org/wiki/Misleading_graph))
- The classic Time magazine pictogram of housing-cost increases with houses scaled by *both* dimensions.
- Real-estate marketing showing house-icon comparisons where Manhattan apartments look 9x smaller than Texas homes when they're really 3x.

**Demo: "Scale Detective."** Slider lets students scale an icon by height-only (correct) or by both dimensions (deceptive). Two versions of the same chart appear side by side; the kid eyeballs them and is asked: "Which represents '3x more'?" The answer screen shows that one chart shows 3x linearly but reads as 9x by area.

**Math homes.** Geometry — area scaling, similar figures (a 1:2 linear ratio = 1:4 area ratio = 1:8 volume ratio). This is *exactly* a Geometry chapter lesson.

---

### 6. Map Projection Lies (Mercator, Choropleths)

**Explainer.** Every flat map of a sphere distorts something. Mercator preserves shape and angle (great for navigation) but inflates anything far from the equator. Greenland looks the size of Africa; Africa is **14 times larger**. Beyond projection, choropleth maps (filling whole regions with one color) treat empty Wyoming the same as packed Manhattan.

**Teachable examples.**
- Mercator vs equal-area: Africa is ~30M km², Greenland is ~2.17M km². Africa fits 14 Greenlands. ([Visual Capitalist](https://www.visualcapitalist.com/true-size-of-greenland-map-mercator-projection/), [thetruesize.com](https://thetruesize.com))
- US election maps colored by county area look overwhelmingly red even when the popular vote is essentially 50/50 — because empty rural counties dominate the *visual* even though they have few voters. ([Bloomberg guide to misleading election maps](https://www.bloomberg.com/news/articles/2020-11-03/a-complete-guide-to-misleading-election-maps))
- "Land doesn't vote" cartograms where states are resized by population, completely changing the gestalt.

**Demo: "Drag Greenland."** Students drag a Greenland silhouette down toward the equator on a Mercator map and watch it shrink. (thetruesize.com already does this beautifully.) Follow-up: drag a state from rural Wyoming to NYC and see population density appear. Aha: *area is not population, and Mercator is not Earth.*

**Math homes.** Geometry — area, scale factors, map scale; spheres and 2D projections.

---

### 7. Two Y-Axis Dual-Line Tricks

**Explainer.** Plot two unrelated time series on the same chart with two different y-axes, scale each so they overlap visually, and the brain auto-infers a relationship. This is the most "respectable-looking" lie because it's used in finance and business decks constantly.

**Teachable examples.**
- Tyler Vigen's spurious correlations site is essentially weaponized dual-axis charts.
- "Crypto price vs Google search interest" charts where both lines are scaled to coincidentally overlap.
- Pundit charts of "national debt vs immigration" or similar pairings designed to imply causation through visual overlay.

**Demo: "The Same Chart, Two Stories."** Students get two raw datasets (e.g., Apple stock and number of ducks at the local park). Sliders let them rescale each y-axis independently. Within 30 seconds they can make the lines look perfectly correlated. Then they swap data — pizza sales and SAT scores — and produce another "shocking" correlation.

**Math homes.** Algebra 1 — graphing on different scales; Algebra 2 — transformations and rescaling.

---

### 8. Rates vs Counts (Per Capita)

**Explainer.** A raw count almost always tracks population. To compare places or groups, you need a rate. "California has the most car accidents" is meaningless without per-capita context — California also has the most everything because it has the most people.

**Teachable examples.**
- "Texas has more murders than Vermont!" — Texas has 47x the population.
- COVID case maps that just showed totals (always darkest in NY/CA/TX) vs per-capita maps (which looked completely different).
- "More airline crashes in 2024 than 1994" — yes, because there are 3x more flights. Crashes per million flights is the relevant metric.

**Demo: "Map Flip."** Student sees a US choropleth of "total fast-food restaurants by state" — California glows. Click "per capita" and the map redraws. Now West Virginia or Alabama leads. They flip between count, per-capita, per-square-mile, and per-household maps for the same dataset.

**Math homes.** Algebra 1 — ratios, unit rates, proportional reasoning. (This is a *core* Algebra 1 topic dressed up as journalism.)

---

### 9. Mean vs Median in Skewed Data

**Explainer.** When a distribution has a long tail, the mean gets pulled toward the tail and the median doesn't. For symmetric data they're nearly identical; for skewed data they tell radically different stories. Reporters who say "average income" almost always mean *mean*, which is wrong for income.

**Teachable examples.**
- US household net worth (2019): **median ≈ $97,300, mean ≈ $692,100.** Mean is 7x median because of billionaires. ([Federal Reserve data](https://www.federalreserve.gov/releases/z1/dataviz/dfa/distribute/chart/))
- "Average salary at this startup is $250K" — sure, because the founder makes $5M and the 25 employees make $80K each.
- Spotify monthly listeners: median artist gets ~50 streams/month, mean is in the thousands.

**Demo: "Bezos Walks Into a Bar."** Bar has 9 people earning normal incomes. Display mean and median. Slider adds Jeff Bezos. Median barely moves; mean jumps to $20M. Aha: *the median didn't notice he walked in.*

**Math homes.** Algebra 1 — measures of center, distributions; Algebra 2 — skewness, normal vs lognormal.

---

### 10. Survivorship Bias

**Explainer.** You only see the things that made it. Any dataset that excludes failures by construction will mislead you about success. The fix: ask "what's missing from this data?" before drawing conclusions.

**Teachable examples.**
- **Abraham Wald's planes (WWII).** Statisticians studied bullet-hole patterns on returning bombers and recommended armoring the spots with the most holes. Wald said: armor the spots with *no* holes — those are the planes that didn't come back. ([AMS feature column](https://www.ams.org/publicoutreach/feature-column/fc-2016-06))
- Mutual fund advertised returns: funds that crashed got closed and removed from the database. The "average fund returns 8%" excludes the dead ones.
- "Successful college dropouts" survey (Jobs, Gates, Zuckerberg) — billions of dropouts who didn't make it never get interviewed.

**Demo: "Where to Armor the Plane?"** Students see the famous bullet-hole diagram (silhouette of a B-17 with red dots clustered on wings and tail). They click where they'd add armor. Then the reveal: an animation shows planes hit in the engine going down, never coming back, never appearing in the data. They re-pick.

**Math homes.** Algebra 1 — sampling, biased samples; Algebra 2 — conditional probability ("returned | hit location").

---

## PART II: TIDY DATA / DATA HYGIENE

### 11. Wide vs Long Format

**Explainer.** Hadley Wickham's "tidy data" rule: each variable is a column, each observation is a row, each value is a cell. Most spreadsheets in the wild violate this — years are spread across columns, multiple variables crammed into one cell, etc. Reshaping is 80% of real data work.

**Teachable examples.**
- Hadley Wickham's original tidy data paper uses datasets like religion-by-income (where income brackets are spread across columns and need to be melted into a long format). ([Tidy Data paper PDF](https://vita.had.co.nz/papers/tidy-data.pdf))
- Government datasets where each year is its own column ("Pop_2020", "Pop_2021", "Pop_2022") and you can't easily plot the trend without reshaping.
- Excel pivot tables vs flat CSVs.

**Demo: "Untangle the Spreadsheet."** Student is shown a "messy" gradebook where columns are named "Test1_Math, Test1_Sci, Test2_Math, Test2_Sci..." and they're asked to compute "average math score." Frustrating in wide form. Then a one-click "tidy" button reshapes it to one row per (student, test, subject) and the same question becomes a one-line filter+average.

**Math homes.** Algebra 1 — function tables, data representation; supports any chapter that asks students to *do* something with data they didn't collect themselves.

---

### 12. Missing Data Conventions

**Explainer.** Real CSVs encode missing values in dozens of ways: blank cells, `NA`, `N/A`, `null`, `-1`, `-999`, `99`, `9999`, the string `"missing"`, or worst of all, sneaky numeric sentinels like `0` for "no response." If you average a column where missing = -999, your average is garbage.

**Teachable examples.**
- Survey data where "no answer" was coded as 99 — averaged into a "happiness score" giving every population mean happiness in the 50s.
- Health records where missing systolic blood pressure was stored as 0, leading to ML models predicting that low BP causes heart attacks.
- The famous SSA "death" of people born in 1875 because their birth year defaulted to 1875 in legacy systems.

**Demo: "Spot the Sentinel."** Students get a CSV preview of medical-style data with weird outliers (a few rows with weight = -1, age = 999). Histogram shows two clean bumps and one tiny tower at the far end. They click the tower; a dialog explains: this is the missing-data code. Re-bin without it; averages change dramatically.

**Math homes.** Algebra 1 — outliers, data cleaning before computing statistics; Algebra 2 — robust vs non-robust statistics.

---

### 13. Unit Mismatches

**Explainer.** Numbers without units are not data, they're noise. The cost of unit confusion ranges from embarrassing to fatal. Every dataset should travel with its units; every formula should be checked dimensionally.

**Teachable examples.**
- **Mars Climate Orbiter (1999):** Lockheed software output thrust in pound-seconds; NASA software expected newton-seconds. $327M spacecraft burned up in Mars's atmosphere. ([Wikipedia](https://en.wikipedia.org/wiki/Mars_Climate_Orbiter))
- **Gimli Glider (1983):** Air Canada Boeing 767 ran out of fuel at 41,000 ft because crew calculated fuel load using lb/L instead of kg/L. Loaded *less than half* of needed fuel. Glided to an emergency landing at a former RCAF base. ([Wikipedia](https://en.wikipedia.org/wiki/Gimli_Glider))
- Recipe disasters: 1 cup of salt vs 1 tsp; UK vs US gallons in shipping.

**Demo: "Save the Mars Probe."** Mini-game where students set fuel load, thrust, and altitude in a simulator. The simulator randomly displays values in either metric or imperial and the student must convert before committing. Successful orbit insertion vs spectacular crash animation.

**Math homes.** Algebra 1 — unit analysis, dimensional reasoning, scientific notation. This is *the* canonical Algebra 1 application.

---

### 14. Date Parsing Hell

**Explainer.** Is `04/05/2024` April 5 or May 4? Depends which country wrote it. Excel auto-converting `MARCH1` to a date corrupts gene names. Time zones, daylight saving, leap seconds, and Excel's serial-date origin (1900 vs 1904) ruin real data daily.

**Teachable examples.**
- The 2020 paper documenting that Excel had been auto-converting human gene names (SEPT1, MARCH1) to dates so often that geneticists *renamed the genes* to avoid Excel.
- "8/9/24" disagreements in international logistics.
- Sports box scores where a game in Tokyo on the 5th was the 4th in LA.

**Demo: "What Day Was This?"** Students see five date strings — `04/05/24`, `2024-05-04`, `5-Apr-24`, `April 4, 2024`, and `45386` (an Excel serial). They drag each to its correct calendar date. The reveal exposes ambiguity. Bonus: paste a list of dates and watch which ones Excel gleefully turns into something else.

**Math homes.** Algebra 1 — sequences (calendar arithmetic), modular thinking (days of week mod 7).

---

### 15. Categorical vs Continuous Mistakes

**Explainer.** Just because something is a number doesn't mean you can do math on it. ZIP codes, jersey numbers, Likert scales, and 5-star ratings are *labels*, not quantities. Averaging them is meaningless or actively misleading.

**Teachable examples.**
- Amazon star ratings: a product with 50% 5-stars and 50% 1-stars has the same "average" (3) as a product with 100% 3-stars — but they describe wildly different products. ([Bimodal rating discussion](https://www.amalytix.com/en/blog/amazon-reviews-ratings-analysis/))
- "Average ZIP code in Texas" — meaningless.
- "Average jersey number of NBA all-stars" — meaningless.
- Survey averaging "1=strongly agree ... 5=strongly disagree" treats the gap from 1-to-2 as equal to the gap from 4-to-5. It's not.

**Demo: "Distribution vs Average."** Show three Amazon products all rated "3.5 stars average" but with three different distributions: uniform 3.5s, bimodal (love-it or hate-it), and right-skewed. Ask: "which product would *you* buy?" Reveal: the average lies; the shape tells the story.

**Math homes.** Algebra 1 — measures of center, dot plots/histograms; Algebra 2 — distribution shape.

---

### 16. Outliers — Clean or Investigate?

**Explainer.** The default impulse on seeing an outlier is "remove it." Sometimes that's right (sensor error, typo, missing-data sentinel). Sometimes the outlier is the whole point — and removing it has cost lives, missions, and discoveries.

**Teachable examples.**
- **The Antarctic ozone hole.** NASA's TOMS satellite had been measuring ozone since 1978 with an automatic filter that *threw out* readings below 180 Dobson units as "instrument error." When British scientists (Farman et al., 1985) published the ozone hole using ground-based measurements, NASA went back, removed the filter, and the hole was right there in their data the whole time. ([History of Information](https://www.historyofinformation.com/detail.php?entryid=3134), [Hyndsight blog](https://robjhyndman.com/hyndsight/ozone-hole-anomaly.html))
- The 2008 financial crisis — many risk models had filtered out the 2007 housing-price weirdness as "noise."
- Black-swan stock-market days (1987, 2008, 2020) — models that exclude them underestimate risk catastrophically.

**Demo: "Outlier or Discovery?"** Three real datasets in sequence: (1) a typo in someone's height (10 ft instead of 5 ft) — clean it; (2) a temperature sensor reporting -999 — clean it; (3) the Antarctic ozone reading — DON'T clean it. Students decide each one. Reveal shows the consequences of the wrong call.

**Math homes.** Algebra 1 — outliers, IQR, box plots; Algebra 2 — z-scores and what counts as "extreme."

---

## PART III: PROVENANCE / ETHICS / TRUST

### 17. Selection Bias

**Explainer.** Your data only describes the population it sampled. If your sampling method correlates with your outcome, no amount of computation can save you. Online polls, opt-in surveys, and viral-share datasets are nearly always selection-biased.

**Teachable examples.**
- **Literary Digest 1936 poll.** 2.4 million responses (largest poll ever at the time) predicted Landon would crush Roosevelt. Roosevelt won 46 of 48 states. The Digest sampled phone owners, car owners, and country-club members during the Depression — exactly the people not on the New Deal. Plus non-response bias: angry voters mailed back ballots more. ([Wikipedia](https://en.wikipedia.org/wiki/The_Literary_Digest))
- COVID hospital case-fatality rates were biased early because the sickest were tested first.
- TikTok poll results — the people who answer your TikTok poll are not a sample of America.

**Demo: "Run Your Own 1936 Poll."** Students choose a sampling method (random voters, only iPhone users, only X followers, only mall-goers) for a hypothetical referendum. The simulation reveals the sample's prediction vs the "true" outcome. They quickly learn that sample size doesn't fix selection bias.

**Math homes.** Algebra 1 — sampling, random vs convenience samples; Algebra 2 — sampling distributions.

---

### 18. Anonymization Failure

**Explainer.** Stripping names from a dataset isn't enough to make it anonymous. With even small amounts of side information (other public datasets, social media, location patterns), individuals can be re-identified. Privacy is hard.

**Teachable examples.**
- **Netflix Prize (2006-09).** Netflix released "anonymized" ratings for 500,000 users. Researchers Narayanan and Shmatikov re-identified users by cross-referencing with public IMDb reviews — as few as 6 movie ratings + dates uniquely identified people. Lawsuit followed; Netflix canceled the sequel competition. ([Wikipedia](https://en.wikipedia.org/wiki/Netflix_Prize), [Cornell FAQ](https://www.cs.cornell.edu/~shmat/netflix-faq.html))
- **AOL search-log release (2006).** AOL released "anonymized" search queries for 650,000 users. NYT identified User #4417749 as Thelma Arnold, 62, of Lilburn GA, from her queries about her town, friends, and dogs. ([NYT article](https://www.nytimes.com/2006/08/09/technology/09aol.html))
- **Strava global heatmap (2018).** Aggregated, "anonymous" running-route heatmap of Strava users revealed perimeters of secret US military bases in Syria, Iraq, Afghanistan when the only joggers in remote desert were soldiers. ([CNN](https://www.cnn.com/2018/01/28/politics/strava-military-bases-location), [TechCrunch](https://techcrunch.com/2018/01/28/strava-exposes-military-bases/))

**Demo: "Find the Person."** Students see an "anonymized" record: 5 movies rated, 3 ZIP-code-level locations, age range. They use a built-in IMDb-style lookup to identify the person in 60 seconds. Aha: *anonymous data isn't anonymous when you have a second dataset.*

**Math homes.** Algebra 2 — combinations and uniqueness ("how many unique fingerprints can N data points create?"); Geometry — location/coordinates as identifiers.

---

### 19. Algorithmic Bias

**Explainer.** ML models learn patterns from training data. If the training data reflects historical bias, the model will reproduce and amplify it — and dress it up as "objective math."

**Teachable examples.**
- **COMPAS (ProPublica, 2016).** Recidivism-prediction algorithm used in US courts. ProPublica found Black defendants were ~2x as likely to be falsely flagged as "high risk" while white defendants were more likely to be falsely flagged as "low risk." ([ProPublica Machine Bias](https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing))
- **Amazon's hiring AI (scrapped 2018).** Trained on 10 years of resumes (mostly male). Learned to penalize the word "women's" (as in "women's chess club") and downgrade graduates of women's colleges. ([Reuters via MIT Tech Review](https://www.technologyreview.com/2018/10/10/139858/amazon-ditched-ai-recruitment-software-because-it-was-biased-against-women/))
- **Gender Shades (Buolamwini & Gebru, 2018).** Commercial face recognition: error rate <1% for light-skinned men, ~35% for dark-skinned women — because training sets were predominantly white and male. ([MIT News](https://news.mit.edu/2018/study-finds-gender-skin-type-bias-artificial-intelligence-systems-0212))

**Demo: "Train the Algorithm."** Students train a simple "good employee" classifier with a tiny biased dataset (e.g., past hires that were 90% from one school). They watch the model lock onto school as a predictor. Then they retrain with a balanced dataset and see different outputs. Aha: *the algorithm is a mirror of its training data.*

**Math homes.** Algebra 2 — functions, regression, linear classifiers; statistics chapters on bias and fairness.

---

### 20. Goodhart's Law

**Explainer.** "When a measure becomes a target, it ceases to be a good measure." The moment you reward people for hitting a number, they optimize for *the number* instead of the underlying thing the number was supposed to measure.

**Teachable examples.**
- **Wells Fargo "Eight is Great" (2011-16).** Employees pressured to open 8 products per customer. They opened ~3.5 million fake accounts in customers' names. ~5,300 employees fired; bank fined. ([Wikipedia](https://en.wikipedia.org/wiki/Wells_Fargo_cross-selling_scandal))
- **Soviet nail factory** — when measured by nail count, made tiny useless nails; when measured by total weight of nails, made one giant useless nail.
- **No Child Left Behind (US, 2002).** Schools rated on standardized-test scores. Some schools narrowed curriculum to test prep, gamed which students took the tests, and (in Atlanta, 2009) outright cheated.
- **YouTube watch time** — algorithm optimized for watch time; creators learned that outrage and rabbit-hole content keep people watching.

**Demo: "You Are the Manager."** Student is a Wells Fargo regional VP. They set a sales quota slider; a population of simulated bankers responds. Low quota: low fraud, low sales. Reasonable quota: best outcome. Aggressive quota: sales metric jumps... but a hidden "fraud" bar starts climbing. Aha: *the metric obeyed; the spirit died.*

**Math homes.** Algebra 1 — linear and nonlinear response functions; Algebra 2 — optimization with constraints.

---

### 21. P-Hacking / Texas Sharpshooter

**Explainer.** Test enough hypotheses and some will reach "significance" by chance. The Texas sharpshooter shoots first then draws the bullseye around the holes; the p-hacker analyzes 20 things then reports the one that hit p<0.05. Pre-registration is the cure.

**Teachable examples.**
- **XKCD #882 "Significant"** — comic where scientists test 20 jellybean colors at p<0.05; one (green) hits significance by chance; newspaper headline: "GREEN JELLY BEANS LINKED TO ACNE!" ([XKCD #882](https://xkcd.com/882/))
- "Chocolate accelerates weight loss" — Bohannon's 2015 sting where he ran a tiny low-quality study, found a fluke, and published it to show how easy it was.
- Most "superfood" health headlines.

**Demo: "Roll for Significance."** Students get a button that runs a "study" of 20 different food items vs acne. After clicking, they see which items "showed an effect." They re-run; different items light up each time. The point lands: with 20 tests at α=0.05, you expect ~1 false positive every time.

**Math homes.** Algebra 2 — probability, expected value, multiple-comparison thinking.

---

### 22. Replication Crisis

**Explainer.** Many famous published findings — especially in psychology, nutrition, and economics — fail to replicate when other labs run the same study. The combination of small samples, p-hacking, publication bias, and Excel errors produces a literature full of mirages.

**Teachable examples.**
- **Power posing (Cuddy et al., 2010).** Claimed standing in a "power pose" for 2 minutes raises testosterone, lowers cortisol, makes you more confident. TED Talk: 60M+ views. By 2017, 11 replication studies failed; original co-author Carney publicly disavowed the finding. ([Wikipedia](https://en.wikipedia.org/wiki/Power_posing))
- **Reinhart-Rogoff Excel error (2010).** Influential paper claiming countries with debt over 90% of GDP have negative growth. Used to justify austerity policies worldwide. UMass grad student requested the spreadsheet; turned out R&R's Excel formula didn't include 5 of the 20 countries. Corrected average: +2.2% growth, not -0.1%. ([Wikipedia](https://en.wikipedia.org/wiki/Growth_in_a_Time_of_Debt))
- The 2015 Reproducibility Project: only ~36% of 100 famous psych studies replicated.

**Demo: "Recreate the Famous Result."** Student presses "run" on a small-N power-posing simulator. Sometimes it shows the effect; often it doesn't. Run 10 trials and count: most don't replicate. Bonus: a "Reinhart-Rogoff" Excel widget where the student can introduce/remove the cell-range bug and watch the conclusion flip.

**Math homes.** Algebra 2 — probability, sampling variability, statistical significance.

---

## PART IV: STATISTICAL THINKING

### 23. Distributions vs Averages / Long Tails

**Explainer.** Many real-world quantities (income, book sales, city sizes, social media follower counts) follow power-law distributions, not bell curves. The "average" doesn't describe a typical case — most cases are below average and a few are wildly above. This is the Pareto / Zipf / 80-20 world.

**Teachable examples.**
- **Spotify streams.** Median artist gets ~50 monthly listeners; top 0.1% drives the bulk of streams.
- **City populations** follow Zipf's law: NYC ~ 8M, second city Chicago ~ 2.7M, third LA, etc., scaling roughly as 1/n.
- **Book sales** — most books sell <1000 copies; a few sell tens of millions. Mean is meaningless.
- **YouTube views per video** — power law all the way down.

**Demo: "Where Do You Land?"** Student inputs their TikTok/Instagram follower count or step count. Plot shows them on the global distribution. They see: they're below mean, but above median. Slider lets them remove the top 1% and watch the mean drop dramatically while the median moves a hair.

**Math homes.** Algebra 2 — exponential and power functions, log scales; Algebra 1 — measures of center on skewed data.

---

### 24. Regression to the Mean

**Explainer.** Extreme performance is usually some skill plus some luck. The luck part doesn't repeat. So whoever was extraordinary last period will tend to be merely ordinary next period — not because of a curse, but because the luck flips. Mistaking this for causation creates ghosts everywhere.

**Teachable examples.**
- **Sports Illustrated cover curse.** Athletes/teams featured on the cover are picked because they're at a peak. The peak doesn't repeat. ([Psychology Today](https://www.psychologytoday.com/us/blog/what-the-luck/201610/the-sports-illustrated-cover-jinx))
- **Madden NFL cover curse.** 23 cover players had 110 Pro Bowl appearances *before* the cover, only 25 *after*.
- **Sophomore slump.** Rookie of the Year usually has a worse second season.
- **"My kid did better on the test after I yelled at them."** They did poorly; the next score was likely to regress upward regardless.

**Demo: "Cover the Athlete."** Student picks the player with the best stats from last season for next year's magazine cover. Simulate next season with skill + random luck terms. Watch the cover athlete regress. Try again — same pattern. They learn the curse is just statistics.

**Math homes.** Algebra 1 — line of best fit (literally regression); Algebra 2 — random variables, expected value.

---

### 25. Confidence Intervals & Polling Margins

**Explainer.** A poll result is not a number; it's a range. "Candidate A leads 48% to 46%" with a margin of error of ±3% means the race is statistically tied. Treating point estimates as exact is the root of most "stunning upsets."

**Teachable examples.**
- 2016 US election polling: nearly all major polls had Clinton leading by ~3 points, within their margins of error. Trump's win was within polling uncertainty — not the impossibility headlines suggested.
- 538's "snake plots" of Senate forecasts illustrate uncertainty visually.
- Drug efficacy claims like "drug X reduces risk by 30%" without confidence intervals.

**Demo: "Roll Your Own Poll."** Student samples 50 simulated voters, gets a result + CI. Run it again — different result, overlapping CI. Sample 500 — narrower CI. Sample 5000 — narrower still. They feel why sample size shrinks uncertainty (∝ 1/√n).

**Math homes.** Algebra 2 — square roots, normal distribution, sampling distributions.

---

### 26. Base Rate Fallacy

**Explainer.** A test with 99% accuracy for a disease that affects 1 in 10,000 will return mostly false positives. Conditional probabilities are deeply unintuitive — even doctors get them wrong. The fix: think in absolute counts, not percentages.

**Teachable examples.**
- **Mammogram problem.** ~0.8% of women in screening have breast cancer. Test catches 90% of true cases but flags 7% of healthy women. Out of 1000 women, 8 have cancer (7 caught) but ~70 false positives. So ~9% of positives are real. ([Statistics Done Wrong](https://www.statisticsdonewrong.com/p-value.html))
- COVID rapid tests early in pandemic: high false-positive rate when prevalence was low.
- DUI breathalyzer false-positive rates in random-stop checkpoints.
- Airport terrorist-screening: with millions of travelers and few actual threats, even a 99.99% accurate screen produces mostly false alarms.

**Demo: "1000 Patients."** Show 1000 stick figures. 8 are colored red (have disease). Test runs. Ones flagged turn yellow. Students see ~7 reds turn yellow (true positives) and ~70 healthy figures also turn yellow (false positives). They count: only 1 in 10 yellow figures actually has the disease. Aha: *the test is "99% accurate" but a positive result is still probably wrong.*

**Math homes.** Algebra 2 — conditional probability, Bayes' theorem, ratios.

---

### 27. Granularity Changes the Story

**Explainer.** The same data plotted at different time scales tells different stories. Daily noise can hide a yearly trend; monthly data can hide weekly cycles. Choosing the right granularity is part of honest analysis.

**Teachable examples.**
- **Climate.** Daily temperature varies ±20°F; annual average varies ±0.1°F. "It's cold today" is irrelevant to climate trends but irresistible to deniers.
- **COVID weekend dips.** Case-counts plotted daily showed sawtooth patterns because reporting dropped on weekends. Looked like outbreaks/recoveries but was just bureaucracy.
- **Stock prices.** Day-trading scale (minute-by-minute) vs retirement scale (year-by-year) tell entirely different stories about the same security.

**Demo: "Zoom the Time Axis."** Student starts with 50 years of global temperature plotted by day — looks chaotic and trendless. They drag a slider to roll up to weekly, monthly, annual. The trend emerges as granularity coarsens. Reverse with COVID cases: zoom from monthly (clean rise/fall) to daily (jagged weekend dips that looked like new waves).

**Math homes.** Algebra 1 — linear trends with noise; Algebra 2 — moving averages, smoothing.

---

## CROSS-CUTTING ACTIVITY FORMATS

Several formats can teach multiple concepts at once and feel like games rather than lessons.

### A. "Spot the Lie" Vote-Then-Reveal
Students see a real-world chart from a news headline. They vote: honest, or has-a-lie? After voting they see the underlying data and the trick (truncated axis, cherry-picked window, pictograph scaling, dual-axis, etc.). Works for concepts 1, 2, 5, 6, 7, 8, 9. **Format:** game-show feel with leaderboards across the class.

### B. "Build a Lie" Reverse Mode
Students are given honest data and asked to *make it lie* using a toolkit: drag the y-axis baseline, pick a start year, choose icons that scale by area, swap mean for median. They submit their most deceptive version; class votes on which is most deceptive without being technically wrong. Builds the deepest understanding. Concepts 1, 2, 5, 7, 8, 9, 12, 15.

### C. "Two Stories, Same Data" Side-by-Side
Two charts of the same dataset shown side by side, framed by opposing partisan headlines. Students figure out what's different. Often it's just granularity (27), per-capita vs raw (8), or aggregation (4 — Simpson's). Concepts 2, 4, 8, 27.

### D. "Detective: Find What's Missing"
Survivorship bias, selection bias, missing data — all fall here. Student investigates a dataset and asks: who/what is *not* in this data? Demo formats include the WWII plane diagram and the Literary Digest poll. Concepts 10, 12, 16, 17.

### E. "Train the Algorithm" Sandbox
Student trains a simple classifier (logistic regression, decision tree) on a tiny biased dataset and watches it learn the bias. Then they retrain with balanced data. Connects algorithmic bias (19), p-hacking (21), and overfitting. Concepts 19, 21, 22.

### F. "Same Number, Different Story" Carousel
Student is shown one statistic ("the average X is 50") then walks through five different distributions that all yield the same average. Drives home distributions vs averages (23), mean vs median (9), bimodality (15).

### G. "Headline Generator"
Student gets raw data and produces a headline for it. Class votes on whether the headline is technically true and whether it's *honest*. Forces the distinction between accurate and misleading. Works for nearly everything.

---

## TOP 8 FOR THE PUBLISHER DEMO

If pitching a Savvas exec who can only see a handful of activities, these are the most demo-able — visually striking, instantly graspable, defensible as math curriculum:

1. **Truncated y-axis "Slider of Lies"** — instant visceral aha; pure Algebra 1 scale work.
2. **Berkeley admissions Simpson's-paradox detective** — most counterintuitive moment in stats, blows minds in 60 seconds.
3. **Mercator drag-Greenland-to-equator** — uses thetruesize.com mechanic, geography + Geometry area scaling, perfect for Geometry chapter.
4. **WWII plane "where to armor" survivorship-bias reveal** — gripping story, visual punch, drives the lesson hard.
5. **Wald-style "spot the lie" Tyler Vigen correlation game** — students laugh out loud at Nicolas Cage / drownings, then vote causation/coincidence/confounder.
6. **Spurious-axis dual-line trick "Same Chart, Two Stories"** — students LITERALLY watch themselves manufacture a fake correlation in 30 seconds; profound.
7. **"Bezos walks into a bar" mean vs median** — single billionaire shifts the mean; median doesn't notice. Memorable, sharable, real Algebra 1.
8. **Mammogram base-rate "1000 patients" visualization** — counterintuitive Bayes result that even doctors fail; uses simple counting; perfect Algebra 2 conditional probability.

These eight together cover scale (1, 3), shape vs aggregation (2, 7), causation (5, 6), and conditional probability (8) — the spine of practical data literacy. They also map cleanly onto chapter-level math content, which is critical for adoption: each one is mathematically rigorous, not a digression.
