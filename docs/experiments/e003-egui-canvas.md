# Experiment E3: egui Canvas Evaluation

**Status**: Proposed
**Time Box**: 4-6 hours
**Blocking**: ADR-001 (Rendering Approach)

## Hypothesis

egui might offer a middle ground - pure Rust with decent UI primitives, potentially simpler than Bevy for a UI-focused application. Need to evaluate whether spatial canvas patterns are feasible.

## Approach

Research and prototype:

1. **Research phase**
   - Survey existing egui canvas/node-graph implementations
   - Look at egui_node_graph, egui_graphs, or similar crates
   - Review egui's Area and Window widgets for floating elements

2. **Prototype phase** (if research is promising)
   - Build minimal egui application with eframe
   - Create draggable panels/areas
   - Test custom painting for links between elements
   - Evaluate zoom/pan capabilities

3. **Integration consideration**
   - How would this integrate with Tauri?
   - egui-tauri vs standalone eframe?

## Success Criteria

Answer these questions:

- [ ] Are there existing canvas/node-graph crates for egui that fit our needs?
- [ ] Can egui Areas be freely positioned and dragged?
- [ ] How do we draw connections between floating elements?
- [ ] What's the zoom/pan story?
- [ ] How does styling/theming compare to web CSS?
- [ ] Is immediate-mode a problem for persistent canvas state?

## Existing Crates Reviewed

*To be filled during experiment*

| Crate | Purpose | Verdict |
|-------|---------|---------|
| egui_node_graph | | |
| egui_graphs | | |
| ... | | |

## Findings

*To be filled after completion*

## Implications

*To be filled after completion*
