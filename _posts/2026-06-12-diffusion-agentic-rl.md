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

## 图像 Agentic RL：先区分什么是真正的闭环

Flow-GRPO 和 DiffusionNFT 优化的是生成器内部的一次采样。图像 Agentic RL 优化的是生成器外部的决策过程：

$$
s_t=(p_{\mathrm{user}},I_t,h_t),\qquad
a_t\sim\pi_\phi(a\mid s_t),\qquad
I_{t+1}=E(I_t,a_t).
$$

这里至少包含三个容易混淆的层级：

1. **Training-free agentic workflow**：模型会评价、重写和重试，但策略没有通过环境反馈训练。GenArtist、T2I-Copilot、CRAFT 和 ImAgent 属于这一层，是重要基线而不是 Agentic RL。
2. **Component-level RL**：系统看起来是多智能体，但 RL 只训练其中一个静态组件。例如 ImageEdit-R1 主要强化指令分解，Agentic Retoucher 主要强化缺陷诊断。
3. **Closed-loop environment RL**：控制器执行动作、观察新图像，再决定下一步，并用真实环境结果更新策略。MIRA、GenAgent、Generation Navigator 和 VisionCreator-R1 更接近这一严格定义。

Gen-Searcher 是一个特殊分支：它在搜索环境中进行长程交互，最终才调用生成器。因此它是 agentic RL，但主要学习的是生成前的知识获取策略，而不是生成后的视觉自修正。

![图像 Agentic RL 方法分类](/images/projects/image-agentic-rl-taxonomy.svg)

| 方法族 | 典型动作 | RL 信号落点 | 主要优势 | 核心局限 |
|---|---|---|---|---|
| Search-grounded generation | 搜索、浏览、选择参考图 | 最终 grounded prompt + 最终图像 | 补足外部知识和实时信息 | 生成后通常不再纠错 |
| Full-generation reflection | prompt 重写、重新生成、停止 | 最终结果 + 相邻图像偏好 | 后端可替换，容易扩展 | 粗粒度、采样昂贵 |
| State-conditioned steering | STOP / REFINE / REGENERATE | peak、retention、turn cost | 显式权衡修补、重来和停止 | 仍依赖轨迹级标量 |
| Atomic semantic editing | 单个自然语言编辑指令 | 同状态候选动作的 step reward | 局部信用较清楚 | 缺少长期约束账本 |
| Reflection–plan learning | 计划、工具调用、反思 | plan / reflection / tool / result | 揭示不同能力的优化难度 | reflection 仍受生成噪声支配 |
| Localized repair | 定位、诊断、mask inpainting | 缺陷分类和文本对齐 | 空间可解释、保护正确区域 | RL 未端到端训练修复动作 |
| Structured decomposition | action / subject / goal | 分解集合匹配 | 复杂指令更可解释 | 环境反馈没有回到分解策略 |
| Parameterized tools | 连续或离散编辑参数 | 主观 reward 或工具边际效用 | 低成本、可撤销、可复现 | 语义生成能力有限 |

## 方法分类：策略究竟作用在哪里？

与逐篇介绍论文相比，更有用的分类方式是考察 Agent 的动作改变了生成链条的哪一部分。

### 生成前：知识搜索与视觉 grounding

Gen-Searcher 的动作空间包括 `search`、`image_search` 和 `browse`。控制器通过多轮检索收集事实与参考图，最后输出 grounded prompt 和选中的视觉参考。其 GRPO 奖励同时包含：

- **文本奖励**：搜索结果是否足够、正确并且适合指导生成；
- **图像奖励**：最终生成结果是否真正实现了这些信息。

只看图像会把生成器随机性错误归因给搜索策略；只看文本又可能得到内容丰富、但无法被生成器实现的 prompt。双奖励提高了稳定性，也让策略可以迁移到不同生成后端。

局限是 Agent 通常只生成一次，生成错误之后没有继续修正；文本奖励与图像奖励仍压缩成单个轨迹回报，无法定位哪次搜索真正有用。

### 生成级控制：重写、重生成、细化与停止

GenAgent 的循环是：

```text
reason → generate → judge → reflect → regenerate or stop
```

其冷启动数据由强模型借助评价规则和参考图蒸馏得到。RL 阶段采用两类奖励：

- 最终图像必须满足全部条件，得到严格 pointwise outcome reward；
- 相邻轮次的图像必须持续改善，得到 pairwise reflection reward。

它的优点是架构简单、生成后端可替换，并展示了跨工具泛化和交互轮数带来的 test-time scaling。缺点是动作基本仍是改写完整 prompt 后重新生成，缺少局部、可解释的修复；要求后续图像持续优于前一张，也会惩罚先破坏局部、再获得更好全局结果的非单调轨迹。

Generation Navigator 将动作显式离散为：

$$
\mathcal A=\{\text{STOP},\text{REFINE},\text{REGENERATE}\}.
$$

其中 `REFINE` 对当前图进行图生图修改，`REGENERATE` 从头生成，`STOP` 终止。它提出 PRE-GRPO：

$$
R(\tau)=
\underbrace{\max_t\rho_t}_{\text{Peak}}
+\alpha\underbrace{\rho_T}_{\text{Retention}}
-\beta\underbrace{\frac{T-1}{T_{\max}-1}}_{\text{Efficiency}}
+\gamma R_{\mathrm{format}}.
$$

Agent 找到好结果后继续破坏会被罚，无效多轮调用也会被罚。最终输出使用轨迹中 reviewer 得分最高的图，而不强制使用最后一张。

这是目前最直接面向状态相关动作选择和计算效率的工作。不过 PRE-GRPO 仍然给整条轨迹中的 token 共享一个标量 advantage；它能区分好轨迹与坏轨迹，但还不能精确回答某一步改善了哪项约束。系统也依赖单一 reviewer 的标量质量排序。

### 语义编辑：把复杂指令拆成原子动作

MIRA 在每一步观察当前图像，只输出一个 atomic edit。对同一状态采样多个候选指令，经外部编辑模型执行后，使用 EditScore 的语义一致性与感知质量组成 step reward：

$$
r_t^k=
\lambda_{\mathrm{sc}}r_{\mathrm{sc}}(I_t^k,I_{t-1},u_t^k)
+\lambda_{\mathrm{pq}}r_{\mathrm{pq}}(I_t^k,I_{t-1},u_t^k).
$$

这是一种真正的 state-level group comparison：候选动作共享同一当前图像，比完整轨迹奖励更接近局部信用分配。它还可以在后续观察中发现先前编辑产生的偏差，并追加纠正动作。

但 MIRA 的动作仍是自然语言编辑指令，不包含结构化目标约束或风险预测；reward 判断当前编辑是否好，却不显式记录哪些原始要求已经满足、哪些被后续编辑破坏。随着步数增加，性能也不一定持续提升。

ImageEdit-R1 同样采用分解思想，但 RL 主要作用于 decomposition agent：将请求解析为 action、subject 和 goal，并以集合匹配奖励训练。sequencing agent 再排列子请求，diffusion editor 最后执行。它提升了复杂指令理解的可解释性，但严格来说并没有根据每次真实编辑结果在线学习动作策略。论文自身也观察到，多轮逐项执行可能因为缺乏对中间视觉状态的全局感知而累积误差。

### 局部缺陷修复：先定位，再诊断和 inpaint

Agentic Retoucher 将流程拆成：

1. perception agent 根据图像和 prompt 预测 distortion saliency；
2. reasoning agent 输出缺陷类别、描述与区域；
3. action agent 选择 mask-guided 或 VLM-based inpainting；
4. 新图再次进入 perception agent。

空间显式 grounding 是它最大的优势：局部修补不会像完整重生成那样轻易破坏正确区域。但其 GRPO 主要用于让 reasoning agent 的缺陷分类和文本描述对齐人工标注，局部编辑动作本身并没有通过最终修复增益进行端到端优化。因此它更接近“强化过的诊断器 + 闭环工具流程”。

VisionCreator-R1 从另一个角度研究 reflection。它发现 planning reward 可以直接评价计划的逻辑和工具匹配，噪声较小；reflection reward 必须等待随机图像生成和后续工具执行，条件方差很大：

$$
\Sigma_{\mathrm{trajectory}}^{\mathrm{reflection}}
\gg
\Sigma_{\mathrm{action}}^{\mathrm{reflection}}.
$$

因此，直接在长程多图任务中用 GRPO 联合训练 planning 与 reflection，往往只能改善 planning，reflection 反而退化。RPCO 的解决方案是“先解耦、后融合”：先在低噪声单图任务上学强 reflection，再将其与强 planning 轨迹混合 SFT，最后进行多任务 RL。

这是很重要的负面结论：增加 reflection reward 并不等于 Agent 就能学会反思。不过 RPCO 更多依赖好的初始化来保存 reflection，尚未从根本上解决随机环境中的动作级反事实归因。

### 参数化专业工具：把动作空间变得可解释

RetouchIQ 和 IEA 让 MLLM 输出曝光、对比度、色温、饱和度等可执行参数。

RetouchIQ 面对开放审美目标，训练一个 generalist reward model：先针对当前指令生成评价维度，再给编辑结果打分。它还使用 policy-generated hard negatives 更新 reward model，减少奖励模型只会识别人工扰动、却无法判断真实策略错误的问题。

IEA 使用 16 个全局编辑工具，并提出很接近因果归因的 usefulness reward。对于工具集合 $T$ 中的某个工具 $t$，比较完整执行与删除该工具后的结果：

$$
U(t)=
L(E(I,T\setminus\{t\}),I_{\mathrm{ref}})
-L(E(I,T),I_{\mathrm{ref}}).
$$

如果删除工具导致结果变差，该工具才被认为真正有用。这比简单惩罚调用次数更有信息量。

这一类方法的优势是动作低维、可复现、可撤销，RL 的探索成本远低于 diffusion 重生成。局限是工具通常只处理全局色调，无法完成对象级语义生成；对参考图的像素距离或自训练 reward model 也可能偏离长期用户偏好。

## 奖励与信用分配的演进

| 奖励层级 | 代表机制 | 能学到什么 | 主要盲点 |
|---|---|---|---|
| 最终结果 | final image reward | 轨迹整体是否成功 | 所有动作共享信用 |
| 相邻比较 | consecutive pair preference | reflection 后是否改善 | 偏好单调轨迹 |
| 单步转移 | same-state action group | 当前动作是否有效 | 不记录长期约束退化 |
| 轨迹动态 | peak / retention / efficiency | 是否高效且避免回退 | 仍是轨迹级标量 |
| 能力分解 | plan / reflection / tool rewards | 哪类能力出了问题 | 子奖励仍可能受环境噪声污染 |
| 边际效用 | leave-one-tool-out | 某工具是否有因果贡献 | 执行成本随候选动作增长 |

目前最缺的不是再增加一个 VLM evaluator，而是把用户目标分解成可追踪约束，并为同一状态下的候选动作计算约束级反事实增量：

$$
\Delta c_{t,j}^{(k)}
=
c_j(E(s_t,a_t^{(k)}))-c_j(s_t).
$$

它需要同时回答：动作改善了哪项要求，是否破坏了已经满足的要求，相比其他动作是否稳定超过生成随机性，以及在相同调用预算下是否优于 Best-of-N。

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
| Training-free Agent | 否 | 否 | N |
| RL Generative Agent | 否 | 是 | N |
| RL Generator + RL Agent | 是 | 是 | N |

所有方法应使用相同 prompt 集、相同底层生成器，并报告最终任务成功率、总生成调用次数、GPU-seconds、工具错误率、跨工具泛化、自动评价与人工评价的一致性，以及每项约束首次满足、再次退化和最终保持的比例。

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

1. **约束级过程奖励**：如何评价一次编辑改善了哪项要求，而不把所有变化压成一个分数？
2. **反事实信用分配**：同一状态执行不同动作，如何分离动作质量和生成器随机性？
3. **成本约束**：怎样让 agent 在质量提升与调用成本之间主动权衡？
4. **跨工具泛化**：在训练时更换生成 backend，能否学到通用的工具能力模型？
5. **奖励可靠性**：怎样避免控制器和生成器共同利用 verifier 漏洞？
6. **反思的低信噪比**：能否超过 RPCO 的“先学好再保持”，直接降低 reflection action 的环境方差？
7. **联合训练稳定性**：同时更新 controller 与 generator 时，如何处理持续变化的环境动力学？

## 结语

Flow-GRPO 和 DiffusionNFT 说明，Flow Matching 模型可以通过在线反馈提高单次执行能力。图像 Agentic RL 的最新进展则表明，研究重点已经从“会不会多轮调用”转向“当前状态应该选什么动作、反思是否真的有用、找到好结果后能否保持，以及每轮计算是否值得”。

视觉生成 RL 的下一阶段可能不再只是“怎样给一条 denoising trajectory 分配奖励”，而是：

> 怎样训练一个系统，在有限计算预算内理解目标、选择工具、生成结果、发现错误并主动修正。

真正有潜力的组合不是 Flow-GRPO、DiffusionNFT 与 Agentic RL 三选一，而是以强化后的生成模型作为可靠执行器，再用交互式强化学习优化整个生成工作流。

本文的独立项目版本与后续更新见 [Diffusion-AgenticRL](https://github.com/poetrywanderer/Diffusion-AgenticRL)。

## 参考资料

1. Esser et al. [Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206), 2024.
2. Liu et al. [Flow-GRPO: Training Flow Matching Models via Online RL](https://arxiv.org/abs/2505.05470), 2025.
3. Zheng et al. [DiffusionNFT: Online Diffusion Reinforcement with Forward Process](https://arxiv.org/abs/2509.16117), ICLR 2026 Oral.
4. Wang et al. [GenArtist: Multimodal LLM as an Agent for Unified Image Generation and Editing](https://arxiv.org/abs/2407.05600), 2024.
5. Chen et al. [T2I-Copilot: A Training-Free Multi-Agent Text-to-Image System](https://arxiv.org/abs/2507.20536), 2025.
6. Zeng et al. [MIRA: Multimodal Iterative Reasoning Agent for Image Editing](https://arxiv.org/abs/2511.21087), 2025/2026.
7. Wang et al. [ImAgent: A Unified Multimodal Agent Framework for Test-Time Scalable Image Generation](https://arxiv.org/abs/2511.11483), 2025.
8. Kovalev et al. [CRAFT: Continuous Reasoning and Agentic Feedback Tuning](https://arxiv.org/abs/2512.20362), 2025.
9. Jiang et al. [GenAgent: Scaling Text-to-Image Generation via Agentic Multimodal Reasoning](https://arxiv.org/abs/2601.18543), 2026.
10. Shen et al. [Agentic Retoucher for Text-To-Image Generation](https://arxiv.org/abs/2601.02046), 2026.
11. Wu et al. [RetouchIQ: MLLM Agents for Instruction-Based Image Retouching with Generalist Reward](https://arxiv.org/abs/2602.17558), 2026.
12. Feng et al. [Gen-Searcher: Reinforcing Agentic Search for Image Generation](https://arxiv.org/abs/2603.28767), 2026.
13. Lai et al. [VisionCreator-R1: A Reflection-Enhanced Native Visual-Generation Agentic Model](https://arxiv.org/abs/2603.08812), 2026.
14. Zhao et al. [ImageEdit-R1: Boosting Multi-Agent Image Editing via Reinforcement Learning](https://arxiv.org/abs/2603.08059), 2026.
15. Liu et al. [Generation Navigator: A State-Aware Agentic Framework for Image Generation](https://arxiv.org/abs/2605.17969), 2026.
16. Zhu et al. [IEA: Amateur-Friendly Conversational Image Editing Agent](https://arxiv.org/abs/2606.08016), 2026.
17. Chen et al. [OpenSearch-VL: An Open Recipe for Frontier Multimodal Search Agents](https://arxiv.org/abs/2605.05185), 2026.
18. Liu et al. [Advances in GRPO for Generation Models: A Survey](https://arxiv.org/abs/2603.06623), 2026.
