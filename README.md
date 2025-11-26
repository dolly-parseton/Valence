# Valence

A canvas-based investigation environment for security operations and incident response.

## What is Valence?

Valence is a local-first desktop application that provides a spatial canvas for security investigations. Instead of rigid workflows and siloed tools, Valence treats **documents as the primitive** - any structured data with a thin wrapper that can be connected, grouped, and annotated.

The name comes from chemistry: the bonds between atoms. The value is in the **relationships** - how documents connect, how context propagates, how patterns emerge from proximity.

## Current State

**Status**: Early development / Prototype

The canvas layer is functional with three node types:

| Node Type | Description |
|-----------|-------------|
| **Note** | Plain text notes with amber styling |
| **Markdown** | Rich markdown rendering with GFM support |
| **JSON** | Syntax-highlighted JSON with validation |

### Working Features

- **Canvas**: Pan, zoom, minimap, node selection
- **Node Operations**: Add, delete, duplicate, drag, resize
- **In-place Editing**: Double-click to edit, Cmd+Enter to save, Escape to cancel
- **Undo/Redo**: Command-based history system (Cmd+Z / Cmd+Shift+Z)
- **Connections**: Link nodes via handles (drag from source to target)
- **Awareness Overlay**: Debug visualization for node proximity detection

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop Runtime | [Tauri 2](https://tauri.app/) |
| Frontend Framework | [SvelteKit](https://kit.svelte.dev/) + Svelte 5 |
| Canvas Library | [@xyflow/svelte](https://svelteflow.dev/) |
| Code Editor | [CodeMirror 6](https://codemirror.net/) |
| Backend | Rust (minimal - shell only) |

## Project Structure

```
valence/
├── src/                      # SvelteKit frontend
│   ├── lib/
│   │   ├── nodes/            # Custom node components
│   │   │   ├── BaseNode.svelte
│   │   │   ├── NoteNode.svelte
│   │   │   ├── MarkdownNode.svelte
│   │   │   └── JsonNode.svelte
│   │   ├── components/       # Shared components
│   │   └── stores/           # State management
│   └── routes/               # SvelteKit routes
├── src-tauri/                # Tauri/Rust backend
├── docs/                     # Project documentation
│   ├── vision/               # Project goals and principles
│   ├── architecture/         # Technical design
│   └── decisions/            # ADRs
└── package.json
```

## Development

### Prerequisites

- Node.js 18+
- Rust (latest stable)
- Tauri CLI

### Setup

```bash
# Install dependencies
npm install

# Run in development mode (web only)
npm run dev

# Run as desktop app
npm run tauri dev

# Build for production
npm run tauri build
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build SvelteKit for production |
| `npm run tauri dev` | Launch Tauri development app |
| `npm run tauri build` | Build distributable app |
| `npm run check` | Run svelte-check |

## Documentation

Detailed documentation lives in `/docs`:

- [Vision Overview](docs/vision/overview.md) - Problem statement and goals
- [Architecture Overview](docs/architecture/overview.md) - System design
- [Data Model](docs/architecture/data-model.md) - Document primitive and relationships
- [Decisions](docs/decisions/) - Architectural Decision Records

## License

MIT
