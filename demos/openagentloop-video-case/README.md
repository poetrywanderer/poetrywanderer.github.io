# Agnes Edited-Keyframe Video Agent Loop Demo

Open `demo-compact.html` for the single-screen figure-style walkthrough.
Open `demo.html` for the full visual walkthrough.

Prompt:

```text
A realistic cinematic video in a modern kitchen. One chef wearing a white jacket stands centered behind a wooden table. Gentle steam rises from a small pot in the background. Three red tomatoes are on the left side of the table and two blue bowls are on the right side.
```

## Flow

1. `initial.mp4`: text-to-video V0.
2. `initial-ledger.json`: Qwen observer finds failed constraints.
3. `initial-policy.json`: controller plans the repair.
4. `keyframe-repairs/turn-01-reference-edited.png`: Agnes Image edits the selected V0 frame.
5. `turn-01.mp4`: Agnes Video regenerates from the edited keyframe.
6. `turn-01-ledger.json`: Qwen observer verifies the new video.

Core repaired constraints in V1: three tomatoes, two blue bowls, centered chef, rising steam.
