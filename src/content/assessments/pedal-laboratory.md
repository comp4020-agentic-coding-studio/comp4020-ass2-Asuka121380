---
title: Pedal Laboratory
description:
  Change one or more variables in a simplified nonlinear pedal model, and
  trace the full chain from parameter change to audible consequence.
week: 9
due: 2027-04-30T12:00:00+10:00
weight: 30
marking:
  mode: weighted
  criteria:
    - name: Predicted causal chain is correct end-to-end
      weight: 30
    - name: Circuit and parameter interpretation
      weight: 20
    - name: Nonlinear (clipping) reasoning
      weight: 20
    - name: Filter reasoning
      weight: 15
    - name: Linking the technical change to what is actually audible
      weight: 15
spec:
  - at least one pedal parameter is changed and its new setting is stated explicitly
  - the causal chain from parameter change through to audible consequence is written out step by step, not asserted in one line
  - waveform or spectrum evidence from the lab bench supports the predicted electrical or mathematical effect
related:
  - lectures/week-06
  - lectures/week-07
  - lectures/week-08
---

Weeks 5-8 built up a simplified nonlinear guitar-processing chain — gain,
clipping, and filtering — one stage at a time. This assessment asks you to
manipulate that system deliberately and account for what happens at every
step in between, rather than just describing the before and after.

## The task

Working from the simplified pedal model `Input → Gain → Clipping → Filter →
Output`, change one or more of:

- amplifier gain
- clipping threshold
- symmetric versus asymmetric clipping
- filter resistance
- filter capacitance
- post-clipping tone shaping

For each change, predict and explain the full chain of consequence:

```
Component/parameter change → Electrical or mathematical effect → Waveform change → Spectrum change → Audible consequence
```

Use the Pedal Laboratory bench (Weeks 6-8) to generate the waveform and
spectrum evidence for each step, and connect that evidence explicitly back to
the electrical or mathematical reasoning that predicted it.

## Skills assessed

Causal reasoning; circuit interpretation; nonlinear signal understanding;
filter understanding; linking technical measurements to audible outcomes.
