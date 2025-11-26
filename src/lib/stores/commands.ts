/**
 * Command factories for common canvas operations
 */

import type { Node, Edge } from '@xyflow/svelte';
import type { Command } from './history';

type NodeStore = {
  update: (fn: (nodes: Node[]) => Node[]) => void;
};

type EdgeStore = {
  update: (fn: (edges: Edge[]) => Edge[]) => void;
};

/**
 * Command to move a node to a new position
 */
export function createMoveNodeCommand(
  nodeId: string,
  oldPosition: { x: number; y: number },
  newPosition: { x: number; y: number },
  updateNodes: (fn: (nodes: Node[]) => Node[]) => void
): Command {
  return {
    description: `Move node`,
    execute: () => {
      updateNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId ? { ...n, position: { ...newPosition } } : n
        )
      );
    },
    undo: () => {
      updateNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId ? { ...n, position: { ...oldPosition } } : n
        )
      );
    },
  };
}

/**
 * Command to update node data
 */
export function createUpdateNodeDataCommand<T extends Record<string, unknown>>(
  nodeId: string,
  oldData: T,
  newData: T,
  updateNodes: (fn: (nodes: Node[]) => Node[]) => void,
  description: string = 'Update node'
): Command {
  return {
    description,
    execute: () => {
      updateNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
        )
      );
    },
    undo: () => {
      updateNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...oldData } } : n
        )
      );
    },
  };
}

/**
 * Command to add a node
 */
export function createAddNodeCommand(
  node: Node,
  updateNodes: (fn: (nodes: Node[]) => Node[]) => void
): Command {
  return {
    description: `Add ${node.type ?? 'node'}`,
    execute: () => {
      updateNodes((nodes) => [...nodes, node]);
    },
    undo: () => {
      updateNodes((nodes) => nodes.filter((n) => n.id !== node.id));
    },
  };
}

/**
 * Command to delete a node (and its connected edges)
 */
export function createDeleteNodeCommand(
  node: Node,
  connectedEdges: Edge[],
  updateNodes: (fn: (nodes: Node[]) => Node[]) => void,
  updateEdges: (fn: (edges: Edge[]) => Edge[]) => void
): Command {
  return {
    description: `Delete ${node.type ?? 'node'}`,
    execute: () => {
      updateNodes((nodes) => nodes.filter((n) => n.id !== node.id));
      updateEdges((edges) =>
        edges.filter((e) => e.source !== node.id && e.target !== node.id)
      );
    },
    undo: () => {
      updateNodes((nodes) => [...nodes, node]);
      updateEdges((edges) => [...edges, ...connectedEdges]);
    },
  };
}

/**
 * Command to add an edge
 */
export function createAddEdgeCommand(
  edge: Edge,
  updateEdges: (fn: (edges: Edge[]) => Edge[]) => void
): Command {
  return {
    description: 'Add connection',
    execute: () => {
      updateEdges((edges) => [...edges, edge]);
    },
    undo: () => {
      updateEdges((edges) => edges.filter((e) => e.id !== edge.id));
    },
  };
}

/**
 * Command to delete an edge
 */
export function createDeleteEdgeCommand(
  edge: Edge,
  updateEdges: (fn: (edges: Edge[]) => Edge[]) => void
): Command {
  return {
    description: 'Delete connection',
    execute: () => {
      updateEdges((edges) => edges.filter((e) => e.id !== edge.id));
    },
    undo: () => {
      updateEdges((edges) => [...edges, edge]);
    },
  };
}

/**
 * Command to batch multiple commands together
 */
export function createBatchCommand(
  commands: Command[],
  description: string
): Command {
  return {
    description,
    execute: () => {
      commands.forEach((cmd) => cmd.execute());
    },
    undo: () => {
      // Undo in reverse order
      [...commands].reverse().forEach((cmd) => cmd.undo());
    },
  };
}
