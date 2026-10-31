---
title: India wants your bank and hospital data to train AI without anyone seeing it
category: tech
date: '2026-10-31T09:00:00.000Z'
brief: >-
  On 30 October 2026, India's IT ministry unveiled a draft plan called DEPA for
  AI Training that would let startups train AI models on data held by banks,
  hospitals and government agencies, without ever seeing the raw records. The
  data stays locked inside a secure "sealed room"; developers send their model
  in and get only the trained model back. The government says this could add
  $500 billion of AI-driven value to India's economy by 2030. The draft is not
  legally binding yet, and big questions remain: how data owners get paid, who
  is liable if something leaks, and where your own consent fits in. Here is
  what we know, and what we do not.
cover: /covers/india-wants-your-bank-and-hospital-data-to-train-ai-without-anyone-seeing-it.webp
coverCredit: >-
  An MRI scanner in a hospital scanning room. Scans like these are one of the
  first kinds of data being tested under the plan. Photo:
  [Walter Davies](https://commons.wikimedia.org/wiki/File:An_MRI_scanner.JPG),
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via Wikimedia
  Commons, resized.
sources:
  - https://cio.eletsonline.com/artificial-intelligence/meity-depa-ai-training-framework-sealed-rooms-sensitive-data-ispirt/76548/
  - https://inc42.com/buzz/meity-floats-new-privacy-led-framework-to-unlock-data-for-training-ai-models/
  - https://github.com/iSPIRT/depa-training
  - https://dial.global/research/secure-environment-for-ai-training/
  - https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf
  - https://www.theweek.in/wire-updates/business/2025/11/14/del148-biz-dpdp-rules-ld-govt.html
  - https://techadvisory.substack.com/p/revisit-depa-training-framework
---

*Your MRI scan, your loan history and your school marks are exactly the kind of data that could make Indian AI good, and exactly the kind nobody wants to hand over. The government now has a plan to use them without handing them over at all.*

On Thursday, 30 October, MeitY Secretary S Krishnan unveiled a handbook called **DEPA for AI Training** at a roundtable in Bengaluru, according to [Elets CIO](https://cio.eletsonline.com/artificial-intelligence/meity-depa-ai-training-framework-sealed-rooms-sensitive-data-ispirt/76548/). MeitY is the Ministry of Electronics and Information Technology. The plan was written with iSPIRT, a volunteer-run technology think tank, and it is still a draft.

The idea sounds like a magic trick: let AI developers train on India's most sensitive data while making sure they never actually see it. We went through what has been published so far. Some of it is clear. Some of it is not yet decided by anyone.

## What we know: the problem it is trying to solve

AI models get better by studying huge piles of examples. A model that spots tumours needs thousands of scans. A model that decides who deserves a small business loan needs years of repayment records. In India, most of that data sits with hospitals, banks and government offices, and it mostly stays there.

The handbook calls this a **"data deadlock"**. Hospitals and banks earn very little by sharing data and risk a lot. Under India's Digital Personal Data Protection Act, 2023, failing to protect personal data properly can bring a penalty of up to **₹250 crore**, as the [Act's schedule of penalties](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf) states.

The obvious fix, removing names and ID numbers before sharing, does not work well either. The handbook says such "anonymised" data can often be traced back to real people, and stripping it also strips out much of what makes it useful.

## What we know: how the "sealed room" works

Think of a bank locker room. You can bring your own box in, the bank checks your paperwork, but you never get to wander into other people's lockers. DEPA Training works a bit like that, except the thing walking in is an AI model.

```flow
How a training run would work
Hospital or bank encrypts its data and registers it
A startup asks to use it for one stated purpose
An electronic contract checks the request against the rules
The model trains inside a sealed room, the raw data never leaves
The trained model is checked for bias, safety and explainability
Only approved models go on to pilots and wider use
```

The roles have names. **Training Data Providers** are the banks, hospitals and agencies that hold data. **Training Data Consumers** are the startups, companies and researchers who want to build models, as described by [Inc42](https://inc42.com/buzz/meity-floats-new-privacy-led-framework-to-unlock-data-for-training-ai-models/). A new kind of middleman called a **Data Collab** would pool and clean data from many sources. A new industry body called Samyog, backed by iSPIRT, would register participants, provide standard contracts and settle disputes, per Elets.

Two technical ideas do the heavy lifting. The first is a **confidential clean room**: a locked computing space that runs only what the signed contract allows. The second is **differential privacy**, a mathematical method that adds carefully measured noise during training so the finished model cannot be made to reveal any one person's details.

This builds on something many Indians already use without knowing its name. The original DEPA, set up in 2020, powers the **Account Aggregator** system, which lets you share your own bank statements with a lender with a tap of consent. The new version deals with something different: bulk data about many people, used to build models rather than to process one person's loan.

## What we know: it has already been tried

Two pilots were described at the launch. In banking, a bank that has been testing the system since March used it to work out which customers of a fintech partner qualified for its credit cards, before asking those customers for consent, and then approached only them. According to Mint, as reported by Elets, it handled **more than 2 million requests in two weeks**. The bank was not named.

In healthcare, hospitals and a health-tech startup are training a tumour-detection model on MRI scans that the startup never sees.

```stats
$500 bn | value the handbook says AI could add to India's GDP by 2030
₹250 Cr | top DPDP penalty for failing to protect data
2 mn+ | requests handled in two weeks in the bank pilot
```

The **$500 billion** figure is the government's own projection, not a measured result. Treat it as a goal.

## What we do not know yet

**Whether it becomes rule.** The handbook is a draft and is not legally binding. Elets reports that consultations are expected to start in the coming weeks, and that observers expect any binding rules to come from sector regulators such as the RBI rather than a brand new law, the same route Account Aggregator took.

**How data owners get paid.** The roadmap mentions royalties or access fees for data providers. The handbook says payment methods "will be explored". In other words, not decided.

**Who is to blame if something leaks.** The handbook does not say who is liable if data escapes a sealed room, Elets notes. For a hospital weighing a possible ₹250 crore penalty, that gap matters more than any diagram.

**How ready the technology is.** iSPIRT's own public code for the clean rooms carries a plain warning on [GitHub](https://github.com/iSPIRT/depa-training): it is "work-in-progress and should not be used in production". The [Digital Impact Alliance](https://dial.global/research/secure-environment-for-ai-training/), which has studied the project, describes it as still at the pilot stage.

## The question that matters most to you: where is your consent

This is where reasonable people disagree, and it is worth laying out both sides.

The case for the plan is that asking millions of people one by one for permission to use their scan in a training run is not practical, and that the sealed room plus differential privacy protects people better than consent forms that nobody reads. The Act itself already allows some processing for "research, archiving or statistical purposes" without the usual rules, as long as the data is not used to make decisions about a specific person and follows standards the government sets.

The case against was made back in January 2024 by technology consultant Satish Ayyaswami, writing about an earlier version of the same framework. He [argued](https://techadvisory.substack.com/p/revisit-depa-training-framework) that it "ignores customer consent" and leaves customers "nowhere in the picture", and that people should instead hold their own data and sell access to it directly.

The bank pilot sits right between the two views. The screening of who qualified happened before anyone was asked. Consent came after, only for the people who got an offer.

The timing adds pressure. India's data protection rules were notified in November 2025 and become fully operational about **18 months** later, around May 2027, as [PTI reported via The Week](https://www.theweek.in/wire-updates/business/2025/11/14/del148-biz-dpdp-rules-ld-govt.html). Whatever DEPA Training becomes will have to fit inside them.

India's AI ambitions keep running into physical and legal limits. We looked at the physical one in [why the AI race is turning into a fight over electricity](/explainers/the-ai-race-has-quietly-become-a-fight-over-electricity-not-chips), and at how fast rivals are moving in [the Chinese model that beat America's best](/explainers/china-built-an-ai-model-that-beats-americas-best-and-washington-called-it-stolen). Data is the third limit, and on 30 October India drew up its first rough plan for it.

*This is a news summary of a draft government proposal that may still change.*
