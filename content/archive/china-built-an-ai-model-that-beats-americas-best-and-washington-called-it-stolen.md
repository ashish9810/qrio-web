---
title: >-
  China built an AI model that beats America's best and Washington called it
  stolen
category: tech
date: '2026-07-25T00:30:00.015Z'
description: >-
  On July 22, a senior White House official accused Chinese AI lab Moonshot AI
  of secretly distilling Anthropic's Fable model to build its new Kimi K3
  system, mar
brief: >-
  On July 22, a senior White House official accused Chinese AI lab Moonshot AI
  of secretly distilling Anthropic's Fable model to build its new Kimi K3
  system, marking the first time a named US official has publicly accused a
  specific Chinese lab of copying a specific American one. The twist: Kimi K3,
  at 2.8 trillion parameters the largest open-source AI model ever released,
  already ranks first on an independent coding benchmark, ahead of Fable 5
  itself, while costing roughly a third as much to run. If it really is a copy,
  it is a copy that now beats the original at its own game.
cover: >-
  /covers/china-built-an-ai-model-that-beats-americas-best-and-washington-called-it-stolen.webp
sources: []
---

*Washington says China stole its best AI model. The strange part is that the "stolen" version is winning some of the fights the original can't.*

**The accusation**

On Wednesday, July 22, Michael Kratsios, director of the White House Office of Science and Technology Policy, said publicly that the US government has evidence Chinese AI lab Moonshot AI secretly copied Anthropic's flagship model, Fable, to build its own system, Kimi K3. "We have information that Moonshot AI distilled Anthropic's Fable for the development of its K3 model," Kratsios said, describing a "sophisticated internal platform to conduct large-scale distillation against U.S. models, allowing them to quickly switch between multiple methods of access to avoid detection." He drew a distinction between routine industry practice and what he alleged Moonshot did: "Legitimate AI distillation used to create smaller, more efficient models plays a vital role in this open innovation ecosystem. However, large-scale, covert industrial distillation aimed at stealing proprietary U.S. technology and undermining American research is unacceptable." It is the first time a senior US official has named a specific Chinese company for copying a specific American model, rather than speaking about the practice in general terms. Kratsios separately claimed Moonshot had "acquired GB300-equipped servers and has accessed GB300s in Thailand, likely to train its AI models," referring to Nvidia's advanced chips that are restricted from sale to China. He offered no public evidence for either claim.

**What "distillation" actually means**

Model distillation is a real and mostly legal technique in AI research, where a smaller "student" model learns by studying the outputs of a larger "teacher" model, essentially learning to mimic its reasoning patterns rather than being trained from scratch on raw data. It is roughly the AI equivalent of a student learning to solve problems by studying a genius's worked solutions instead of textbooks, faster and cheaper, but only possible because the genius did the hard work first. Anthropic first raised this exact accusation in February, alleging that Moonshot, along with rivals MiniMax and DeepSeek, ran millions of automated queries against Fable through disguised accounts specifically to extract its reasoning, coding and tool-use abilities.

```stats
2.8 trillion | Parameters in Kimi K3, the largest open-source model released
3.4 million | Claude exchanges Anthropic says Moonshot generated via fake accounts
1st time | A US official accused a specific Chinese lab by name
```

**The part that undercuts the accusation**

Here is what most coverage of this story skips. If Kimi K3 really is a distilled copy of Anthropic's Fable, it is an oddly capable one. On the independent Frontend Code Arena benchmark, which measures how well AI models write working front-end code, Kimi K3 ranks first with an Elo score of 1,679, ahead of Fable 5 itself at 1,631, OpenAI's GPT-5.6 Sol at 1,618, and rival Chinese model GLM-5.2 at 1,587. On a separate benchmark called SWE Marathon, which tests sustained software engineering tasks, K3 scores 42.0, ahead of Anthropic's own Opus 4.8 at 40.0. And it does this while costing a fraction of the price: $3 per million input tokens and $15 per million output tokens, compared with $10 and $50 for Fable 5. Averaged across a nine-benchmark suite, a single task costs about $0.94 on K3 versus $1.80 on Opus 4.8.

```bars
Frontend Code Arena rankings
Elo score, independent benchmark, July 2026
Kimi K3 | 1679 | 1,679
Fable 5 | 1631 | 1,631
GPT-5.6 Sol | 1618 | 1,618
GLM-5.2 | 1587 | 1,587
Source: Frontend Code Arena leaderboard
```

**Beijing's response**

Moonshot AI itself has offered no public comment. A spokesperson for the Chinese embassy in Washington called the accusation "entirely unfounded," urging the US to "respect the facts, discard prejudice and stop smearing" China's AI achievements. Kimi K3 was released publicly on July 16, with the company promising full open-source weights, the underlying files that let anyone run and modify the model, by July 27.

> "Legitimate AI distillation used to create smaller, more efficient models plays a vital role in this open innovation ecosystem. However, large-scale, covert industrial distillation aimed at stealing proprietary U.S. technology and undermining American research is unacceptable."
> Michael Kratsios, Director, White House Office of Science and Technology Policy

**The honest catch**

Kratsios did not release the underlying evidence for either the distillation claim or the Nvidia chip claim, and independent researchers cannot verify either allegation from the outside. It is entirely possible both things are true at once: that Moonshot did use disguised access to study Fable's outputs, and that its own engineers then built something genuinely competitive on top of what they learned. Distillation, even the unauthorized kind, still requires real engineering to turn into a working, efficient, cheaply-priced model that ordinary developers want to use.

> Whether Kimi K3 is a copy or not, it is currently beating the thing it was allegedly copied from, and that should worry Washington more than the theft accusation itself.
