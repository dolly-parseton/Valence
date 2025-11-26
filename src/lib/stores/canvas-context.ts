/**
 * Canvas context for sharing state and actions with node components
 */

import { getContext, setContext } from 'svelte';
import type { Node, Edge } from '@xyflow/svelte';

const CANVAS_CONTEXT_KEY = 'valence-canvas';

export type CanvasContext = {
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  getNode: (nodeId: string) => Node | undefined;
  getConnectedEdges: (nodeId: string) => Edge[];
  /** Record a data change for undo/redo. Call with old value when starting edit, new value when done. */
  recordDataChange: (
    nodeId: string,
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>,
    description?: string
  ) => void;
  /** Notify canvas that a node is being edited (locks workspace undo/redo) */
  setEditing: (isEditing: boolean) => void;
};

export function setCanvasContext(ctx: CanvasContext) {
  setContext(CANVAS_CONTEXT_KEY, ctx);
}

export function getCanvasContext(): CanvasContext {
  const ctx = getContext<CanvasContext>(CANVAS_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('Canvas context not found. Make sure setCanvasContext is called in a parent component.');
  }
  return ctx;
}
