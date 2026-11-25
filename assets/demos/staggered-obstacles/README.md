# Staggered Obstacles — Coding Agent demo (offline, pre-recorded)

Real code change, real layout API, real engine simulation, and the existing
Matrix-Game 4.0 Ancient Egypt model render. No realtime agent log is claimed.

- Engine: `Matrix-Game`, branch `staggered-obstacles-demo`, commit
  **85a12f284337f4ba0305684923cd92b08fea2713**, diff relative to the previous
  task's commit `eece0a51` (284 insertions, 10 deletions, 5 files).
- Model: `Skywork/Matrix-Game-4.0` @ `2c531004…`; no training/weight changes.

## Requirement

Place three obstacles ahead of the character, staggered left/right, leaving a
passable route; the character must actually walk around them. This package
covers example 1 only (no sensor door).

## Layout API (real scene edit, separate from player cover)

`Encounter::loadStaggeredObstacles(config)` creates exactly three obstacles with
independent tokens and collision/nav bodies. It reuses the existing obstacle box
mesh, `bboxFill(coverSettings.color)` material and `Collision::setObstacle`.
`clearStaggeredObstacles()` releases them. The player temporary-cover singleton
(`wall`) is untouched and remains independent.

Final config:

| Field | Value |
|---|---|
| size (w×h×d) | 1.6 × 1.8 × 0.35 m |
| spacing | 3.0 m |
| lateral offset | 1.7 m, sides [−1, +1, −1] |
| first distance | 5.0 m |
| central gap | 1.8 m |

Load validation (no relaxed collision): flat supported ground at 5 samples per
obstacle, no overlap with map objects/actors/other obstacles, corridor ≥1.2 m,
spacing > depth+1 m, first distance ≥2 m. A failed load creates nothing.

## Demo

- Deterministic fixture: nav sample + 24 yaw directions, accepted only if the
  real loader succeeds and a 0.84×1.8 m capsule is clear along the whole route.
  NPC interference is explicitly disabled and recorded (`npc_interference_disabled`).
- 48 fps, **1× simulation**: 120 Hz physics with alternating 2/3 steps per frame
  (average 2.5); the session metadata records this.
- Frames 0–47: no obstacles. Frame 48: one real `loadStaggeredObstacles()` call
  (3 tokens). 0.25 s hold/start pan, then ordinary `input.forward/right` follows
  parametrized waypoints with a small ±0.45 m weave and recentering after each
  obstacle. Finish hold + look-back. No per-frame position writes.

## Engine result (final take)

- 480 frames, 1280×720, 48 fps, **10.0 s playback = 10.0 s simulation**.
- layout loaded: frame 48, simulation **1.000 s**, tokens **37263/37264/37265**.
- obstacle passes: frame 173 / **3.625 s**, frame 233 / **4.875 s**,
  frame 292 / **6.100 s**.
- finish: frame 314, **6.558 s**; obstacles remain active (3).
- path length **13.21 m**; max per-frame step 0.0625 m (no teleport).
- `session.json`: `status=complete`, `prompt_verified=true`, `speed=1.0`,
  `physics_steps_per_frame=2.5` (alternating note included).

## Validation

- Staggered integration: **30/30 passed**. Exactly 3 tokens, alternating
  left/right/left, 3 m spacing, non-interpenetration, collision on each token,
  capsule clearance on the route, ordinary movement reaches finish in 5.33 s,
  max per-tick step 0.0208 m, cover singleton unchanged, clear releases
  collision/draw, map objects untouched.
- Previous temporary-cover regression rerun: **35/35 passed**.
- Raw reports in `validation/`.

## Model render and honest visual check

- `media/model_output.mp4`: 480 frames, 864×480, 48 fps, `status=complete`,
  model processing 22.15 s, full decode clean (0 error bytes).
- Engine behavior is validated. **Visual controllability is NOT claimed**:
  - At frame 47, before any layout call, the model already shows barrier-like
    green glowing props (model prior), so barrier presence at the start cannot
    be attributed to the three loaded objects.
  - After load, the three purple boxes are re-interpreted as dark wooden
    crates/barricades and green glowing pylons; one-to-one count, identity and
    geometry are not conserved. The look-back view shows an ambiguous number of
    green pylons plus a large dark slab.
  - Therefore this is behavior-level simulation success with weak visual
    fidelity, not a verified controllable obstacle layout. Details:
    `validation/visual_assessment.json`.

## Files

```
media/engine_input.mp4          engine capture, H.264 1280x720, 480 frames
media/model_output.mp4          model render, 864x480
media/input_vs_output.mp4       labeled side-by-side, 480 frames, faststart
keyframes/contact_sheet.png     frames 47/55/180/300/400
keyframes/native/               native-resolution engine/model keyframes
panorama_start_engine.png       start panorama: 3 barriers clearly countable
panorama_start_model.png        same moment in model output
patch.diff                      git diff eece0a51..HEAD
validation/                     30-check + 35-check reports, timeline, events,
                                render report, media hashes, visual assessment
scripts/                        test/record/artifact scripts + headless env
```

## Reproduce

```bash
cd <matrix-baseline>
.venv/bin/python scripts/test_staggered_obstacles.py
scripts/run_staggered_obstacle_demo.sh outputs/staggered-obstacles-demo/recordings
S=$(ls -d outputs/staggered-obstacles-demo/recordings/session-* | tail -1)
scripts/run_render.sh $S/take-1 outputs/staggered-obstacles-demo/model realtime fixed
.venv/bin/python scripts/make_staggered_artifacts.py \
  $S/take-1 outputs/staggered-obstacles-demo/model outputs/staggered-obstacles-demo
```

Capture used Mesa llvmpipe software OpenGL; capture wall-clock speed is not
game/model FPS. Model `seconds` is processing time only. No HUD/audio is sent to
the model. No training, no weight changes, no system driver changes.
