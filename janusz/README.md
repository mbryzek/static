# janusz.bryzek.com

Janusz Bryzek's 1978 Warsaw University of Technology doctoral thesis, _Metoda kompensacji wpływu
temperatury w półprzewodnikowych przetwornikach ciśnienia_, in Polish, in English translation, or
side by side. A static SvelteKit site (`@sveltejs/adapter-static`), prerendered to `build/`.

## Where the text comes from

The thesis lives in the projects repo under `dads-thesis/`; this site publishes a snapshot of it.

    scripts/pull-content.sh <commit>       # mbryzek/projects at that commit
    scripts/pull-content.sh --dir <path>   # a local dads-thesis checkout as it is on disk

It writes:

| Path                     | From dads-thesis                                         |
| ------------------------ | -------------------------------------------------------- |
| `content/pl/<s>.md`      | `source/pl/sections/<s>.md`, s = front, 1-9              |
| `content/en/<s>.md`      | `en/<s>.md`                                              |
| `content/glossary.csv`   | `glossary/glossary.csv` (polish, english, notes)         |
| `static/figures/rys-NN.png` | `source/figures/rys-NN.png`, at most 1600 px a side   |
| `content/source.json`    | the commit, printed in every page footer                 |
| `content/stripped.txt`   | every bracketed span removed as a transcription description |

The library labels (`lib`) and the examiners' reports (`rev-1`, `rev-2`, `rev-3`) are never
copied. Commit what it writes, then build. When corrections land in projects, pull at the new
commit, add an entry to `src/lib/data/changelog.json` crediting the contributors, and republish.

`npm run build` fails until `content/` holds a pull, so an empty site cannot be published.

## How the text is read

`src/lib/thesis/reading.ts` ports `reading()` from `dads-thesis/checks/assemble.py`: a bracketed
transcription description (`[Library stamp in the upper left corner]`) is removed, and a translator
note `[TN: ...]` becomes a numbered endnote at the end of its chapter. Citations (`[3, 5]`), units
(`[1/°C]`), math, links and the scan comments are left alone. Read `content/stripped.txt` after
every pull: it lists each removed span, so a span that was the author's own text shows up there.

LaTeX in the Markdown (`$...$`, `$$...$$`, `\(...\)`, `\[...\]`) is typeset by KaTeX at build time.

## The three readings

- `/pl/<s>` and `/en/<s>`: one language, with a small `s. N` label at the top of each typescript page.
- `/pl-en/<s>`: side by side, one row per scan page. Rows align on the `<!-- scan pNNN | printed page
N -->` comments both texts carry; a page only one text has gets an empty cell on the other side.

The landing page's contents follow the reader's last choice (kept in `localStorage`), English
until they make one. `/glossary` lists the glossary; `/changelog` credits correction contributors.

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
