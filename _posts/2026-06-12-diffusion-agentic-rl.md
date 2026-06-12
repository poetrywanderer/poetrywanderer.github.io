---
title: "从 Flow-GRPO 到生成式智能体：视觉生成强化学习正在走向闭环交互"
date: 2026-06-12
permalink: /blog/diffusion-agentic-rl/
excerpt: "从 Flow Matching、Flow-GRPO 与 DiffusionNFT 出发，讨论视觉生成强化学习如何从优化单次采样轨迹走向多轮环境交互。"
categories:
  - research-blog
tags:
  - Diffusion Models
  - Flow Matching
  - Reinforcement Learning
  - Multimodal Agents
---

过去两年，视觉生成强化学习出现了两条逐渐汇合的路线。

第一条路线直接优化生成模型。Flow-GRPO 将 Flow Matching 的采样过程写成多步决策问题，并利用在线强化学习改善组合生成、文字渲染和人类偏好；DiffusionNFT 则绕开反向轨迹似然，在前向 Flow Matching 目标中对高奖励与低奖励样本进行对比学习。

第二条路线不修改，或不只修改生成器，而是在生成器外增加一个多模态智能体。智能体能够观察当前图像、诊断错误、调用生成或编辑工具，并根据新结果继续行动。MIRA 和 GenAgent 表明，图像生成正在从“一次提示、一次采样”转向“观察、生成、评价、修正、停止”的闭环过程。

这两条路线解决的不是同一个问题：前者提高单次调用的能力，后者优化多次调用之间的决策。下一阶段更值得研究的方向，很可能是强化后的生成器与强化后的控制器共同组成的分层系统。

## Flow Matching 是否已经取代 Diffusion？

没有完全取代，但它已经成为新一代高性能生成模型的重要主流。

传统 diffusion 通常学习噪声或 score，并通过反向随机过程逐步去噪。Flow Matching 学习随时间变化的速度场，通过 ODE 将噪声分布运输到数据分布。Rectified Flow 进一步尝试让运输路径更接近直线，从而以较少采样步数获得高质量结果。

Stable Diffusion 3/3.5 使用 Rectified Flow Transformer 和 MMDiT；FLUX.1、SANA 等近期模型也采用 Flow Matching 或相关形式。与此同时，SDXL 等传统 diffusion、autoregressive image model、masked model 和 normalizing flow 仍然存在。

> Flow Matching 正在成为大规模 DiT 图像和视频模型的主流训练范式之一，而不是所有视觉生成模型的唯一范式。

很多论文仍宽泛地使用 “diffusion model” 指代迭代式连续生成模型，即使其具体训练目标已经是 Flow Matching 或 Rectified Flow。

## 单轮生成强化学习发展到了哪里？

### Flow-GRPO：把采样轨迹视为策略轨迹

Flow-GRPO 将 Flow Matching 的去噪过程表示为 MDP：

- 状态是当前 latent；
- 动作是模型预测的下一步更新；
- 同一 prompt 采样一组图像；
- 最终图像奖励经过组内归一化，形成 relative advantage；
- 使用策略梯度更新生成模型。

Flow Matching 的 ODE 采样通常是确定性的。为了获得在线 RL 所需的探索与可计算概率，Flow-GRPO 将 ODE 转换为具有相同边缘分布的 SDE。此外，它在训练采样时减少 denoising steps，以降低在线数据采集成本。

在 SD3.5-Medium 上，论文报告了以下结果：

| 任务 | 基础模型 | Flow-GRPO |
|---|---:|---:|
| GenEval | 0.63 | 0.95 |
| 文字渲染准确率 | 0.59 | 0.92 |
| PickScore 优化任务 | 21.72 | 23.31 |

这些结果说明 RL 可以明显改善可验证能力。但论文也展示了一个同样重要的现象：不使用 KL 约束时，目标奖励虽然上升，DrawBench 上的质量和多样性可能明显下降。生成 RL 的核心问题因此不只是“奖励能否提高”，还包括是否发生 reward hacking。

### DiffusionNFT：在前向过程中利用正负样本

DiffusionNFT，即 Diffusion Negative-aware FineTuning，不直接估计反向采样轨迹的 likelihood。它在线生成候选图像，根据奖励区分正样本与负样本，再将策略改进写回 Flow Matching 的监督目标：

- 提高高奖励生成结果的学习权重；
- 显式抑制低奖励结果；
- 不要求保存完整反向采样轨迹；
- 支持不同 black-box solver；
- 可以在不使用 CFG 的条件下训练。

论文报告 CFG-free SD3.5-Medium 的 GenEval 从 0.24 提升至 0.98，并称其在直接比较中最高可达到 Flow-GRPO 约 25 倍的训练效率。需要注意，0.24 是不使用 CFG 的基础模型结果，而 Flow-GRPO 常用的 0.63 基线使用了 CFG，两者不能脱离设置直接比较。

DiffusionNFT 提出了一个更广泛的问题：

> 生成模型的在线强化是否一定需要把每个 denoising step 都当作 policy action？

如果最终图像及其奖励已经包含足够的学习信号，正负样本驱动的前向目标可能比完整轨迹策略梯度更简单、更高效。

## 当前方法究竟在比较什么？

视觉生成没有一个能够概括所有能力的单一指标。当前评测大致分为五组：

| 评测维度 | 常见指标或基准 | 主要测量内容 |
|---|---|---|
| 组合生成 | GenEval、GenEval++、T2I-CompBench++ | 数量、颜色、空间关系、属性绑定 |
| 文字渲染 | OCR accuracy、edit distance | 指定文字是否正确出现 |
| 图文一致性 | CLIPScore、ImageReward | 图像与 prompt 的语义匹配 |
| 人类偏好 | PickScore、HPSv2.1、UnifiedReward | 综合质量、审美与偏好 |
| 质量与多样性 | FID、Aesthetic、DeQA、LPIPS | 视觉质量、分布覆盖和样本差异 |

一个可信的生成 RL 实验至少应该同时回答三个问题：

1. 被直接优化的目标奖励提高了多少？
2. 没有参与训练的指标是否同步提高或至少没有下降？
3. 模型是否泛化到不同 prompt、对象类别和 benchmark？

只报告 reward curve 已经不够。奖励模型本身可能存在偏差，模型也可能学会产生迎合 evaluator、但不符合人类判断的图像。

## 从单轮生成 RL 到 Agentic RL

Flow-GRPO 和 DiffusionNFT 优化的是生成器内部的一次采样。Agentic RL 优化的是生成器外部的多轮决策：

```text
用户目标
   ↓
多模态控制器观察当前图像
   ↓
选择生成 / 编辑 / 检测 / OCR / 分割等工具
   ↓
环境返回新图像和工具结果
   ↓
评价、反思、继续修正或停止
```

MIRA 使用轻量多模态模型逐步预测 atomic edit，并在每次编辑后重新观察结果。GenAgent 则把 FLUX.1-dev 作为可调用工具，通过生成、判断和反思的多轮轨迹进行 agentic RL。GenAgent 报告其相对基础生成器在 GenEval++ 上提升 23.6%，在 WISE 上提升 14%，并观察到随交互轮数增加的 test-time scaling。

这类系统的关键变化是：错误不再只能通过更新模型参数修复，也可以在推理期间通过下一次行动修复。

## Agentic RL 的上限是否更高？

从策略空间看，是的。

令单轮生成策略为：

$$
I \sim G_\theta(p), \qquad J_{\mathrm{single}}=\mathbb{E}[R(I)].
$$

交互式策略则在每轮观察状态并选择动作：

$$
a_t\sim\pi_\phi(o_t),\qquad
I_{t+1}=E(I_t,a_t),\qquad
J_{\mathrm{agent}}=\mathbb{E}[R(I_T)].
$$

如果交互式策略可以在第一轮后直接停止，那么单轮策略是它的一个特例。在不考虑成本、环境可靠且训练充分的理想条件下：

$$
J_{\mathrm{agent}}^\star \ge J_{\mathrm{single}}^\star.
$$

但实际系统必须把成本写入目标：

$$
J =
R(I_T)
-\lambda_1 N_{\mathrm{generation}}
-\lambda_2 T_{\mathrm{GPU}}
-\lambda_3 N_{\mathrm{tool\ error}}.
$$

多轮 agent 可能为一张最终图像调用生成器数次，而强化后的单轮模型只调用一次。因此，“Agentic RL 上限更高”不等于“它在相同算力下已经更好”。目前相关论文使用的模型、benchmark、调用次数和奖励不同，还缺少严格的 head-to-head comparison。

## 应该怎样公平比较？

一个基础实验矩阵可以是：

| 系统 | 生成器强化 | 控制器强化 | 最大生成调用次数 |
|---|---:|---:|---:|
| Base Generator | 否 | 否 | 1 |
| Best-of-N | 否 | 否 | N |
| Flow-GRPO / DiffusionNFT | 是 | 否 | 1 |
| Generative Agent | 否 | 是 | N |
| RL Generator + RL Agent | 是 | 是 | N |

所有方法应使用相同 prompt 集、相同底层生成器，并报告最终任务成功率、总生成调用次数、GPU-seconds、工具错误率、跨工具泛化，以及自动评价与人工评价的一致性。

最重要的图可能不是单一排行榜，而是：

$$
\text{Final Quality}\quad \text{vs.}\quad \text{Total Generation FLOPs}.
$$

只有这样才能判断 agent 是在学习有效修正，还是仅仅通过更多采样获得提升。

## 一个可能的统一视角

单轮生成 RL 和 Agentic RL 可以被理解成两个时间尺度：

- **内部时间尺度**：生成器在 latent trajectory 中逐步产生一张图；
- **外部时间尺度**：控制器在 environment trajectory 中逐步调用生成、编辑和感知工具。

由此形成一个分层策略：

$$
\pi_{\mathrm{agent}}(a_t\mid o_t)
\quad+\quad
\pi_{\mathrm{generator}}(x_{k+1}\mid x_k,p_t).
$$

Flow-GRPO 或 DiffusionNFT 改善底层生成策略，使每次工具调用更可靠；Agentic RL 改善高层决策，使系统知道何时重新生成、局部编辑、切换工具以及停止。二者是互补关系，而不是只能选择其一。

## 开放问题

1. **过程奖励**：如何评价一次编辑是否真正缩小了目标差距，而不只评价最终图像？
2. **信用分配**：失败来自错误规划、工具选择、prompt、mask，还是生成器随机性？
3. **成本约束**：怎样让 agent 在质量提升与调用成本之间主动权衡？
4. **跨工具泛化**：在训练时更换生成 backend，能否学到通用的工具能力模型？
5. **奖励可靠性**：怎样避免控制器和生成器共同利用 verifier 漏洞？
6. **联合训练稳定性**：同时更新 controller 与 generator 时，如何处理持续变化的环境动力学？

## 结语

Flow-GRPO 和 DiffusionNFT 说明，Flow Matching 模型可以通过在线反馈显著提高组合生成、文字渲染和偏好对齐能力。MIRA 与 GenAgent 则进一步说明，生成器可以成为环境中的工具，由一个多模态控制器通过观察和反思进行多轮修正。

视觉生成 RL 的下一阶段可能不再只是“怎样给一条 denoising trajectory 分配奖励”，而是：

> 怎样训练一个系统，在有限计算预算内理解目标、选择工具、生成结果、发现错误并主动修正。

真正有潜力的组合不是 Flow-GRPO、DiffusionNFT 与 Agentic RL 三选一，而是以强化后的生成模型作为可靠执行器，再用交互式强化学习优化整个生成工作流。

本文的独立项目版本与后续更新见 [Diffusion-AgenticRL](https://github.com/poetrywanderer/Diffusion-AgenticRL)。

## 参考资料

1. Esser et al. [Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206), 2024.
2. Liu et al. [Flow-GRPO: Training Flow Matching Models via Online RL](https://arxiv.org/abs/2505.05470), 2025.
3. Zheng et al. [DiffusionNFT: Online Diffusion Reinforcement with Forward Process](https://arxiv.org/abs/2509.16117), ICLR 2026 Oral.
4. Zeng et al. [MIRA: Multimodal Iterative Reasoning Agent for Image Editing](https://arxiv.org/abs/2511.21087), 2025/2026.
5. Jiang et al. [GenAgent: Scaling Text-to-Image Generation via Agentic Multimodal Reasoning](https://arxiv.org/abs/2601.18543), 2026.
6. Chen et al. [OpenSearch-VL: An Open Recipe for Frontier Multimodal Search Agents](https://arxiv.org/abs/2605.05185), 2026.
7. Liu et al. [Advances in GRPO for Generation Models: A Survey](https://arxiv.org/abs/2603.06623), 2026.
