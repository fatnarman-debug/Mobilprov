# Full Audit Report

- URL: `https://sverigemedborgarskapsprov.com`
- Generated: `2026-05-28T17:08:10.920401`
- Overall score: `73/100`
- Score confidence: `Medium`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 85 |
| Social Meta | 5 | 85 |
| Robots and Crawlers | 8 | 90 |
| Broken Links | 10 | 100 |
| Internal Links | 8 | 80 |
| Redirects | 3 | 100 |
| AI Search | 5 | 25 |
| Performance and Core Web Vitals | 13 | 0 |
| On-Page SEO | 10 | 100 |
| Readability | 8 | 43 |
| Entity SEO | 5 | 0 |
| Link Profile | 7 | 55 |
| Hreflang | 5 | 55 |
| Content Uniqueness | 5 | 100 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | link_profile | 11 orphan page(s) with zero inbound internal links. |  | Add internal links from relevant content pages to these orphan pages. |
| Warning | environment | 1 security headers missing | Missing headers reduce trust and can expose the site to browser/security risks. | Set security headers in `next.config.js` `headers()` or at your edge/CDN. |
| Warning | environment | Content readability is difficult | Long, complex text can reduce engagement and comprehension. | Rewrite key sections with shorter sentences (15-20 words), shorter paragraphs (2-4 sentences), and clearer subheadings. |
| Warning | internal_links | ⚠️ 3 page(s) have fewer than 3 internal links |  |  |
| Warning | readability | ⚠️ Content is difficult to read (Flesch: 25.9) — may reduce engagement |  |  |
| Warning | readability | ⚠️ 25.4% complex words (3+ syllables) — consider simplifying |  |  |
| Warning | readability | ⚠️ Thin content (276 words) — may rank poorly |  |  |
| Warning | robots | ⚠️ 6 AI crawlers not explicitly managed: Applebot-Extended, Bytespider, CCBot, anthropic-ai, FacebookBot |  |  |
| Warning | security | ⚠️ 1 security header(s) missing |  |  |
| Warning | social | ⚠️ og:title is too long (65 chars, max 60) |  |  |
| Info | Wikidata | No Wikidata entry found for 'Sverigemedborgarskapsprov.com'. |  | If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO. |
| Info | Wikipedia | No Wikipedia article found for 'Sverigemedborgarskapsprov.com'. |  | Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals. |
| info | article | article measurement incomplete | [article_seo.py] Traceback (most recent call last): File "/Users/fatnar/Documents/Mobilprov/.agent/skills/seo/scripts/article_seo.py", line 637, in <module> main() ~~~~^^ File "/Users/fatnar/Documents/Mobilprov/.agent/skills/seo/scripts/article_seo.py", line 537, in main structured_data = extract_structured_data(soup) File "/Users/fatnar/Documents/Mobilprov/.agent/skills/seo/scripts/article_seo.py", line 268, in extract_structured_data schema_type = data.get("@type", "Unknown") ^^^^^^^^ AttributeError: 'list' object has no attribute 'get' | Rerun this check after resolving the environment/API/network limitation. |
| Info | environment | Performance measurement incomplete | PageSpeed API returned an error, so CWV recommendations are less reliable. | Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output. |
| info | pagespeed | pagespeed measurement incomplete | Rate limited by Google API. Wait a few minutes or add an API key. | Rerun this check after resolving the environment/API/network limitation. |
| Info | sameAs | Missing sameAs link to LinkedIn (Strong KG signal). |  | Add 'linkedin.com' profile URL to sameAs array in your entity schema. |
| Info | sameAs | Missing sameAs link to Twitter/X (Strong KG signal). |  | Add 'x.com' profile URL to sameAs array in your entity schema. |

## Measurement Notes

2 checks returned errors or incomplete measurements; treat affected scores as directional.
