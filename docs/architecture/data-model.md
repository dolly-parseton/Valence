# Data Model

## Document Primitive

Everything is a document. The minimal wrapper:

```typescript
interface Document {
  id: string;           // UUID
  type: string;         // Descriptive, not prescriptive (e.g., "auth-events", "annotation")
  data: unknown;        // Raw JSON payload - the actual content
  meta: {
    source: string;     // Origin: "manual", "splunk", "generated", etc.
    created: string;    // ISO timestamp
    modified: string;   // ISO timestamp
    tags: string[];     // User-defined labels
  };
  view_hint?: string;   // Suggested widget type: "table", "timeline", "card", etc.
}
```

### Type Philosophy

`type` is **descriptive metadata**, not a schema constraint:
- LLM can suggest type based on data structure
- User can override at any time
- Widgets don't require specific types - they interpret what they can render

### View Hint Philosophy

`view_hint` suggests how to render, but:
- User can always choose a different view
- Widgets declare what structures they can render
- System matches document structure to capable widgets

## Relationships

### Links

Explicit connections between documents:

```typescript
interface Link {
  id: string;
  source_id: string;      // Document ID
  target_id: string;      // Document ID
  type: string;           // "derived-from", "references", "related", etc.
  meta: {
    created: string;
    created_by: string;   // "user" | "system" | "llm-proposed"
    confirmed: boolean;   // For LLM proposals
  };
}
```

### Annotations

Annotations are documents that link to other documents with positional anchoring:

```typescript
interface Annotation extends Document {
  type: "annotation";
  data: {
    content: string;      // The note text
  };
  anchors: Anchor[];      // Where this annotation attaches
}

interface Anchor {
  target_id: string;      // Document being annotated
  position: AnchorPosition;
}

type AnchorPosition =
  | { type: "temporal"; start: string; end: string }    // Time range
  | { type: "event_ids"; ids: string[] }                // Specific events
  | { type: "field"; path: string; value: unknown }     // Specific field value
  | { type: "document" };                               // Whole document
```

### Groups

Named collections of documents with spatial arrangement:

```typescript
interface Group {
  id: string;
  name: string;
  member_ids: string[];   // Documents in this group
  layout: {
    bounds: { x: number; y: number; width: number; height: number };
    // Member positions relative to group origin
    positions: Record<string, { x: number; y: number }>;
  };
  meta: {
    created: string;
    description?: string;
    is_template: boolean; // Can be reused as playbook
  };
}
```

## Investigation

Container for all documents, links, groups in one investigation:

```typescript
interface Investigation {
  id: string;
  name: string;
  created: string;
  modified: string;

  documents: Document[];
  links: Link[];
  groups: Group[];

  canvas: {
    // Global positions for documents not in groups
    positions: Record<string, { x: number; y: number }>;
    // Widget configurations per document
    widgets: Record<string, WidgetConfig>;
    // Current viewport
    viewport: { x: number; y: number; zoom: number };
  };
}

interface WidgetConfig {
  type: string;           // Widget type being used
  state: unknown;         // Widget-specific state (collapsed, filters, etc.)
}
```

## Widget-Document Relationship

Widgets don't own documents - they provide views of documents:

```
Document (auth-events)
    │
    ├── Widget A (table view) ─── renders rows, columns
    │
    └── Widget B (timeline view) ─── renders events on timeline
```

One document can be viewed by multiple widgets simultaneously.
Annotations on the document appear in both widgets.

## Query Results

Query results are documents:

```typescript
// Query widget configuration includes:
interface QueryWidgetState {
  query: string;
  source: string;         // SIEM identifier
  variables: Record<string, string>;  // Variable → Document ID mappings
  result_id?: string;     // Document ID of result (once executed)
}

// Result document:
{
  id: "result-123",
  type: "query-result",
  data: {
    rows: [...],
    columns: [...],
    metadata: {
      query: "index=auth user=$USER",
      execution_time: "2025-11-26T10:30:00Z",
      row_count: 247
    }
  },
  meta: {
    source: "splunk",
    created: "2025-11-26T10:30:05Z"
  },
  view_hint: "table"
}
```

## Proposals (LLM Suggestions)

Unconfirmed suggestions from LLM:

```typescript
interface Proposal {
  id: string;
  type: "document" | "link" | "type-suggestion" | "view-suggestion";
  payload: unknown;       // The proposed document/link/value
  confidence: number;     // 0-1, if model provides it
  context: string;        // Why this was proposed
  status: "pending" | "accepted" | "rejected";
}
```

Proposals render as "grey" elements on canvas until confirmed.
Accepting a proposal converts it to a real document/link.

## Storage Format

*Decision pending - options:*

> Almost surely going with SQLite, but I can see the appeal of JSON and a folder structure because the coding assistant style workflows would be really interesting. Thinking about how KQL-Panopticon might send it's output to this kind of structure. JSON files would be easier but there's definitely pros to SQLite as well...

### Option A: JSON Files
```
investigation-abc123/
├── manifest.json         # Investigation metadata
├── documents/
│   ├── doc-001.json
│   ├── doc-002.json
│   └── ...
├── links.json
├── groups.json
└── canvas.json
```

### Option B: SQLite
```
investigation-abc123.db
├── documents (table)
├── links (table)
├── groups (table)
├── canvas_state (table)
└── fts_documents (virtual table for search)
```

SQLite advantages: Transactions, FTS, single file.
JSON advantages: Human-readable, git-friendly, simpler.