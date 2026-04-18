# Personal Brand Page Content Design

Date: 2026-04-18
Status: Content approved, ready for implementation

## Goal

Produce the exact content for every section of the personal portfolio page at hedderich.pro. This is not a structural spec. It is the final copy, ready to replace all placeholders in the current implementation.

## Positioning

The page reads as a founder-builder who ships SaaS products built on LLMs and documents the technical thinking publicly. Day-job roles and academic background appear only as supporting credibility in the background section.

## Primary Audience

Technically interested visitors evaluating the quality of thinking behind the work:

- founders
- builders
- technical collaborators
- AI practitioners
- readers who may follow ongoing work

## Page-Level CTA

Primary: `Read the blog` → https://blog.hedderich.pro
Secondary: `See the projects` → `#work`

The primary CTA appears in the hero and repeats in the contact section.

## Information Architecture

1. Hero
2. Featured Note
3. Selected Work
4. Writing
5. Now
6. Background
7. Contact

---

## Section Content

### 1. Hero

**Photo**
File: `image.png` at repository root. Move to `static/images/malte-hedderich.png` before implementation.
Treatment: circular crop, placed to the right of the name and thesis on desktop, above on mobile.

**Name**
`Malte Hedderich`

**Thesis**
`I build SaaS products on top of LLMs and write about what makes them work in production.`

**Supporting copy**
`Genhone is the current project. It pressure-tests SaaS ideas before you commit months to building them. By day I build production AI systems and write about what tutorials skip: agent design, LLM evaluation, the calls you only learn by making them.`

**Section navigation**
`Work · Writing · Now · Background`

**Primary CTA**
Label: `Read the blog`
URL: `https://blog.hedderich.pro`

**Secondary CTA**
Label: `See the projects`
URL: `#work`

---

### 2. Featured Note

**Eyebrow:** `Featured note`

**Title**
`Programmatic Prompt Optimization: Building a Spam Filter with DSPy and MIPROv2`

**URL**
`https://blog.hedderich.pro/2026/02/09/programmatic-prompt-optimization-building-a-spam-filter-with-dspy-and-miprov2/`

**Anchor line**
`Stop hand-tuning prompts. Optimize them with data, the way you'd optimize model weights.`

**Read time:** `10 min`

---

### 3. Selected Work

**Section intro**
`Two products built after hours. Both live.`

---

**Genhone**

Description:
`Pressure-tests SaaS ideas before you commit months to building them. Free trial. Signup and card on file.`

URL: `https://genhone.com`
Status: `Active. UX improvements in progress.`
Proof: `First commit January 11, 2026 · Launched April 21, 2026`

---

**Genwriter**

Description:
`Matches your profile against a job ad and writes a cover letter that fits the role. Not a template with your name dropped in.`

URL: `https://genwriter.com`
Status: `Active`
Proof: `First commit November 16, 2023 · Launched August 14, 2024`

---

### 4. Writing

**Section intro**
`How I think about building AI systems, in public.`

Note: Post URLs are intentionally omitted from this section. The writing list is not linked. It reads as a table of topics. The Featured Note section (section 2) is the only place a blog URL appears. Post 1 here is the same post as the Featured Note; appearing in both is intentional.

---

**Post 1**
Title: `Programmatic Prompt Optimization: Building a Spam Filter with DSPy and MIPROv2`
Tag: `Technical deep-dive`
Read time: `10 min`
Summary: `Treat prompts like model weights. Optimize them with data instead of intuition.`

**Post 2**
Title: `Do You Know What Agents Are?`
Tag: `Concepts`
Read time: `6 min`
Summary: `What actually counts as an agent, and why confusing one with a plain LLM call breaks things in production.`

**Post 3**
Title: `Running State: Enhancing Short-Term Memory in AI Agents`
Tag: `Systems`
Read time: `8 min`
Summary: `How agents carry context through complex tasks, and why memory design matters as much as the model choice.`

---

### 5. Now

**Freshness marker:** `Updated April 2026`

- **Building:** `UX work on Genhone. Tightening the pressure-testing flow so you can act on the result faster.`
- **Investigating:** `Custom agent setups in coding CLIs like Claude Code and Codex. Whether structured workflows actually hold up in practice.`

---

### 6. Background

**Origin paragraph**
`ML Engineering Associate Manager at Accenture, leading teams of 6–12 building production LLM applications. Before that, two years at Serviceware shipping intent recognition, search services, and my first production LLM app in early 2023. Master's in Business Informatics from TU Darmstadt, with a thesis on Open-Source MLOps. A year studying Software Engineering at Tongji University in Shanghai.`

**Belief statement**
`Standing still is moving backward. I keep looking for the next hard problem and build toward it.`

---

### 7. Contact

**Heading**
`Reach me here.`

**Channels**
- Email: `malte@hedderich.pro`
- LinkedIn: `https://www.linkedin.com/in/hedderich/`
- GitHub: `https://github.com/maltehedderich`
- X: `https://x.com/hedderichpro`

**Repeated CTA**
Label: `Read the blog`
URL: `https://blog.hedderich.pro`

---

## Editorial Rules

- Sound like a technical builder with conviction, not a corporate operator.
- Prefer specific nouns and outcomes over adjectives.
- Use first-person language where it increases clarity.
- Every section routes outward to something concrete: a post, project, or profile.
- No logos, no employer strips, no timeline grids.
- Accenture and Serviceware appear in prose only, in the background section only.

## Out Of Scope For This Spec

- Visual layout implementation details
- Photo editing beyond circular crop
- CMS or content source decisions
- Blog system design
- Analytics or conversion instrumentation
