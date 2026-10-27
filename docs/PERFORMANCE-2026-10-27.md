# Desktop motion investigation — 2026-10-27

**Human evidence:** Babuni.dev reports desktop motion sometimes hangs/looks less fluent. A click momentarily stops an existing shift. User requested gradual drag braking.

## Confirmed mechanisms and changes

- Pointerdown previously paused every shift, even for a click. It now waits for the existing 9px drag threshold before requesting braking; visual press feedback remains immediate.
- Logical playback ramps speed down/up over 280ms for actual manual movement. The uninterrupted 4400ms shift duration and camera/bloom durations remain unchanged. Background/reader pauses remain immediate.
- Coordinate selection replayed all prior line shifts repeatedly; a bounded cache now reuses results until the next settlement. Vacancy sorting/filtering now compiles once per immutable footprint. Unchanged transform/busy writes are skipped.

## Measurements and limits

Local development server, in-app desktop browser, 1280×720 viewport. An opt-in rAF callback sampler records up to 1200 intervals per phase. These intervals are **not physical display FPS**, GPU paint times, a controlled before/after benchmark or a complete browser performance trace. Restarts, changing layouts, random shifts and local load affect the samples.

An initial pre-change sample reported shift median 6.1ms, p95 12.0ms and maximum 33.9ms (one gap above 25ms in the retained sample); one centering sample reported p95 12.4ms. Later post-change samples ranged around shift p95 12–17ms, with occasional gaps above 25ms and a recorded maximum 42.1ms. These data **do not demonstrate an end-to-end FPS improvement** or resolve every reported desktop hitch.

The browser held a pointer press for 700ms while a shift was active. Instrumented pointer samples retained min/max playback rate 1 and zero paused frames, with shift progress advancing. Selection then waited for the normal shift completion. This verifies the behavioral pause fix, separately from general frame timing.

A synthetic coordinate benchmark used 200 historical shifts, 120 coordinates and 100 repeated passes: direct replay took 117.89ms; the cached path including initial misses took 4.92ms in this environment. This isolates coordinate work and is **not** a claim that the website is 24 times faster. Regression tests assert results, not machine-dependent timing thresholds.

## Follow-up

- Recheck held click during a moving line, long drag/release and a project switch after several minutes on Babuni.dev’s desktop.
- Recheck small and big bloom displacement while vertical lines move; caches must not change occupancy.
- If unevenness persists, capture a performance trace in the affected desktop browser to distinguish scripting/layout, raster/compositing, image decoding and display pacing. No GPU bottleneck has been proven by this work.
- Build still reports the existing large JavaScript chunk warning. No complete load-time/memory/GPU audit or new physical-phone test is claimed.

For local diagnosis, run the development server and open `/?grid-profile=1`; read the hidden `#grid-performance` output in developer tools. Normal visits and production builds do not start this sampler. No data leaves the browser.

## Final drag sample and saved evidence

The final real-drag sample recorded playback rate dropping from 1 to 0.328 while the pointer was held, with progress increasing from 0.593 to 0.626; the shift then recovered and finished. The retained shift intervals in this later sample had p95 6.4ms but maximum **84.9ms**, including one gap above 50ms. This reinforces the need to distinguish typical pacing from occasional hitches; their cause is not established by rAF sampling.

Saved samples: [before](performance/grid-profile-before.json) and [after](performance/grid-profile-after.json). They are different random/local-load windows, not a controlled comparison. The archived WebP is visual development history, not video/FPS evidence.

## Retained source cache — 2026-10-27 follow-up

Babuni.dev reports that a long-open tab becomes less smooth when dragging, while Firefox feels better than Chrome. No heap leak has been proven. The bounded tile pool and pruned placement assignments are separate from the append-only shift history. Previously every settlement cleared the coordinate cache, so rebuilding sources replayed increasing history.

The new cache retains up to 2,048 coordinate sources and advances them through appended moves; individual LRU eviction avoids whole-cache flushes. Unseen coordinates still replay full history, and the history itself is not bounded by this change. The vacancy-free source fast path avoids unnecessary occupied/resting allocations. All approved timings and scroll behavior stay unchanged.

Reproduce with `node --experimental-strip-types scripts/benchmark-source-cache.mjs`. Final local sample: previous cache 577.36ms; retained cache 98.83ms; 1,500 seeded shifts × 120 cells, identical checksum -185418. Both benchmark variants use the current vacancy-free history fast path. This is a synthetic computation comparison, not measured display FPS, an hours-long browser run or proof of no Chrome hitches.

Regression coverage includes 1,000 settlements with no full-history replay for warm unaffected cells, mixed vacancy histories, and eviction after more than 2,048 cells. Direct cache tests 4/4 and shift tests 7/7 passed; the project command reported 29 passing test-file entries and production build passed. Follow-up: compare initial and long-open dragging in the affected Chrome and Firefox setups; profile main thread/heap if unevenness persists.
