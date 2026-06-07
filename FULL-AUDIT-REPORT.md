# Full Audit Report

- URL: `https://sverigemedborgarskapsprov.com`
- Generated: `2026-06-03T11:31:11.892024`
- Overall score: `84/100`
- Score confidence: `Medium`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 100 |
| Social Meta | 5 | 85 |
| Robots and Crawlers | 8 | 100 |
| Broken Links | 10 | 100 |
| Internal Links | 8 | 80 |
| Redirects | 3 | 100 |
| AI Search | 5 | 25 |
| Performance and Core Web Vitals | 13 | 0 |
| On-Page SEO | 10 | 100 |
| Readability | 8 | 62 |
| Entity SEO | 5 | 30 |
| Link Profile | 7 | 85 |
| Hreflang | 5 | 100 |
| Content Uniqueness | 5 | 100 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Warning | entity | sameAs URL returns HTTP 404: https://www.linkedin.com/company/sverigemedborgarskapsprov |  | Update sameAs URL for LinkedIn to a valid, non-redirecting destination. |
| Warning | environment | Content readability is difficult | Long, complex text can reduce engagement and comprehension. | Rewrite key sections with shorter sentences (15-20 words), shorter paragraphs (2-4 sentences), and clearer subheadings. |
| Warning | internal_links | ⚠️ 14 potential orphan page(s) (≤1 internal link pointing to them) |  |  |
| Warning | readability | ⚠️ Content is difficult to read (Flesch: 37.3) — may reduce engagement |  |  |
| Warning | readability | ⚠️ 21.3% complex words (3+ syllables) — consider simplifying |  |  |
| Info | Wikidata | No Wikidata entry found for 'Sverigemedborgarskapsprov.com'. |  | If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO. |
| Info | Wikipedia | No Wikipedia article found for 'Sverigemedborgarskapsprov.com'. |  | Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals. |
| Info | environment | Performance measurement incomplete | PageSpeed API returned an error, so CWV recommendations are less reliable. | Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output. |
| info | pagespeed | pagespeed measurement incomplete | Rate limited by Google API. Wait a few minutes or add an API key. | Rerun this check after resolving the environment/API/network limitation. |

## Measurement Notes

1 checks returned errors or incomplete measurements; treat affected scores as directional.
