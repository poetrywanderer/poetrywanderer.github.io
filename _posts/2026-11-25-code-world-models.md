---
title: "Coding Agent × 生成式渲染：从世界模型到游戏创作"
date: November 2026
permalink: /blog/code-world-models/
excerpt: "从交互式世界模型出发，探索 Coding Agent、可执行引擎与生成式渲染如何协作，并通过临时护盾装置与补给装置布局两个实验，展示从文字需求到代码、引擎画面与 AI 渲染的游戏原型创作流程。"
categories:
  - research-blog
tags:
  - World Models
  - Coding Agents
  - Neural Rendering
  - Video Generation
custom_css: /assets/css/code-world-models.css
comments: false
---

<div class="wm-intro">
  <p class="wm-eyebrow">研究笔记 · 世界模型与游戏创作</p>
  <p class="wm-lead">当用户可以用文字描述玩法，谁来实现规则，又由谁生成画面？</p>
  <p>从交互式世界模型出发，我更关注一种分工：Coding Agent 将创作意图转成代码，引擎维护世界状态，视频模型生成视觉表现。本文简要梳理相关路线，并基于 Matrix-Game 4.0 展示临时护盾装置与补给装置布局两个实验，探索从文字需求、代码修改到引擎画面与 AI 渲染的游戏原型创作流程。</p>
  <a class="wm-jump" href="#demo">直接看实验 ↓</a>
</div>

## 从视频生成到交互式世界：谁负责状态，谁负责画面？

讨论世界模型时，我关心的首先是：一个动作发生后，**谁决定世界如何变化，又由谁把变化画出来？** 按这个问题，可以把相关工作粗略分为三组。这是面向交互应用的工作性分类，边界会重叠，也不覆盖所有世界模型研究。

| 路线 | 世界如何演化 | 视觉如何产生 | 代表性工作与主要问题 |
|---|---|---|---|
| 从视频中学习世界先验 | 在生成过程中隐式预测事件与变化 | 视频模型直接生成 | 早期 Sora 的世界模拟探索；视觉合理性不等于可执行规则 |
| 动作条件的学习式模拟 | 模型根据历史观测与动作预测后续状态或画面 | 由学习式模型生成观测 | GameNGen、DIAMOND、Genie 系列；关注动作响应、记忆与误差累积 |
| 可执行状态 + 生成式外观 | 代码或引擎显式执行规则，Agent 可编写或更新程序 | 视频模型接收 proxy、画面等条件 | Matrix-Game 4.0、CWM；关注状态到视觉的忠实表达与实时性 |

第一组提供了理解视频生成能力的一种视角：模型能表现运动、空间与部分物体交互，但这本身不保证精确的物理和持久状态。参见 [Sora 早期技术报告](https://openai.com/index/video-generation-models-as-world-simulators/)。

第二组把动作纳入预测。比如 [GameNGen](https://gamengen.github.io/) 根据过去画面和动作预测后续帧；[DIAMOND](https://diamond-wm.github.io/) 还研究了在学习到的环境中训练强化学习策略。[Genie 2](https://deepmind.google/blog/genie-2-a-large-scale-foundation-world-model/) 是可交互生成环境的另一个代表。它们的吸引力在于从数据学习环境，而工程挑战之一是让长程后果持续成立。

第三组将世界演化与视觉实现拆开：门是否打开、桥是否断裂、道具是否仍在，由程序维护；材质、光照与丰富的外观交给生成模型。对于用户参与创作的游戏，我目前更看好这种组合，因为玩法修改可以落到可调试的状态与代码上。

## 为什么让 Coding Agent 当“大脑”？

这里的“大脑”主要指理解创作意图、编写规则和更新世界描述，常规移动与碰撞仍由引擎按帧执行。没有必要让 LLM 在每一帧重新计算人物位置。

<ol class="wm-pipeline" aria-label="从用户意图到生成画面的分工">
  <li><span>01 · 意图</span><strong>用户描述玩法</strong><p>物品、规则、场景与视觉目标</p></li>
  <li><span>02 · 程序</span><strong>Coding Agent</strong><p>修改代码、配置或场景描述，运行检查</p></li>
  <li><span>03 · 状态</span><strong>可执行引擎</strong><p>推进模拟，输出几何、相机和 proxy 画面</p></li>
  <li><span>04 · 外观</span><strong>视频渲染模型</strong><p>在结构约束下生成可观看的视觉结果</p></li>
</ol>

这条路线有两个相关但不同的参考。[Matrix-Game 4.0](https://arxiv.org/abs/2610.27999) 结合游戏引擎、编码智能体与流式视频渲染；其公开实现明确让引擎负责玩法、物理和输入，让视频模型处理低多边形 RGB 流。[Code World Model（CWM）](https://arxiv.org/abs/2608.25927) 则强调 Coding Agent 通过可执行代码维护持久状态，再将状态编译成逐帧 proxy，驱动视频生成。两者共享分工思路，但 proxy 设计、生成模型与系统实现并不相同。

对我而言，它们最有价值的连接点是**降低创作门槛**：用户可以提出新玩法，Agent 可以实现逻辑，但这还不会自动产生模型、纹理、灯光与动画。生成式渲染有机会让一个粗糙的可执行原型，更早获得接近视觉目标的表现。能做到多接近、成本是否更低，仍需实验验证。

<nav class="wm-demo-nav" aria-label="选择实验"><a href="#demo">实验一 · 临时护盾装置</a><a href="#staggered-demo">实验二 · 补给装置布局</a></nav>

<h2 id="demo">实验一：会消失、能替换的护盾装置</h2>

我在 Matrix-Game 4.0 的 Ancient Egypt 场景上，使用 Coding Agent 调整场景装置的放置与生命周期，再将引擎录制交给官方预训练模型渲染。这里用“护盾／补给装置”描述生成画面中的道具外观，实验考察装置的放置、替换、消失与空间布局。

<blockquote class="wm-request">
  <p><strong>用户需求</strong></p>
  <p>玩家放置的护盾装置在 10 秒游戏时间后消失；同时最多存在一个；再次放置时，用新装置替换旧装置。</p>
</blockquote>

### 从文字需求到可执行结果

| 阶段 | 本次实际完成的内容 | 可以检查的结果 |
|---|---|---|
| 理解与改写 | Agent 阅读已有 C++ 玩法代码，将玩家放置的装置寿命改为 10 秒，并加入再次放置的替换路径 | [实际代码 diff]({{ '/assets/demos/code-world-models/implementation.diff' | relative_url }}) |
| 构建与验证 | 编译修改后的引擎，检查放置、替换、非法位置、生命周期与碰撞清理 | [35 项回归检查]({{ '/assets/demos/code-world-models/regression.json' | relative_url }}) |
| 引擎模拟 | 固定合法初始位置，通过普通放置输入触发规则；录制低多边形画面和事件 | [事件时间线]({{ '/assets/demos/code-world-models/timeline.json' | relative_url }}) |
| AI 渲染 | 使用 Ancient Egypt 预训练权重与固定场景 prompt 处理录制，不训练或更新权重 | [推理配置与结果]({{ '/assets/demos/code-world-models/render.json' | relative_url }}) |

实现上的关键是先校验、再替换，而不是先删掉旧物体再尝试生成新物体。下面是对应逻辑的简化伪代码，完整 C++ 修改见 diff：

```text
on_place_device():
    candidate = validate_placement(ignore = previous_device)
    if candidate is invalid:
        keep previous_device
        return
    remove previous_device and its collision
    create temporary_device(candidate, born = simulation_time)

on_simulation_step():
    if temporary_device.age >= 10 seconds:
        remove temporary_device and its collision
```

### 引擎布局与 AI 渲染对照

默认左侧为引擎画面，右侧为 AI 输出。可以切换单独视图，或点击时间点查看对应阶段；时间线标记来自引擎事件，不能当作生成画面的精确响应延迟。

<div class="wm-demo" data-world-demo>
  <div class="wm-demo__toolbar">
    <label for="world-demo-view">画面视图</label>
    <select id="world-demo-view" data-demo-view>
      <option value="comparison">引擎 / AI 并排</option>
      <option value="engine">仅低多边形引擎</option>
      <option value="model">仅 AI 渲染</option>
    </select>
    <span>离线录制 · 319 帧 · 48 fps 播放</span>
  </div>
  <video controls playsinline preload="metadata" width="1728" height="480" poster="{{ '/assets/demos/code-world-models/comparison-poster.webp' | relative_url }}" data-demo-video
    data-comparison="{{ '/assets/demos/code-world-models/comparison.mp4' | relative_url }}"
    data-engine="{{ '/assets/demos/code-world-models/engine.mp4' | relative_url }}"
    data-model="{{ '/assets/demos/code-world-models/model.mp4' | relative_url }}"
    data-poster-comparison="{{ '/assets/demos/code-world-models/comparison-poster.webp' | relative_url }}"
    data-poster-engine="{{ '/assets/demos/code-world-models/engine-poster.webp' | relative_url }}"
    data-poster-model="{{ '/assets/demos/code-world-models/model-poster.webp' | relative_url }}"
    aria-label="临时护盾装置实验：低多边形引擎与 AI 生成视频对照" aria-describedby="demo-caption">
    <source src="{{ '/assets/demos/code-world-models/comparison.mp4' | relative_url }}" type="video/mp4">
    浏览器不支持内嵌视频，请使用下方链接查看 MP4。
  </video>
  <div class="wm-demo__events" aria-label="跳转到事件关键帧">
    <button type="button" data-demo-seek="0.104" aria-pressed="false"><strong>放置前</strong><span>视频 0.10 s</span></button>
    <button type="button" data-demo-seek="0.521" aria-pressed="false"><strong>首次放置</strong><span>事件 0.25 s · 看 0.52 s</span></button>
    <button type="button" data-demo-seek="1.25" aria-pressed="false"><strong>替换位置</strong><span>事件 1.13 s · 看 1.25 s</span></button>
    <button type="button" data-demo-seek="6.25" aria-pressed="false"><strong>到期消失</strong><span>事件 6.13 s · 看 6.25 s</span></button>
  </div>
  <p class="wm-demo__status" data-demo-status role="status" aria-live="polite">可播放完整流程，或跳转到四个阶段的关键帧。</p>
  <p id="demo-caption" class="wm-demo__caption">引擎中的紫色几何装置，在 AI 画面中呈现为护盾或补给道具样式，外观会随时间变化。录制采用 2× 模拟速率：10 秒游戏时间约对应 5 秒视频。单独引擎预览从并排视频左侧提取，已缩放至 864 × 480。</p>
  <p class="wm-demo__downloads"><a href="{{ '/assets/demos/code-world-models/comparison.mp4' | relative_url }}">并排视频 MP4</a><a href="{{ '/assets/demos/code-world-models/engine.mp4' | relative_url }}">引擎预览 MP4</a><a href="{{ '/assets/demos/code-world-models/model.mp4' | relative_url }}">AI 视频 MP4</a></p>
</div>

<h2 id="staggered-demo">实验二：交错布置三个补给装置，保留一条通路</h2>

第二个实验将重点从单个物体的生命周期，转向多个物体的数量、空间布局和可通行性。

<blockquote class="wm-request">
  <p><strong>用户需求</strong></p>
  <p>在角色前方布置三个补给装置，左右交错排列，中间保留可通行的路线，让角色能够绕过它们。</p>
</blockquote>

Coding Agent 在引擎中新增了可配置的场景布局接口 `loadStaggeredObstacles(config)`，复用已有几何和碰撞接口，为三个补给装置分别创建独立物体。它们与实验一的临时护盾装置独立维护。下面是最终布局配置，距离与尺寸的单位为米：

```json
{
  "width": 1.6, "height": 1.8, "depth": 0.35,
  "first_distance": 5.0, "spacing": 3.0,
  "lateral": 1.7, "sides": [-1, 1, -1]
}
```

补给装置沿前进方向相隔 3 米，左右偏移 1.7 米，中央净宽约 1.8 米。加载前检查地面支撑、物体重叠与路径净空；演示使用确定性的合法起点，并关闭 NPC 干扰。角色通过普通移动输入跟随带有小幅左右偏移的路线，依次经过三个装置，最后停下回望，过程中没有逐帧改写位置。

### 引擎布局与 AI 渲染对照

<div class="wm-demo" data-world-demo>
  <div class="wm-demo__toolbar">
    <label for="obstacle-demo-view">画面视图</label>
    <select id="obstacle-demo-view" data-demo-view>
      <option value="comparison">引擎 / AI 并排</option>
      <option value="engine">仅低多边形引擎</option>
      <option value="model">仅 AI 渲染</option>
    </select>
    <span>离线录制 · 10 秒 · 1× 模拟速率</span>
  </div>
  <video controls playsinline preload="metadata" width="1728" height="480" poster="{{ '/assets/demos/staggered-obstacles/comparison-poster.webp' | relative_url }}" data-demo-video
    data-comparison="{{ '/assets/demos/staggered-obstacles/comparison.mp4' | relative_url }}"
    data-engine="{{ '/assets/demos/staggered-obstacles/engine.mp4' | relative_url }}"
    data-model="{{ '/assets/demos/staggered-obstacles/model.mp4' | relative_url }}"
    data-poster-comparison="{{ '/assets/demos/staggered-obstacles/comparison-poster.webp' | relative_url }}"
    data-poster-engine="{{ '/assets/demos/staggered-obstacles/engine-poster.webp' | relative_url }}"
    data-poster-model="{{ '/assets/demos/staggered-obstacles/model-poster.webp' | relative_url }}"
    aria-label="三个交错补给装置实验：引擎布局、角色绕行与 AI 渲染对照" aria-describedby="obstacle-demo-caption">
    <source src="{{ '/assets/demos/staggered-obstacles/comparison.mp4' | relative_url }}" type="video/mp4">
    浏览器不支持内嵌视频，请使用下方链接查看 MP4。
  </video>
  <div class="wm-demo__events" aria-label="跳转到补给装置实验关键帧">
    <button type="button" data-demo-seek="0.979167" aria-pressed="false"><strong>加载前</strong><span>第 47 帧 · 0.98 s</span></button>
    <button type="button" data-demo-seek="1.145833" aria-pressed="false"><strong>三个装置</strong><span>第 55 帧 · 1.15 s</span></button>
    <button type="button" data-demo-seek="3.75" aria-pressed="false"><strong>沿路绕行</strong><span>第 180 帧 · 3.75 s</span></button>
    <button type="button" data-demo-seek="8.333333" aria-pressed="false"><strong>终点回望</strong><span>第 400 帧 · 8.33 s</span></button>
  </div>
  <p class="wm-demo__status" data-demo-status role="status" aria-live="polite">可播放完整路线，或对照四个阶段的引擎与生成画面。</p>
  <p id="obstacle-demo-caption" class="wm-demo__caption">布局在视频 1.00 秒加载，角色约在 6.54 秒到达终点，实际移动约 13.21 米。引擎中三个紫色装置的数量与实体碰撞已验证；AI 将其表现为护盾或补给道具，但仍存在额外物体和外观漂移，不能将生成画面视为布局正确性的证据。</p>
  <p class="wm-demo__downloads"><a href="{{ '/assets/demos/staggered-obstacles/comparison.mp4' | relative_url }}">并排视频 MP4</a><a href="{{ '/assets/demos/staggered-obstacles/engine.mp4' | relative_url }}">引擎视频 MP4</a><a href="{{ '/assets/demos/staggered-obstacles/model.mp4' | relative_url }}">AI 视频 MP4</a></p>
</div>

## 参考与致谢

- [Matrix-Game 4.0: Harnessing Video Models for Real-Time Playable Game Worlds](https://arxiv.org/abs/2610.27999) · [官方代码与运行说明](https://github.com/SkyworkAI/Matrix-Game/tree/main/Matrix-Game-4)。
- [Code World Model: Coding Agent as World Brain](https://arxiv.org/abs/2608.25927) · [项目与演示](https://buaacyw.github.io/cwm/)。
- [Diffusion Models Are Real-Time Game Engines / GameNGen](https://gamengen.github.io/)。
- [Diffusion for World Modeling: Visual Details Matter in Atari / DIAMOND](https://diamond-wm.github.io/)。
- [Genie 2: A large-scale foundation world model](https://deepmind.google/blog/genie-2-a-large-scale-foundation-world-model/)。
- [Video generation models as world simulators](https://openai.com/index/video-generation-models-as-world-simulators/)。

<script src="{{ '/assets/js/code-world-models.js' | relative_url }}" defer></script>
