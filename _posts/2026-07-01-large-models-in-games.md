---
title: "Applications of Large Models in Games"
date: 2026-07-01
permalink: /blog/large-models-in-games/
excerpt: "Large models are moving into games as vision-action agents, hierarchical planners, companions, NPCs, production copilots, and dynamic content generators."
categories:
  - research-blog
tags:
  - Game AI
  - Multimodal Agents
  - Large Language Models
  - Generative AI
header:
  teaser: "大模型在游戏中的应用英文.png"
---

![Applications of Large Models in Games](/images/大模型在游戏中的应用英文.png)

Large models are reshaping games along two broad directions. The first is integrating large models into existing games, enabling agents or characters to understand, decide, accompany, and act within game environments. The second is using large models to generate games, either during development or dynamically while players are playing. In short, the former focuses on how AI understands and participates in games, while the latter focuses on how AI helps create games.

## Integrating AI into Existing Games

Within existing games, one important direction is end-to-end game VLA or vision-action agents. These systems aim to map visual observations, task instructions, and interaction history directly to game actions. Lumine AI and NitroGen belong more naturally to this category. Lumine targets 3D open-world games and uses a vision-language model to unify perception, reasoning, and action, generating keyboard-and-mouse controls from raw pixels and invoking reasoning when needed. NitroGen is trained through large-scale supervised behavior cloning on public gameplay videos paired with actions, aiming to build a vision-action foundation model that generalizes across many games.

This direction has the advantage of a short control loop and stronger real-time potential, especially for action, exploration, and open-world control. However, it still faces challenges in long-horizon planning, explicit memory, complex puzzle solving, and failure recovery.

## Hierarchical Game Agents

A different direction is hierarchical game agents. These systems usually assign high-level task understanding, goal decomposition, strategic planning, and reflection to VLMs or LLMs, while low-level policies, behavior trees, reinforcement learning agents, or rule-based controllers handle real-time execution. This architecture resembles "slow thinking plus fast acting": the large model does not need to control every frame, but instead makes decisions at key moments, such as choosing the next objective, interpreting task state, planning a route, or recovering from failure.

Hierarchical agents are better suited for long-horizon tasks, puzzle solving, open-world exploration, and complex interactions, but they also introduce system-level challenges such as asynchronous inference, state synchronization, error propagation, and latency control.

## Companions, Teammates, and NPCs

Companion agents, AI teammates, and intelligent NPCs form another application category that is closer to product deployment. These systems usually do not require high-frequency low-level control. Instead, they need to understand the game scene, player intent, narrative context, and character identity. An AI companion can act as a quest assistant, tactical coach, story character, or voice-based partner.

Compared with competitive control agents, this category has lower real-time pressure, but higher requirements for scene understanding, long-term memory, role consistency, and safety boundaries. In many commercial games, making large models understand the game world and interact with players may be more practical than asking them to directly play the game.

## AI-Generated Games

The second broad direction is AI-generated games. During game development, large models can already participate deeply in content production, including concept design, narrative writing, level drafts, quest design, asset generation, coding assistance, automated testing, localization, and balance analysis. In this stage, large models function more like production copilots for game teams, helping designers, artists, engineers, and QA teams generate ideas, validate concepts, and iterate faster.

This direction is relatively mature, but it does not mean large models can fully replace game development. Commercial games still require consistent style, explicit rules, controllable experiences, copyright clarity, and engineering maintainability.

## Runtime Dynamic Generation

A more futuristic direction is dynamic generation during gameplay. Future games may generate personalized quests, NPC reactions, story branches, scene changes, or even local level structures based on the player's behavior, preferences, and history. A more radical path is world-model-based or neural game engines, where models directly generate interactive worlds.

However, this direction is still at an early stage and faces major challenges in long-term consistency, physical rule stability, controllability, compute cost, designer editability, and testing. In the near term, the more realistic form is likely to be "traditional game engines plus local generative content," rather than entire game worlds generated in real time by neural networks.

## Hybrid Game Intelligence

Overall, the role of large models in games is expanding from content-generation tools to game-understanding and interaction systems. End-to-end VLAs are promising for real-time control and cross-game generalization; hierarchical agents are better suited for long-horizon reasoning and complex tasks; companions and NPCs are closer to commercial interaction experiences; and AI-generated games may reshape both game production and personalized gameplay.

The most valuable future systems are unlikely to rely on a single large model doing everything. Instead, they will likely be hybrid game intelligence systems composed of large models, lightweight policies, game engines, memory modules, and generative content systems.

## References

- [Lumine: An Open Recipe for Building Generalist Agents in 3D Open Worlds](https://arxiv.org/abs/2511.08892)
- [NitroGen: An Open Foundation Model for Generalist Gaming Agents](https://arxiv.org/abs/2601.02427)
