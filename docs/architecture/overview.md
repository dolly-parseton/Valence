# Architecture Overview

**Status**: Draft - Pending ADR-001 decision

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Valence                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Canvas Layer                       │   │
│  │  - Document positioning and rendering                 │   │
│  │  - Widget display and interaction                     │   │
│  │  - Link visualization                                 │   │
│  │  - Group boundaries                                   │   │
│  │  - Semantic zoom                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Core Services                       │   │
│  │  - Document store (CRUD, relationships)              │   │
│  │  - Investigation state management                     │   │
│  │  - Query execution (SIEM integration)                │   │
│  │  - LLM service (Ollama client)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Persistence                         │   │
│  │  - Investigation files (JSON/SQLite)                 │   │
│  │  - Query pack storage                                 │   │
│  │  - Group/playbook templates                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │  Ollama  │   │   SIEM   │   │  File    │
      │  (LLM)   │   │   APIs   │   │  System  │
      └──────────┘   └──────────┘   └──────────┘
```

## Component Responsibilities

### Canvas Layer
*Implementation TBD pending ADR-001*

Responsible for:
- Rendering documents as widgets on a 2D canvas
- Handling user interactions (drag, select, link, group)
- Managing zoom levels and semantic zoom transitions
- Displaying annotations in context

### Core Services (Rust)

**Document Store**
- CRUD operations for documents
- Relationship management (links, annotations, groups)
- Query interface for finding related documents
- Change notification for reactive UI updates

**Investigation Manager**
- Investigation lifecycle (create, open, save, close)
- Undo/redo history
- Investigation metadata

**Query Service**
- SIEM query abstraction
- Query pack management (stored queries)
- Result transformation

**LLM Service**
- Ollama client for local inference
- Task-specific prompts (type inference, entity extraction)
- Proposal management (grey suggestions)

### Persistence

**Investigation Storage**
- One folder per investigation
- JSON files for documents and relationships
- Or SQLite database per investigation
- Decision pending on format

**Templates**
- Group templates (playbooks)
- Query packs
- Widget configurations

## Key Data Flows

### 1. Alert Ingestion
```
User pastes/drops JSON
    → Document created with raw data
    → LLM proposes type + view hint
    → User confirms or modifies
    → Widget renders on canvas
```

### 2. Entity Extraction
```
User triggers extract on document
    → LLM identifies entities in data
    → Proposals appear as grey nodes
    → User confirms desired entities
    → New documents created with links to source
```

### 3. Query Execution
```
User creates query widget
    → Links entity document as variable
    → Executes query against SIEM
    → Result document created
    → Optional: transform splits into multiple documents
```

### 4. Annotation
```
User adds note to widget view
    → Annotation document created
    → Linked to source document with anchor
    → Appears in all widgets showing that data
```

## Open Questions

1. **Rust/Frontend boundary**: Where does state live? How much logic in Rust vs rendering layer?

2. **Real-time updates**: If a query result updates, how do dependent widgets learn about it?

3. **Undo granularity**: What operations are undoable? Per-document? Per-action?

4. **Large investigations**: Performance with 500+ documents, 1000+ relationships?

These will be addressed as the architecture evolves through experimentation.
