# Experiments Log

## Purpose

Experiments are time-boxed explorations to test hypotheses and inform decisions. They're not production code - they're learning exercises.

## Experiment Index

### Superseded (ADR-001 Resolved)

These experiments were proposed to inform the rendering decision. ADR-001 has been accepted (Tauri + Svelte + SvelteFlow), so these are no longer needed.

| ID | Title | Status | Notes |
|----|-------|--------|-------|
| E1 | React Flow Canvas Capabilities | Superseded | Decision made for SvelteFlow |
| E2 | Bevy Canvas Prototype | Superseded | Pure Rust approach not selected |
| E3 | egui Canvas Evaluation | Superseded | egui approach not selected |

### Active Experiments

Now that the rendering approach is decided, these experiments focus on Valence-specific functionality:

| ID | Title | Status | Depends On |
|----|-------|--------|------------|
| E4 | SvelteFlow Custom Nodes | Proposed | Initial Tauri+Svelte setup |
| E5 | Document → Entity Extraction | Proposed | E4 |
| E6 | Entity → Query → Results Flow | Proposed | E5 |
| E7 | Results → Timeline/Documentation | Proposed | E6 |
| E8 | Annotation Anchoring | Proposed | Widget architecture |
| E9 | Group as Playbook Reuse | Proposed | Canvas + widgets |
| E10 | LLM Type Inference | Proposed | Document model |

## Experiment Template

```markdown
# Experiment EXX: Title

**Status**: Proposed | In Progress | Complete
**Time Box**: X hours/days
**Blocking**: Which decision this informs

## Hypothesis

What are we testing? What do we expect to learn?

## Approach

How will we test this? What will we build?

## Success Criteria

How do we know if it worked? What questions should be answered?

## Findings

What did we learn? (Filled after completion)

## Implications

How does this affect design decisions? (Filled after completion)
```
