# Qofeno Lab

Qofeno Lab is a collection of interactive browser projects. The home page is a directory of the three labs. Each card opens the corresponding project at its own address. [Open the directory](https://qofeno.vercel.app/)

| Project | What to try | URL |
| --- | --- | --- |
| Under Sail | Orbit a Three.js pirate ship on a sunset ocean. Its standalone HTML also runs offline. | [Open Under Sail](https://qofeno.vercel.app/labs/sailboat/) |
| Dayframe | Plan a photo shoot around natural light. | [Open Dayframe](https://qofeno.vercel.app/labs/skill/) |
| Qofeno | Explore three scripted conversations for an AI assistant in development and follow its launch feed. | [Open Qofeno](https://qofeno.vercel.app/labs/qofeno/) |
| Qofeno Orbit | Inspect scoped skill packs, deterministic pre-commit gates, and a live runtime sizer for coding agents. | [Open Qofeno Orbit](https://qofeno.vercel.app/labs/elite-web-craft/) |

## Develop locally

Install Node.js 20.9 or later. Run these commands from the repository root.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/`. For a production check, run `npm run lint`, `npm run build`, and `npm start`.

## Add or update a lab

1. Choose a short slug. For a standalone lab, put its `index.html` and assets in `public/labs/<slug>/`. For a Next.js lab, create `src/app/labs/<slug>/page.tsx` and put its public files in `public/labs/<slug>/`.
2. Keep the original request in `public/labs/<slug>/prompt.txt`, or record the supplied skill in `skill.txt`. Add a card to the directory in `src/app/page.tsx`.
3. Push to `main`, the repository’s single branch. Vercel builds the Next.js project from the repository root and publishes the lab at `https://qofeno.vercel.app/labs/<slug>/`. Editing an existing slug updates that same URL.

## Qofeno AI

The Next.js App Router serves the Qofeno page. Its code-drawn lens, sample conversations, and room comparison use Young Serif, Public Sans, and scoped GSAP animation. The examples run in the browser. Add release entries to `public/labs/qofeno/updates.xml` to publish them to the launch feed.

The Under Sail prompt, Dayframe skill, and Qofeno brief are kept with the individual labs. [Under Sail prompt](public/labs/sailboat/prompt.txt) · [Dayframe skill](public/labs/skill/skill.txt) · [Qofeno prompt](public/labs/qofeno/prompt.txt) · [Qofeno skill](public/labs/qofeno/skill.txt) · [Qofeno Orbit prompt](public/labs/elite-web-craft/prompt.txt) · [Qofeno Orbit skill](public/labs/elite-web-craft/skill.txt)
