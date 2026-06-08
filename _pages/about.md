---
permalink: /
title: ""
excerpt: "Jianxiong Shen"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

<div class="home-intro">
  <p class="home-kicker">Computer Vision · 3D Representation · Reinforcement Learning</p>
  <h1>Jianxiong Shen</h1>
  <p class="home-lead">
    I am a Research Scientist at Tencent in Shenzhen. My work spans
    <strong>3D scene representation</strong>, <strong>uncertainty-aware vision</strong>, <strong>Game Agents</strong>
    and <strong>RL for multimodal models</strong>.
  </p>
  <p>
    I received my Ph.D. from the
    <a href="https://www.upc.edu/en">Polytechnic University of Catalonia (UPC)</a>
    in 2024, advised by
    <a href="https://www.iri.upc.edu/people/fmoreno/">Francesc Moreno-Noguer</a>
    and <a href="https://scholar.google.es/citations?user=h5cFva0AAAAJ&hl=en">Adria Ruiz</a>.
    Before that, I received my B.Eng. and M.Eng. degrees from
    <a href="http://studyathit.hit.edu.cn/">Harbin Institute of Technology</a>.
  </p>
  <div class="home-actions">
    <a class="home-button home-button--primary" href="#publications">Selected work</a>
    <a class="home-button" href="https://scholar.google.com/citations?hl=en&user=2L7sQVQAAAAJ">Google Scholar</a>
    <a class="home-button" href="https://github.com/poetrywanderer">GitHub</a>
  </div>
</div>

<section class="home-section" id="publications">
  <div class="section-heading">
    <span>Publications</span>
    <h2>Selected first-author work</h2>
    <p>Four projects tracing a path from reliable 3D reconstruction to efficient neural rendering.</p>
  </div>

  <div class="publication-list">
    <article class="publication-card">
      <div class="publication-card__media">
        <img src="/images/2025-LOD-GS.png" alt="LOD-GS levels-of-detail teaser">
      </div>
      <div class="publication-card__body">
        <div class="publication-card__meta"><span>CVPR 2025</span><span>3D Gaussian Splatting</span></div>
        <h3>LOD-GS: Achieving Levels of Detail using Scalable Gaussian Soup</h3>
        <p class="publication-card__authors"><strong>Jianxiong Shen</strong>, Yue Qian, Xiaohang Zhan</p>
        <p>Structures Gaussians with scalable triangle primitives to maintain high rendering quality across progressively smaller memory budgets.</p>
        <div class="publication-card__links">
          <a href="https://openaccess.thecvf.com/content/CVPR2025/html/Shen_LOD-GS_Achieving_Levels_of_Detail_using_Scalable_Gaussian_Soup_CVPR_2025_paper.html">Paper</a>
          <a href="https://doi.org/10.1109/CVPR52734.2025.00071">DOI</a>
        </div>
      </div>
    </article>

    <article class="publication-card">
      <div class="publication-card__media">
        <img src="/images/2024-ICRA.png" alt="Estimating 3D Uncertainty Field teaser">
      </div>
      <div class="publication-card__body">
        <div class="publication-card__meta"><span>ICRA 2024</span><span>Uncertainty</span></div>
        <h3>Estimating 3D Uncertainty Field: Quantifying Uncertainty for Neural Radiance Fields</h3>
        <p class="publication-card__authors"><strong>Jianxiong Shen</strong>, Ruijie Ren, Adria Ruiz, Francesc Moreno-Noguer</p>
        <p>Models spatial uncertainty beyond individual rendered views, producing a queryable 3D uncertainty field for neural scenes.</p>
        <div class="publication-card__links">
          <a href="https://arxiv.org/abs/2311.01815">Paper</a>
        </div>
      </div>
    </article>

    <article class="publication-card">
      <div class="publication-card__media">
        <img src="/images/2022-CF-NeRF.png" alt="Conditional-Flow NeRF teaser">
      </div>
      <div class="publication-card__body">
        <div class="publication-card__meta"><span>ECCV 2022</span><span>NeRF</span></div>
        <h3>Conditional-Flow NeRF: Accurate 3D Modelling with Reliable Uncertainty Estimation</h3>
        <p class="publication-card__authors"><strong>Jianxiong Shen</strong>, Antonio Agudo, Francesc Moreno-Noguer, Adria Ruiz</p>
        <p>Uses conditional normalizing flows to improve both reconstruction accuracy and calibrated uncertainty estimation in NeRF.</p>
        <div class="publication-card__links">
          <a href="https://poetrywanderer.github.io/CF-NeRF/">Project</a>
          <a href="https://arxiv.org/abs/2203.10192">Paper</a>
          <a href="https://github.com/poetrywanderer/CF-NeRF">Code</a>
          <a href="/files/Spotlight_CF-NeRF.pptx">Slides</a>
        </div>
      </div>
    </article>

    <article class="publication-card">
      <div class="publication-card__media">
        <img src="/images/2021-S-NeRF.png" alt="Stochastic Neural Radiance Fields teaser">
      </div>
      <div class="publication-card__body">
        <div class="publication-card__meta"><span>3DV 2021</span><span>Neural Rendering</span></div>
        <h3>Stochastic Neural Radiance Fields: Quantifying Uncertainty in Implicit 3D Representations</h3>
        <p class="publication-card__authors"><strong>Jianxiong Shen</strong>, Adria Ruiz, Antonio Agudo, Francesc Moreno-Noguer</p>
        <p>Introduces stochastic radiance fields for estimating predictive uncertainty in implicit 3D scene representations.</p>
        <div class="publication-card__links">
          <a href="https://arxiv.org/abs/2109.02123">Paper</a>
          <a href="/files/3DV-Poster-159.pptx">Poster</a>
        </div>
      </div>
    </article>
  </div>
</section>

<section class="home-section" id="projects">
  <div class="section-heading">
    <span>Projects</span>
    <h2>Recent research explorations</h2>
    <p>Independent, experiment-driven studies of post-training across model families. These are research projects rather than peer-reviewed publications.</p>
  </div>

  <div class="project-grid">
    <article class="project-card">
      <img src="/images/projects/multimodal-post-training.png" alt="Multimodal post-training experiment curves">
      <div class="project-card__content">
        <span class="project-card__tag">Vision-Language Models</span>
        <h3>On-Policy Distillation + GRPO for Geometric Reasoning</h3>
        <p>Compared sparse sequence rewards with dense teacher feedback on Qwen2.5-VL-7B, then combined both stages to improve Geometry3K accuracy from 37.8% to 54.2%.</p>
        <a href="https://github.com/poetrywanderer/RL-Projects/tree/main/Geo3K-VL-OPD">View project <span aria-hidden="true">→</span></a>
      </div>
    </article>

    <article class="project-card">
      <img src="/images/projects/diffusion-rl.png" alt="Diffusion RL OCR reward examples">
      <div class="project-card__content">
        <span class="project-card__tag">Diffusion Models</span>
        <h3>Reward Hacking or Forgetting?</h3>
        <p>Studied scene collapse under verifiable OCR reward fine-tuning, separating the observed failure from simple catastrophic-forgetting explanations.</p>
        <a href="https://github.com/poetrywanderer/Diffusion-RL">View project <span aria-hidden="true">→</span></a>
      </div>
    </article>

    <article class="project-card">
      <img src="/images/projects/text-rl.png" alt="Text reasoning RL training curves">
      <div class="project-card__content">
        <span class="project-card__tag">Language Models</span>
        <h3>R1-Zero Style Reasoning and Transfer</h3>
        <p>Reproduced emergent GRPO reasoning at 3B scale and measured where the learned search behavior transfers, including both positive and negative results.</p>
        <a href="https://github.com/poetrywanderer/RL-Projects/tree/main/R1-RL">View project <span aria-hidden="true">→</span></a>
      </div>
    </article>
  </div>
</section>

<section class="home-section" id="experience">
  <div class="section-heading">
    <span>Background</span>
    <h2>Experience &amp; education</h2>
  </div>
  <div class="timeline">
    <article class="timeline__item">
      <div class="timeline__date">2024 — Present</div>
      <div>
        <h3>Research Scientist · Tencent</h3>
        <p>Game reinforcement learning, multimodal agents, and post-training research.</p>
      </div>
    </article>
    <article class="timeline__item">
      <div class="timeline__date">2019 — 2024</div>
      <div>
        <h3>Ph.D. · Polytechnic University of Catalonia</h3>
        <p>Computer vision and 3D scene modelling at the Institut de Robòtica i Informàtica Industrial. Thesis awarded Excellent Cum Laude.</p>
      </div>
    </article>
    <article class="timeline__item">
      <div class="timeline__date">2013 — 2019</div>
      <div>
        <h3>B.Eng. &amp; M.Eng. · Harbin Institute of Technology</h3>
        <p>Engineering education and early research in computer vision.</p>
      </div>
    </article>
  </div>
</section>

<section class="home-section" id="news">
  <div class="section-heading">
    <span>Updates</span>
    <h2>Recent news</h2>
  </div>
  <div class="news-list">
    <div class="news-item"><time>2026.06</time><p>Released a short empirical note on scene collapse under OCR-reward diffusion RL.</p></div>
    <div class="news-item"><time>2025.06</time><p><strong>LOD-GS</strong> was published at CVPR 2025.</p></div>
    <div class="news-item"><time>2024.08</time><p>Joined Tencent as a Research Scientist.</p></div>
    <div class="news-item"><time>2024.07</time><p>Completed my Ph.D. with Excellent Cum Laude.</p></div>
    <div class="news-item"><time>2024.05</time><p>Presented our work on 3D uncertainty fields at ICRA 2024.</p></div>
  </div>
</section>
