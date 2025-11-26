<script lang="ts">
  import { useViewport, type Node } from '@xyflow/svelte';

  type Props = {
    nodes: Node[];
    awarenessDistance: number;
    overlappingPairs: Set<string>;
  };

  let { nodes, awarenessDistance, overlappingPairs }: Props = $props();

  // Get viewport for transforming overlay - must be inside SvelteFlow context
  const viewport = useViewport();

  // Calculate the expanded bounding box for each node
  function getAwarenessBounds(node: Node) {
    // Default node dimensions if not specified
    const width = (node.measured?.width ?? node.width ?? 200);
    const height = (node.measured?.height ?? node.height ?? 100);

    return {
      x: node.position.x - awarenessDistance,
      y: node.position.y - awarenessDistance,
      width: width + awarenessDistance * 2,
      height: height + awarenessDistance * 2,
    };
  }

  function isNodeOverlapping(nodeId: string): boolean {
    for (const pair of overlappingPairs) {
      if (pair.includes(nodeId)) return true;
    }
    return false;
  }
</script>

<div
  class="awareness-layer"
  style:transform="translate({viewport.current.x}px, {viewport.current.y}px) scale({viewport.current.zoom})"
>
<svg class="awareness-overlay">
  {#each nodes as node (node.id)}
    {@const bounds = getAwarenessBounds(node)}
    {@const overlapping = isNodeOverlapping(node.id)}
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      class="awareness-boundary"
      class:overlapping
    />
  {/each}
</svg>
</div>

<style>
  .awareness-layer {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    transform-origin: 0 0;
  }

  .awareness-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  .awareness-boundary {
    fill: rgba(59, 130, 246, 0.08);
    stroke: rgba(59, 130, 246, 0.4);
    stroke-width: 1;
    stroke-dasharray: 4 2;
  }

  .awareness-boundary.overlapping {
    fill: rgba(234, 179, 8, 0.15);
    stroke: rgba(234, 179, 8, 0.7);
    stroke-width: 2;
    stroke-dasharray: none;
  }
</style>
