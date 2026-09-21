# SANDEEP GARG ALIGNMENT AUDIT & KNOWLEDGE LEVEL STANDARDS

**Document Status:** Sandeep Garg Curriculum Alignment & Hardcore Auditor Verification
**Target Textbooks:** Sandeep Garg *Introductory Microeconomics* (Class XI) & *Introductory Macroeconomics* (Class XII)
**CBSE Subject Code:** 030 (2026–27)

---

## 1. SYSTEM AUDITOR ANALYSIS & KNOWLEDGE STANDARDS

### 1.1 Microeconomics Knowledge Level (Sandeep Garg Class XI)
1. **Consumer's Equilibrium & Demand:**
   - **Utility Analysis:** Single-good equilibrium ($\frac{MU_x}{P_x} = MU_m$) and Two-good equi-marginal condition ($\frac{MU_x}{P_x} = \frac{MU_y}{P_y} = MU_m$).
   - **Indifference Curve (IC) Analysis:** Consumer equilibrium at budget line tangency ($MRS_{xy} = \frac{P_x}{P_y}$), convex to origin due to Diminishing $MRS_{xy}$.
   - **Movement vs. Shift:** Movement along demand curve caused *only* by change in own price ($P_x$). Shift of demand curve caused by non-price determinants ($Y$, $P_y$, $T$, $E$).
2. **Producer Behaviour & Supply:**
   - **Law of Variable Proportions:** Three stages (Increasing returns to factor, Diminishing returns, Negative returns).
   - **Cost Relationships:** $MC$ intersects $AC$ and $AVC$ at their minimum points. $AFC$ is a rectangular hyperbola ($TFC/Q$).
   - **Revenue & Producer Equilibrium:** Under Perfect Competition ($AR = MR = Price$), $MR = MC$ and $MC$ must cut $MR$ from below.

### 1.2 Macroeconomics Knowledge Level (Sandeep Garg Class XII)
1. **National Income & Circular Flow:**
   - **2-Sector Model:** Households (HH) + Firms ($Y = C + S$, $Y = C + I$, ex-post $S = I$).
   - **3-Sector Model:** HH + Firms + Government ($G$). Leakages = $S + T$, Injections = $I + G$. Government spending ($G$) flows to **Firms** (purchases of goods & services) and **Households** (transfer payments/factor payments).
   - **4-Sector Model:** HH + Firms + Government + Rest of World (Foreign). Exports ($X$) flow into **Firms** (Injection), Imports ($M$) flow out of **Firms/HH** to Foreign (Leakage).
2. **Aggregate Demand & Multiplier:**
   - $AD = C + I + G + (X - M)$. In a 2-sector economy $AD = C + I$.
   - Multiplier $k = \frac{1}{1 - MPC} = \frac{1}{MPS}$.
3. **Money, Banking & Forex:**
   - Money multiplier = $\frac{1}{LRR}$.
   - Flexible exchange rate determined by $D_{\$}$ and $S_{\$}$.

---

## 2. FORENSIC AUDIT OF CIRCULAR FLOW (`macro-gdp`)

### 2.1 Deficiency Identified
In previous revisions, Government Spending ($G$) was routed exclusively as a flow from Government $\rightarrow$ Households. According to Sandeep Garg (*Introductory Macroeconomics*, Chapter "Circular Flow of Income"), Government expenditure consists of:
- **Government Purchases of Goods & Services:** Flow from Government $\rightarrow$ **Firms** (Injection into production sector).
- **Transfer Payments & Factor Payments:** Flow from Government $\rightarrow$ **Households**.

Routing $G$ purely to Households broke the Expenditure Method GDP identity $GDP = C + I + G + (X - M)$ at the Firm level, as Firms were not receiving $G$ as revenue for government purchases.

### 2.2 Correction Applied
In `js/simulations.js` (`customRender` for `macro-gdp`):
1. **Government Expenditure Flow ($G$):** Corrected to flow from **Government $\rightarrow$ Firms** (`Govt Spending (G)`), representing government expenditure on goods and services produced by firms.
2. **Sector Flow Consistency:**
   - $C$ (HH $\rightarrow$ Firms)
   - $I$ (Banks $\rightarrow$ Firms)
   - $G$ (Govt $\rightarrow$ Firms)
   - $X$ (Foreign $\rightarrow$ Firms)
   - $M$ (Firms $\rightarrow$ Foreign)
   - $T$ (HH $\rightarrow$ Govt)
   - $S$ (HH $\rightarrow$ Banks)
3. **Firm Revenue Equation:** Total firm revenue now equals $C + I + G + X - M = GDP$ by Expenditure Method, strictly aligned with Sandeep Garg.
