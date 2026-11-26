# Qofeno

The Next.js App Router source for the Qofeno conversational AI preview. The landing page uses self-hosted Young Serif and Public Sans, code-drawn illustrations, and scoped GSAP animation. The export runs on GitHub Pages without a server.

## Develop

From `labs-src/qofeno/`, install the locked dependencies with Node 20.9 or later.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/qofenolab/labs/qofeno/`.

## Publish changes

```sh
npm run lint
npm run export:pages
```

The production build checks TypeScript, then copies the exported page and runtime into `docs/labs/qofeno/`. Commit the source and generated files together on `main`. The repository's Pages configuration publishes the result at [Qofeno](https://sohailkhan0525.github.io/qofenolab/labs/qofeno/).

The original font licenses are included under `src/app/fonts/` and with the published files.

## Design and content

The optical-bench concept uses a second lens as a metaphor for a second perspective. Six stippled elements slide between an exploded drawing and an assembled lens. Warm paper, rust ink and an editorial type pairing carry through the conversation folio, room comparison, launch questions and feed.

The preview contains three authored conversations. The reading example exposes the source memo, and the room comparison shows how changing a priority affects a recommendation. Launch updates come from the static Atom feed in `public/updates.xml`. Add future entries there and rebuild to publish them to subscribers.
