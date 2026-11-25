# Temporary-cover experiment media

Companion assets for `/blog/code-world-models/`, recorded on 2026-11-25.

## Attribution and scope

- Upstream engine, scene assets and pretrained renderer:
  [SkyworkAI/Matrix-Game, Matrix-Game 4.0](https://github.com/SkyworkAI/Matrix-Game/tree/main/Matrix-Game-4).
- Engine baseline: `51913b2bfa78a6d54de912b8348b1d318f4d36e2`.
- Local experiment commit: `eece0a51a4e53e90abed52eb66621eb59d1410e7`.
- Pretrained model distribution: `Skywork/Matrix-Game-4.0`, revision
  `2c53100457da7abcf0e966f75637c644d3423a63`, Ancient Egypt scene.
- CWM is an architectural reference, not the renderer used in these media.
- Individual work: player-cover rule changes, agent-assisted development,
  verification, headless deployment and experiment presentation. No new model training.
- All videos are offline recordings. This page is not a live agent or game service.

## Media

`comparison.mp4` is the recorded engine/model comparison (left/right).
`model.mp4` is the model output. `engine.mp4` is a re-encoded crop of the
comparison's left half; it is a scaled presentation preview, not the original
1280×720 engine recording. All three contain 319 frames at 48 fps (~6.65 s).

The recorder advances simulation at 2× speed, so the 10-second lifetime occupies
about 5 seconds of playback. `timeline.json` records the actual engine events;
these timestamps do not measure the renderer's visual response delay.

`regression.json` records 35 gameplay checks; `render.json` records the inference
configuration. `implementation.diff` contains the code changes against the
baseline. The upstream source is Apache-2.0; see the upstream repository for its
license and the separate model/asset distribution terms.

The output includes texture deformation, flicker and added visual props. These
limitations are retained in the media and discussed in the article.
