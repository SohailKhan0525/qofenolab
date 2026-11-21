# Qofeno Lab

Each experiment has its own folder on `main` and opens directly at its own URL. **Under Sail** is a standalone Three.js scene. Download its HTML file to run it offline. [Under Sail source](docs/labs/sailboat/index.html) · [Original prompt](docs/labs/sailboat/prompt.txt)

**Dayframe** is a natural-light planner for photographers, built with the Taste-Inspired Web Design skill. [Open Dayframe](https://sohailkhan0525.github.io/qofenolab/labs/skill/) · [Design skill](docs/labs/skill/skill.txt)

## Add a lab

1. Choose a short URL slug such as `another` and create `docs/labs/another/` on `main`.
2. Put the finished page in `index.html` and save the original request beside it as `prompt.txt`. For a lab based solely on a named skill, record its name in `skill.txt`.
3. Push to `main`. With Pages enabled, GitHub publishes the new folder at `labs/another/` under the site’s base URL. Editing an existing folder updates the same URL.

`main` is the only branch. Keep the publishing root `docs/` and the `docs/labs/` directory free of index files so visitors enter through a lab URL. The repository README stays outside the published site.

## GitHub Pages

In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select **main** and **/docs**, and save. GitHub then publishes changes from `main` automatically. [Pages settings](https://github.com/SohailKhan0525/qofenolab/settings/pages)

| Lab folder | Published URL with Pages enabled |
| --- | --- |
| `docs/labs/sailboat/` | `https://sohailkhan0525.github.io/qofenolab/labs/sailboat/` |
| `docs/labs/skill/` | `https://sohailkhan0525.github.io/qofenolab/labs/skill/` |
| `docs/labs/another/` (future example) | `https://sohailkhan0525.github.io/qofenolab/labs/another/` |
