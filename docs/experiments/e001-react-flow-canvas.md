# Experiment E1: React Flow Canvas Capabilities

**Status**: Proposed
**Time Box**: 4-8 hours
**Blocking**: ADR-001 (Rendering Approach)

## Hypothesis

React Flow (xyflow) may provide sufficient canvas primitives for Valence's needs, allowing faster development at the cost of some flexibility. We need to understand where it helps and where it constrains.

## Approach

Build a minimal Tauri + React + React Flow prototype with:

1. **Basic canvas**
   - Pan and zoom
   - Multiple nodes on canvas

2. **Custom nodes**
   - Create a "document" node type with custom rendering
   - Test different content types (card view, mini JSON)

3. **Edges/Links**
   - Connect nodes with edges
   - Custom edge styling
   - Edge labels

4. **Grouping**
   - Use React Flow's grouping/parent features
   - Draw a box around nodes to group them
   - Can groups be collapsed?

5. **Semantic zoom**
   - Change node rendering based on zoom level
   - Show summary at low zoom, detail at high zoom

6. **Selection and interaction**
   - Multi-select nodes
   - Context menus
   - Drag from one node to another to create link

## Success Criteria

Answer these questions:

- [ ] Can custom nodes render arbitrary React components?
- [ ] How does performance feel with 50+ nodes?
- [ ] Can we implement draw-to-group interaction?
- [ ] Does semantic zoom require fighting the library or is it supported?
- [ ] How much control do we have over edge routing?
- [ ] Can edges connect to specific parts of nodes (ports)?
- [ ] What's the learning curve and documentation quality?

## Constraints Discovered

*To be filled during experiment*

List any limitations found:
-
-

## Findings

*To be filled after completion*

## Implications

*To be filled after completion*
