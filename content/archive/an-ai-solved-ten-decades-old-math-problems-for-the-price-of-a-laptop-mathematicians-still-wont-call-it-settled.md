---
title: >-
  An AI solved ten decades old math problems for the price of a laptop.
  Mathematicians still won't call it settled
category: tech
date: '2026-08-22T19:24:57.579Z'
description: >-
  OpenAI said on August 1, 2026 that an internal version of its next model,
  Astra, produced verified solutions to ten long unsolved problems in
  mathematics and co
brief: >-
  OpenAI said on August 1, 2026 that an internal version of its next model,
  Astra, produced verified solutions to ten long unsolved problems in
  mathematics and computer science, some open for decades, for roughly $2,000 in
  compute. The proofs were checked by Lean, software that rejects any logical
  step that doesn't follow, and researchers found zero unproven gaps. Yet
  mathematicians who track this space call it far from settled: none of the
  results have been peer reviewed, and a June 2026 declaration signed by over
  1,800 mathematicians warns AI-generated proofs threaten how the field verifies
  and credits its own work.
cover: >-
  /covers/an-ai-solved-ten-decades-old-math-problems-for-the-price-of-a-laptop-mathematicians-still-wont-call-it-settled.webp
sources: []
---

*A machine solved math problems that had defeated humans for decades, for less than the cost of a laptop. The hardest part turned out to be getting mathematicians to agree on what that actually proves.*

On August 1, 2026, OpenAI published a 249 page manuscript describing how an internal version of Astra, described as its "next major model," produced solutions to **ten problems** in mathematics and theoretical computer science that had seen no progress for at least a decade, and in some cases nearly thirty years. The headline result resolved a question about "non-sofic groups" open since 1999, essentially building the first mathematical symmetry structure proven impossible to imitate with any finite approximation. Astra also disproved a conjecture by mathematician Alain Connes, proved a separate volume conjecture by Eugène Ehrhart, and solved three problems from a running list of open questions associated with the mathematician Paul Erdős, spanning Ramsey theory, sphere packing, quantum complexity and lattice cryptography.

**The number that made this different from OpenAI's last claim**

OpenAI put the total compute cost for all ten solutions at roughly **$2,000**, using its GPT-5.6 Sol model's API rates, a strikingly small figure for results the field had failed to produce for decades using the normal tools of human mathematics. Every proof was formalized in Lean, a proof assistant that checks each logical step and rejects the entire argument if even one step doesn't follow from the last. Researchers reported that none of the formalized proofs contain any unproven gaps, a binary, mechanical form of verification that, in principle, removes the need to simply trust the model's reasoning.

That distinction matters because of what happened the last time OpenAI made a similar claim. In October 2025, the company said GPT-5 had solved ten Erdős problems. Thomas Bloom, who maintains the actual Erdős problem database, called that claim "a dramatic misrepresentation," since the model had mostly rediscovered already published papers Bloom simply hadn't logged yet. This time, Bloom rated the new results "big news" and said they were genuinely superior to the earlier episode, a meaningful shift in tone from the field's most relevant independent judge.

```stats
10 | Long-open math and CS problems solved
$2,000 | Total compute cost, at GPT-5.6 Sol API rates
0 | Unproven logical gaps in the Lean-verified proofs
1,854 | Mathematicians who signed the Leiden Declaration on AI risk
```

**Why "verified" and "settled" aren't the same word**

Lean's mechanical verification answers one specific question well: does this chain of logic hold together without any gaps. It does not answer several others that matter just as much to mathematicians: does the formal statement Astra proved actually match the informal, real world problem mathematicians meant to ask; is the result significant enough to matter to the field; and did the underlying training data quietly draw on the work of human mathematicians without consent or credit. Noam Brown, an OpenAI research scientist, called the results "a major step for scientific reasoning." But the International Mathematical Union has endorsed a separate document, the Leiden Declaration, signed by more than 1,850 mathematicians as of June 2026, warning that AI companies are "using published research without consent, bypassing peer review, and threatening the integrity of proof and attribution" across the field.

**A useful way to picture it**

Think of a calculator that can verify any arithmetic instantly and flawlessly, but cannot tell you whether the question you fed it was the right one to ask, or whether the answer it spits out deserves a place in a textbook. Lean is that calculator for logic. It can confirm a proof is internally airtight in a way no human check could match for speed or reliability. It cannot confirm that the proof is important, original in the way that matters to a field built on credit and precedent, or arrived at through means the field considers legitimate.

> "We will live in a demon-haunted world, full of marvelous devices whose operation we will not understand."
> Fernando Borretti, software engineer, on AI-verified mathematics

**The honest catch**

None of the ten results have been peer reviewed, the traditional process by which the mathematics community checks not just logical validity but significance and originality, and Astra itself remains unreleased, with no announced launch date, pricing, or confirmation of whether it will ship as GPT-6 or something else. It's also true that formal verification through Lean is a genuinely higher bar than OpenAI's disputed October 2025 claim, and Bloom's more favorable assessment this time is meaningful evidence the field itself sees real progress here, not just recycled results. The tension isn't between skeptics and believers so much as between two different definitions of "solved," logically valid versus formally accepted by the field that owns the problem.

**What to actually watch next**

Watch whether any of these ten results actually clears formal peer review over the coming months, the step that would settle the argument in mathematics' own terms rather than OpenAI's. Watch how the mathematics community applies the Leiden Declaration's recommendations, disclosure of AI use, mandatory peer review for AI-assisted papers, in response to this specific announcement, since that would be the clearest sign of whether the declaration has real teeth. And watch for Astra's actual release, since a public, priced product doing this kind of research at $2,000 a batch would change the economics of mathematical research well beyond this one announcement.

A machine just did in an afternoon what stumped some of the sharpest people alive for decades, for less than a monthly rent payment. The field it did it in isn't arguing about whether the logic holds. It's arguing about who gets to say the problem is actually solved.
