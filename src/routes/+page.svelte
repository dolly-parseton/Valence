<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    MiniMap,
    type Node,
    type Edge,
    type Connection,
  } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  import NoteNode from '$lib/nodes/NoteNode.svelte';
  import MarkdownNode from '$lib/nodes/MarkdownNode.svelte';
  import JsonNode from '$lib/nodes/JsonNode.svelte';
  import AwarenessOverlay from '$lib/components/AwarenessOverlay.svelte';
  import * as history from '$lib/stores/history';
  import {
    createMoveNodeCommand,
    createAddEdgeCommand,
    createDeleteNodeCommand,
    createAddNodeCommand,
  } from '$lib/stores/commands';
  import { setCanvasContext } from '$lib/stores/canvas-context';
  import { findOverlappingPairs } from '$lib/utils/awareness';

  // Register custom node types
  const nodeTypes = {
    note: NoteNode,
    markdown: MarkdownNode,
    json: JsonNode,
  };

  // Initial nodes - Phishing Investigation Demo
  let nodes = $state<Node[]>([
    // Row 1 - Initial Alert & Triage
    {
      id: '1',
      type: 'json',
      position: { x: 50, y: 50 },
      data: {
        title: 'Phishing Alert',
        content: JSON.stringify({
          alert_id: 'PHI-2024-0847',
          severity: 'high',
          timestamp: '2024-11-26T09:23:41Z',
          source: 'Email Gateway',
          subject: 'Urgent: Password Reset Required',
          recipient: 'john.smith@acme.corp',
          sender: 'IT-Support@acme-corp.net'
        }, null, 2)
      },
    },
    {
      id: '2',
      type: 'note',
      position: { x: 350, y: 50 },
      data: {
        title: 'Triage Notes',
        text: 'Initial triage by L1 analyst.\n\nSuspicious sender domain: acme-corp.net vs legitimate acme.corp\n\nEscalated to L2 for deeper analysis.'
      },
    },
    {
      id: '3',
      type: 'markdown',
      position: { x: 620, y: 50 },
      data: {
        title: 'IOC Summary',
        content: '## Indicators of Compromise\n\n| Type | Value | Status |\n|------|-------|--------|\n| Domain | `acme-corp.net` | Malicious |\n| IP | `185.234.72.19` | Suspicious |\n| Hash | `a1b2c3...` | Unknown |\n\n**Action:** Block domain at proxy'
      },
    },

    // Row 2 - Investigation Details
    {
      id: '4',
      type: 'json',
      position: { x: 50, y: 320 },
      data: {
        title: 'Email Headers',
        content: JSON.stringify({
          'Return-Path': '<bounce@acme-corp.net>',
          'X-Originating-IP': '185.234.72.19',
          'Received-SPF': 'fail',
          'DKIM-Signature': 'none',
          'X-Spam-Score': 8.5
        }, null, 2)
      },
    },
    {
      id: '5',
      type: 'note',
      position: { x: 350, y: 320 },
      data: {
        title: 'Victim Interview',
        text: 'Spoke with John Smith:\n\n- Did NOT click any links\n- Reported email immediately\n- No credentials entered\n- Forwarded to security team\n\nNo compromise detected on endpoint.'
      },
    },
    {
      id: '6',
      type: 'markdown',
      position: { x: 620, y: 320 },
      data: {
        title: 'Domain Analysis',
        content: '## acme-corp.net\n\n**Registration:** 2 days ago\n**Registrar:** NameCheap\n**Hosting:** Bulletproof hosting (RU)\n\n### DNS Records\n```\nA     185.234.72.19\nMX    mail.acme-corp.net\n```\n\n> Classic typosquat pattern'
      },
    },

    // Row 3 - Resolution
    {
      id: '7',
      type: 'json',
      position: { x: 50, y: 590 },
      data: {
        title: 'Remediation Actions',
        content: JSON.stringify({
          actions: [
            { type: 'block_domain', target: 'acme-corp.net', status: 'complete' },
            { type: 'block_ip', target: '185.234.72.19', status: 'complete' },
            { type: 'email_purge', count: 12, status: 'complete' },
            { type: 'user_notification', recipients: 'all_staff', status: 'pending' }
          ],
          blocked_at: '2024-11-26T10:45:00Z'
        }, null, 2)
      },
    },
    {
      id: '8',
      type: 'note',
      position: { x: 350, y: 590 },
      data: {
        title: 'Lessons Learned',
        text: 'Campaign targeted finance dept.\n\n12 users received email, 0 clicked.\n\nSecurity awareness training effective!\n\nRecommend: Add lookalike domain monitoring.'
      },
    },
    {
      id: '9',
      type: 'markdown',
      position: { x: 620, y: 590 },
      data: {
        title: 'Case Summary',
        content: '## PHI-2024-0847 - CLOSED\n\n**Classification:** Phishing attempt\n**Impact:** None (blocked)\n**Time to Detect:** 4 minutes\n**Time to Contain:** 82 minutes\n\n### Verdict\n✅ Successfully mitigated\n✅ No data exfiltration\n✅ No credential compromise'
      },
    },
  ]);

  // No edges for demo
  let edges = $state<Edge[]>([]);

  // Track undo/redo availability for UI
  let canUndo = $state(false);
  let canRedo = $state(false);

  $effect(() => {
    return history.subscribe((undo, redo) => {
      canUndo = undo;
      canRedo = redo;
    });
  });

  // Awareness debugging
  let showAwareness = $state(false);
  const AWARENESS_DISTANCE = 50; // pixels

  // Track overlapping node pairs
  let overlappingPairs = $state<Set<string>>(new Set());

  // Recalculate overlaps when nodes change position
  $effect(() => {
    if (showAwareness) {
      overlappingPairs = findOverlappingPairs(nodes, AWARENESS_DISTANCE);
    }
  });

  function toggleAwareness() {
    showAwareness = !showAwareness;
  }

  // Track node positions before drag for undo
  let dragStartPositions: Map<string, { x: number; y: number }> = new Map();

  function handleDragStart(event: { nodes: Node[] }) {
    // Store starting positions of all dragged nodes
    dragStartPositions.clear();
    const draggedNodes = event.nodes ?? [];
    draggedNodes.forEach((node: Node) => {
      dragStartPositions.set(node.id, { ...node.position });
    });
  }

  function handleDragStop(event: { nodes: Node[] }) {
    const draggedNodes = event.nodes ?? [];

    draggedNodes.forEach((node: Node) => {
      const oldPos = dragStartPositions.get(node.id);
      const newPos = { ...node.position };
      if (oldPos && (oldPos.x !== newPos.x || oldPos.y !== newPos.y)) {
        // Record the move (already happened via SvelteFlow's drag)
        // Using record() instead of execute() since the action already occurred
        history.record(
          createMoveNodeCommand(node.id, oldPos, newPos, updateNodes)
        );
      }
    });

    dragStartPositions.clear();
  }

  function handleConnect(connection: Connection) {
    const newEdge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source!,
      target: connection.target!,
    };

    history.execute(createAddEdgeCommand(newEdge, updateEdges));
  }

  // Update functions for use with commands
  function updateNodes(fn: (nodes: Node[]) => Node[]) {
    nodes = fn(nodes);
  }

  function updateEdges(fn: (edges: Edge[]) => Edge[]) {
    edges = fn(edges);
  }

  // Canvas context for child components
  function getNode(nodeId: string): Node | undefined {
    return nodes.find((n) => n.id === nodeId);
  }

  function getConnectedEdges(nodeId: string): Edge[] {
    return edges.filter((e) => e.source === nodeId || e.target === nodeId);
  }

  function deleteNode(nodeId: string) {
    const node = getNode(nodeId);
    if (!node) return;

    const connectedEdges = getConnectedEdges(nodeId);
    history.execute(
      createDeleteNodeCommand(node, connectedEdges, updateNodes, updateEdges)
    );
  }

  function deleteEdge(edgeId: string) {
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;

    history.execute({
      description: 'Delete connection',
      execute: () => updateEdges((edges) => edges.filter((e) => e.id !== edgeId)),
      undo: () => updateEdges((edges) => [...edges, edge]),
    });
  }

  function duplicateNode(nodeId: string) {
    const node = getNode(nodeId);
    if (!node) return;

    const newNode: Node = {
      ...structuredClone(node),
      id: String(nodeIdCounter++),
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
    };

    history.execute(createAddNodeCommand(newNode, updateNodes));
  }

  function recordDataChange(
    nodeId: string,
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>,
    description: string = 'Edit node'
  ) {
    history.record({
      description,
      execute: () => {
        updateNodes((nodes) =>
          nodes.map((n) =>
            n.id === nodeId ? { ...n, data: newData } : n
          )
        );
      },
      undo: () => {
        updateNodes((nodes) =>
          nodes.map((n) =>
            n.id === nodeId ? { ...n, data: oldData } : n
          )
        );
      },
    });
  }

  // Track if any node is being edited (locks workspace undo/redo)
  let isEditing = $state(false);

  function setEditing(editing: boolean) {
    isEditing = editing;
  }

  // Set up canvas context for child components
  setCanvasContext({
    deleteNode,
    deleteEdge,
    duplicateNode,
    getNode,
    getConnectedEdges,
    recordDataChange,
    setEditing,
  });

  // Keyboard shortcuts
  function handleKeydown(event: KeyboardEvent) {
    // Skip workspace undo/redo while editing a node
    if (isEditing) return;

    const key = event.key.toLowerCase();

    // Cmd/Ctrl+Shift+Z for redo
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && key === 'z') {
      event.preventDefault();
      history.redo();
      return;
    }

    // Cmd/Ctrl+Z for undo
    if ((event.metaKey || event.ctrlKey) && key === 'z') {
      event.preventDefault();
      history.undo();
      return;
    }

    // Cmd/Ctrl+Y for redo (alternative)
    if ((event.metaKey || event.ctrlKey) && key === 'y') {
      event.preventDefault();
      history.redo();
      return;
    }
  }

  // Add node function for toolbar
  let nodeIdCounter = 10;
  function addNode(type: string) {
    const newNode: Node = {
      id: String(nodeIdCounter++),
      type,
      position: { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: type === 'note' ? { text: '' } : type === 'markdown' ? { content: '' } : type === 'json' ? { content: '' } : { label: 'New Node' },
    };

    history.execute(createAddNodeCommand(newNode, updateNodes));
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="app-container">
  <div class="toolbar">
    <div class="toolbar-group">
      <button onclick={() => addNode('note')} title="Add Note">
        + Note
      </button>
      <button onclick={() => addNode('markdown')} title="Add Markdown">
        + Markdown
      </button>
      <button onclick={() => addNode('json')} title="Add JSON">
        + JSON
      </button>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
      <button
        onclick={() => history.undo()}
        disabled={!canUndo}
        title={canUndo ? `Undo: ${history.getUndoDescription()}` : 'Nothing to undo'}
      >
        Undo
      </button>
      <button
        onclick={() => history.redo()}
        disabled={!canRedo}
        title={canRedo ? `Redo: ${history.getRedoDescription()}` : 'Nothing to redo'}
      >
        Redo
      </button>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
      <button
        onclick={toggleAwareness}
        class:active={showAwareness}
        title="Toggle awareness zone visualization"
      >
        {showAwareness ? '🔵 Awareness' : '⚪ Awareness'}
      </button>
      {#if showAwareness && overlappingPairs.size > 0}
        <span class="overlap-count">{overlappingPairs.size} overlap{overlappingPairs.size !== 1 ? 's' : ''}</span>
      {/if}
    </div>
  </div>

  <div class="canvas-container">
    <SvelteFlow
      bind:nodes
      bind:edges
      {nodeTypes}
      fitView
      onnodedragstart={handleDragStart}
      onnodedragstop={handleDragStop}
      onconnect={handleConnect}
    >
      <Controls />
      <Background />
      <MiniMap />
      {#if showAwareness}
        <AwarenessOverlay
          {nodes}
          awarenessDistance={AWARENESS_DISTANCE}
          {overlappingPairs}
        />
      {/if}
    </SvelteFlow>
  </div>
</div>

<style>
  .app-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #1f2937;
    border-bottom: 1px solid #374151;
  }

  .toolbar-group {
    display: flex;
    gap: 4px;
  }

  .toolbar-divider {
    width: 1px;
    height: 24px;
    background: #4b5563;
    margin: 0 4px;
  }

  .toolbar button {
    padding: 6px 12px;
    background: #374151;
    border: 1px solid #4b5563;
    border-radius: 4px;
    color: #e5e7eb;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .toolbar button:hover:not(:disabled) {
    background: #4b5563;
  }

  .toolbar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .canvas-container {
    flex: 1;
    width: 100%;
  }

  .toolbar button.active {
    background: #3b82f6;
    border-color: #2563eb;
  }

  .overlap-count {
    color: #fbbf24;
    font-size: 12px;
    padding: 4px 8px;
    background: rgba(251, 191, 36, 0.15);
    border-radius: 4px;
  }
</style>
