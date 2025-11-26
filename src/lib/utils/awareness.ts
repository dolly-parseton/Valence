/**
 * Awareness zone utilities for proximity-based context sharing
 */

import type { Node } from '@xyflow/svelte';

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Get the awareness bounding box for a node
 * This is the node's bounds expanded by the awareness distance
 */
export function getAwarenessBounds(node: Node, awarenessDistance: number): BoundingBox {
  const width = node.measured?.width ?? node.width ?? 200;
  const height = node.measured?.height ?? node.height ?? 100;

  return {
    x: node.position.x - awarenessDistance,
    y: node.position.y - awarenessDistance,
    width: width + awarenessDistance * 2,
    height: height + awarenessDistance * 2,
  };
}

/**
 * Check if two bounding boxes overlap
 */
export function boxesOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

/**
 * Find all pairs of nodes whose awareness zones overlap
 * Returns a Set of strings in format "nodeId1:nodeId2" (sorted alphabetically)
 */
export function findOverlappingPairs(nodes: Node[], awarenessDistance: number): Set<string> {
  const pairs = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];
    const boundsA = getAwarenessBounds(nodeA, awarenessDistance);

    for (let j = i + 1; j < nodes.length; j++) {
      const nodeB = nodes[j];
      const boundsB = getAwarenessBounds(nodeB, awarenessDistance);

      if (boxesOverlap(boundsA, boundsB)) {
        // Sort IDs to ensure consistent pair naming
        const [id1, id2] = [nodeA.id, nodeB.id].sort();
        pairs.add(`${id1}:${id2}`);
      }
    }
  }

  return pairs;
}

/**
 * Get all nodes that overlap with a specific node's awareness zone
 */
export function getOverlappingNodes(
  nodeId: string,
  nodes: Node[],
  awarenessDistance: number
): Node[] {
  const targetNode = nodes.find((n) => n.id === nodeId);
  if (!targetNode) return [];

  const targetBounds = getAwarenessBounds(targetNode, awarenessDistance);

  return nodes.filter((node) => {
    if (node.id === nodeId) return false;
    const nodeBounds = getAwarenessBounds(node, awarenessDistance);
    return boxesOverlap(targetBounds, nodeBounds);
  });
}

/**
 * Create a pair key for two node IDs (consistent ordering)
 */
export function createPairKey(id1: string, id2: string): string {
  const [a, b] = [id1, id2].sort();
  return `${a}:${b}`;
}

/**
 * Parse a pair key into its component node IDs
 */
export function parsePairKey(key: string): [string, string] {
  const [a, b] = key.split(':');
  return [a, b];
}
