# Valence Documentation

## Structure

```
docs/
├── README.md                 # This file - documentation index
├── vision/                   # Project vision and goals
│   ├── overview.md           # High-level project description
│   └── principles.md         # Core design principles
├── architecture/             # Technical architecture
│   ├── overview.md           # System architecture overview
│   └── data-model.md         # Document primitive and relationships
├── decisions/                # Architectural Decision Records (ADRs)
│   ├── README.md             # Decision log index
│   ├── 001-rendering-approach.md
│   └── ...
└── experiments/              # Experiment definitions and findings
    ├── README.md             # Experiment log index
    └── ...
```

## Decision Process

Decisions follow a lightweight ADR format:
1. **Context** - Why is this decision needed?
2. **Options** - What are the viable approaches?
3. **Analysis** - Trade-offs for each option
4. **Decision** - What we chose and why
5. **Status** - Proposed / Accepted / Superseded

## Experiment Process

Experiments are time-boxed explorations:
1. **Hypothesis** - What are we testing?
2. **Approach** - How will we test it?
3. **Findings** - What did we learn?
4. **Implications** - How does this affect design?
