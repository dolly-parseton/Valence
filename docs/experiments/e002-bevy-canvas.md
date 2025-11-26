# Experiment E2: Bevy Canvas Prototype

**Status**: Proposed
**Time Box**: 8-16 hours
**Blocking**: ADR-001 (Rendering Approach)

## Hypothesis

Bevy's ECS architecture may provide a natural model for documents, widgets, and relationships. The trade-off is more custom implementation work but potentially better long-term fit for the domain.

## Approach

Build a minimal Bevy application (no Tauri initially) with:

1. **Basic canvas**
   - 2D camera with pan and zoom
   - Background grid or workspace indicator

2. **Document entities**
   - Spawn rectangles representing documents
   - Basic positioning with Transform
   - Selectable (click to select, visual feedback)

3. **Drag interaction**
   - Click and drag to move documents
   - Multi-select with shift-click or box select

4. **Links as entities**
   - Create link entities between documents
   - Render as lines/curves between document positions
   - Links update when documents move

5. **Grouping**
   - Parent-child entity relationships for groups
   - Visual boundary around group members
   - Move group moves all children

6. **Text and UI**
   - Render text labels on documents
   - Test bevy_egui for overlay UI (toolbars, menus)
   - Evaluate text input capabilities

## Success Criteria

Answer these questions:

- [ ] How natural does ECS feel for document/widget/relationship modeling?
- [ ] What's the effort to implement basic drag-and-drop?
- [ ] How does text rendering quality compare to web?
- [ ] Can we combine Bevy rendering with egui for UI chrome?
- [ ] What's performance like with 100+ entities?
- [ ] How do we handle scrolling lists within a "widget" entity?
- [ ] What's the path to text input (query editing, annotations)?

## ECS Modeling Notes

*To be filled during experiment*

Document how we model:
- Documents (entities with Document component?)
- Widgets (separate entities? components on documents?)
- Links (entities with references to two documents?)
- Groups (parent entity with children?)

## Findings

*To be filled after completion*

## Implications

*To be filled after completion*
