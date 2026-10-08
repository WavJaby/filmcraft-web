# FilmCraft: unofficial browser experience

Try https://wavjaby.github.io/filmcraft-web/. Original project: https://github.com/storytold/filmcraft. Official desktop downloads: https://github.com/storytold/filmcraft/releases/latest.

FilmCraft is made by the ArtCraft Team and contributors. This independent community mirror makes the official v0.4.0 web build easier to try without installation; it is not operated or endorsed by them. Official release inputs remain byte-for-byte unchanged; the host uses a community single-page bootstrap.

## Hosting and delivery

`node scripts/build-site.cjs` performs a dry run; add `--write` to generate `_site/`. Each original file is pinned in `upstream-files.json`. Wasm: 40,753,243 bytes; gzip: 14,797,620 bytes; 29 content-addressed parts at most 512 KiB each. The builder checks exact reconstruction. Four bounded downloads feed streaming decompression; per-part and whole-file SHA-256 gate completion and caching. Generated parts stay outside Git. Official request `app/filmcraft_web_bg.wasm?v=77e42d7c069d615e` is configured separately from its query-free file path; other versions pass through.

The shell adds progress, upstream/download links, transparent credits, a collapsible toolbar and a dismissible notice. English is default; any first preferred browser language beginning with `zh` uses Traditional Chinese. Choices persist when browser storage permits. The shell uses v0.2.1 default Dark tokens from `crates/ui-egui/src/theme.rs:Tokens::for_kind`; editor theme changes do not change it. Official JS/Wasm remain unchanged; the community bootstrap runs them in the main document.

Below 900 CSS pixels, the editor fits a 960-pixel virtual viewport; 50%/75%/100% overrides persist. Landscape works best; scaling does not add touch support. The official module reads `webgl`, `cpu`, `nowebcodecs`, `empty`, `fresh` and `norecover` directly from the page URL. Readiness uses `filmcraftLoad.readyMs`; startup failures and runtime Wasm traps appear in the community loader. A GPU startup failure reloads the page once with `?webgl`; failures after readiness never trigger automatic reload. The original AudioWorklet script is copied unchanged to the site root because the module requests it relative to the document.

## Browser capabilities and limits

Source evidence: tagged v0.4.0 `docs/web.md` and `apps/filmcraft-web/src/`. This is not exhaustive desktop parity proof.

| Area | Browser behavior |
|---|---|
| Media and codecs | Files stay local. Picker/drop imports File handles; MP4/MOV use chunked reads. Rust decoders are built in; supported MP4/MOV video may use WebCodecs first. No separate FFmpeg download |
| Export | Built-in Rust encoders; H.264 + AAC MP4 and other supported formats download from memory. No server-side conversion. Output size and codec work consume browser memory/CPU |
| Parallelism | Official build is single-threaded; frame/render/encode work advances cooperatively between UI frames. Proxies, rendered previews, Project Manager and mask tracking report unavailable |
| GPU/audio | WebGPU enables GPU compositing; WebGL2 uses CPU compositing. WebAudio AudioWorklet needs a user gesture to resume audio |
| Recovery | OPFS snapshots and copies of some media can restore work; quota, private browsing and clearing site data can prevent recovery. Keep project downloads and original media separately |

Long videos, 4K and effects can be slow. Mobile fitting does not establish phone performance. Browser limits do not imply identical desktop limits; FilmCraft remains alpha. Browser import/playback/export checks are separate from packaging and unit tests.

## Provenance and licenses

Official release: https://github.com/storytold/filmcraft/releases/tag/v0.4.0. Archive SHA-256 matches the release's `SHA256SUMS.txt`; `upstream-files.json` records it and original file hashes. Packaging restores exact bytes; this verifies release consistency, not an independent author-signature chain. The original HOSTING.md size estimate is stale; use measured sizes above.

FilmCraft is MIT OR Apache-2.0. Preserve LICENSE-MIT, LICENSE-APACHE, [NOTICE](app/NOTICE), [ATTRIBUTION.md](app/ATTRIBUTION.md), font-license texts and [brand terms](app/docs/brand/LICENSE-brand.txt). Host code adapted from the community mirrors is MIT. The host uses plain text attribution and no extracted brand logos. Symphonia components are MPL-2.0; see [dependency notice and source links](app/credits.html). No complete transitive dependency-license audit is claimed.

`node --test tests/*.test.cjs` runs unit/selftest gates for delivery, failures/retries, integrity, caching and provenance. Isolated-browser and real public-session checks are separate evidence tiers.

## Single-page hosting and updates

The community bootstrap in `app-loader.js` mounts the official canvas in the main document; no iframe is created. Original JS/Wasm are verified against `upstream-files.json`. The host, loader and layout are community code, not an official build or endorsement. Keep upstream copyright, licenses, NOTICE and third-party attributions; do not extract ArtCraft brand marks into the host.

Wasm and compressed parts are ignored. CI downloads the exact archive pinned by URL + SHA-256, restores the verified Wasm, generates a fresh Pages artifact, and deploys it without committing binaries. Browser asset caches retire prior Wasm hashes on service-worker activation. Existing Git history is not rewritten by this change.

1. Select an explicit official web ZIP and verify its published SHA-256; never silently follow latest.
2. Run `node scripts/update-upstream.cjs --archive HTTPS_ZIP_URL --sha256 SHA256 --version VERSION` to inspect the update, then repeat with `--write`. The command rejects changed archive/bootstrap contracts; review upstream licensing, supplemental notices and web/desktop differences.
3. Run `node scripts/build-site.cjs --output _site-review --write`, then set `ARTCRAFT_SITE_DIR=_site-review` and run `node --test tests/*.test.cjs`; perform fresh-browser import/edit/export, mobile and renderer-failure checks.
4. Commit only source, configuration and provenance metadata, then push. Pages builds its current version from scratch; neither the old nor the new Wasm/parts enter Git.

For a clean checkout, `node scripts/update-upstream.cjs --restore` restores only the pinned Wasm. `--restore --archive LOCAL_ZIP` accepts a local copy with the same pinned archive hash.
