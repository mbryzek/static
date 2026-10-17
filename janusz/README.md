# janusz.bryzek.com

Janusz Bryzek's 1978 Warsaw University of Technology doctoral thesis, _Metoda kompensacji wpływu
temperatury w półprzewodnikowych przetwornikach ciśnienia_, in Polish, in English translation, or
side by side. A static SvelteKit site (`@sveltejs/adapter-static`), prerendered to `build/`.

## Where the text comes from

The thesis lives in the projects repo under `dads-thesis/`; this site publishes a snapshot of it.

    scripts/pull-content.sh --dir <path>   # a local dads-thesis checkout as it is on disk

The projects repo encrypts every path at rest with git-crypt, so a clone of it holds ciphertext:
the pull reads an unlocked checkout (`--dir ~/Desktop/projects/dads-thesis`) and refuses a locked
one. The footer still names the projects commit, and a pull with uncommitted changes to a
published file is marked `-dirty`.

It writes:

| Path                        | From dads-thesis                                            |
| --------------------------- | ----------------------------------------------------------- |
| `content/pl/<s>.md`         | `source/pl/sections/<s>.md`, s = front, 1-9                 |
| `content/en/<s>.md`         | `en/<s>.md`                                                 |
| `content/glossary.csv`      | `glossary/glossary.csv` (polish, english, notes)            |
| `content/CHANGELOG.md`      | `CHANGELOG.md`, when a correction has landed                |
| `static/figures/rys-NN.png` | `source/figures/rys-NN.png`, at most 1600 px a side         |
| `content/source.json`       | the commit, printed in every page footer                    |
| `content/stripped.txt`      | every bracketed span removed as a transcription description |

The library labels (`lib`) and the examiners' reports (`rev-1`, `rev-2`, `rev-3`) are never
copied. Commit what it writes, then build. When corrections land in projects, pull again from
the unlocked checkout and republish: the corrections intake (`dads-thesis/checks/intake.py`)
writes the credits into `CHANGELOG.md` in the same commit as the corrections, and `/changelog` is
built from it.

`npm run build` fails until `content/` holds a pull, so an empty site cannot be published.

## How the text is read

`src/lib/thesis/reading.ts` ports `reading()` from `dads-thesis/checks/assemble.py`: a bracketed
transcription description is removed when it opens with one of assemble.py's descriptors
(`[stamp: ...]`, `[handwritten, top left: ...]`, `[inserted above line: ...]`), and a translator
note `[TN: ...]` becomes a numbered endnote at the end of its chapter, attached to the line above it
when it stands alone. Everything else in brackets is the thesis's text and stays: citations
(`[3 ÷ 24]`), units, the translated titles in the bibliography, uncertain readings (`[?: ...]`). Read `content/stripped.txt` after
every pull: it lists each removed span, so a span that was the author's own text shows up there.

LaTeX in the Markdown (`$...$`, `$$...$$`, `\(...\)`, `\[...\]`) is typeset by KaTeX at build time.

## The three readings

- `/pl/<s>` and `/en/<s>`: one language, with a small `s. N` label at the top of each typescript page.
- `/pl-en/<s>`: side by side, one row per scan page. Rows align on the `<!-- scan pNNN | printed page
N -->` comments both texts carry; a page only one text has gets an empty cell on the other side.

The landing page's contents follow the reader's last choice (kept in `localStorage`), English
until they make one. `/glossary` lists the glossary; `/changelog` credits correction contributors.

## The questions page

`/questions` asks the open questions in `dads-thesis/notes/reviewer-brief.md` and nothing else,
in three groups:

- **Contestable glossary terms**: every row of `glossary.csv` whose notes begin `CONTESTABLE`,
  read off the pull. Answers: agree, prefer another term (the term and a reason), skip.
- **Judgment calls** and **typescript defects**: transcribed from the brief (and
  `notes/source-errata.md`) into `src/lib/data/questions.json`:

      {
        "judgments": [{ "key": "1", "scan": "p012", "polish": "...", "english": "...",
                        "question": { "pl": "...", "en": "..." } }],
        "defects":   [{ "key": "p031-a", "scan": "p031", "reading": "what the typescript prints",
                        "chosen": "what the translation took it to mean" }]
      }

  A judgment call is answered agree, otherwise, or skip, with a short answer; a defect confirm,
  disagree (with a reason) or not sure. `scan` is the scan page id of the `<!-- scan pNNN -->`
  comment; the build refuses one no Polish section has. A judgment's `scan` is optional.

Every question has a stable id, the `question_id` its answers are stored under:
`glossary-<slug of the Polish term>`, `judgment-<key>`, `defect-<key>`. Never reuse a key for a
different question: the corrections intake reads answers back by it. Each question links to its
page of the side-by-side view (a glossary term to the first page whose Polish text uses it).

Answers go to platform's `POST /thesis/submissions` (`spec/thesis.json`, client generated into
`src/generated/` by `dev api` from `.api/config.pkl`), one per answered question, with the
visitor's optional name and background and the pulled commit as `site_version`. A question left
unanswered sends nothing; a defect's "not sure" is sent as `skip`. When platform's per-address
limit answers 429 the page stops, keeps every unsent answer, and shows the wait. Nothing
submitted is ever read back; after sending, the page shows a thank-you and nothing else.

The brief's terminology list also names two terms no glossary row marks CONTESTABLE: przetwornik →
transducer, and "element" vs "component" for the compensation-setting elements. Those two are judgment
calls in `questions.json` (`term-przetwornik`, `term-element`), so a glossary row marked CONTESTABLE
later must not repeat one of them. `src/lib/server/questions.test.ts` pins every id the page asks.
`VITE_API_BASE_URL` points a local build at another platform.

## Development

    npm ci
    scripts/pull-content.sh --dir fixtures/dads-thesis   # a miniature, for working without the thesis
    npm run dev
    npm run check     # svelte-check, eslint, vitest

`fixtures/dads-thesis` is a miniature of the real tree in its layout and conventions, and is what
the tests read. Do not commit a pull of it into `content/`.

## Deploying

A Cloudflare Pages project on the personal account, `janusz-bryzek`, with the custom domain
`janusz.bryzek.com` (the bryzek.com zone is on the same account):

    npm ci && npm run build
    npx wrangler pages deploy build --project-name janusz-bryzek --branch main
