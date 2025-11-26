<script lang="ts">
  import { Handle, Position, useSvelteFlow, NodeResizer, NodeResizeControl } from '@xyflow/svelte';
  import type { Snippet } from 'svelte';
  import { getCanvasContext } from '$lib/stores/canvas-context';

  type Props = {
    id: string;
    data: Record<string, unknown>;
    selected?: boolean;
    title: string;
    headerColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    handles?: {
      left?: boolean;
      right?: boolean;
      top?: boolean;
      bottom?: boolean;
    };
    showDelete?: boolean;
    showDuplicate?: boolean;
    /** Awareness distance in pixels - used for proximity detection */
    awarenessDistance?: number;
    /** Content to render in view mode */
    viewContent: Snippet<[{ data: Record<string, unknown>; onEdit: () => void }]>;
    /** Content to render in edit mode */
    editContent: Snippet<[{ data: Record<string, unknown>; editData: Record<string, unknown>; onUpdate: (newData: Record<string, unknown>) => void }]>;
    /** Additional header actions */
    actions?: Snippet<[{ editing: boolean }]>;
  };

  let {
    id,
    data,
    selected = false,
    title,
    headerColor = '#f3f4f6',
    borderColor = '#e5e7eb',
    backgroundColor = '#ffffff',
    handles = { left: true, right: true },
    showDelete = true,
    showDuplicate = false,
    awarenessDistance = 50,
    viewContent,
    editContent,
    actions,
  }: Props = $props();

  const canvas = getCanvasContext();
  const { updateNodeData } = useSvelteFlow();

  // Edit state
  let editing = $state(false);
  let editData = $state<Record<string, unknown>>({});
  let editTitle = $state('');
  let contentEl: HTMLDivElement;
  let editMinWidth = $state<string | undefined>(undefined);
  let editMinHeight = $state<string | undefined>(undefined);

  // Get display title - use data.title if set, otherwise fall back to prop
  let displayTitle = $derived((data.title as string) || title);

  function handleEdit() {
    // Capture current dimensions before switching to edit mode
    if (contentEl) {
      const rect = contentEl.getBoundingClientRect();
      editMinWidth = `${rect.width}px`;
      editMinHeight = `${rect.height}px`;
    }
    editData = { ...data };
    editTitle = displayTitle;
    editing = true;
    canvas.setEditing(true);
  }

  function handleSave() {
    // Build new data with title
    const newData = { ...editData };

    // Handle title: store if different from default, remove if matches default
    if (editTitle && editTitle !== title) {
      newData.title = editTitle;
    } else if (editTitle === title || !editTitle) {
      delete newData.title; // Remove if it matches default or is empty
    }

    // Check if data actually changed (compare with original data)
    const hasChanges = JSON.stringify(data) !== JSON.stringify(newData);

    if (hasChanges) {
      const oldData = { ...data };

      updateNodeData(id, newData);
      canvas.recordDataChange(id, oldData, newData, `Edit ${editTitle || title}`);
    }
    editing = false;
    editMinWidth = undefined;
    editMinHeight = undefined;
    canvas.setEditing(false);
  }

  function handleCancel() {
    editData = { ...data };
    editTitle = displayTitle;
    editing = false;
    editMinWidth = undefined;
    editMinHeight = undefined;
    canvas.setEditing(false);
  }

  function handleUpdateEditData(newData: Record<string, unknown>) {
    editData = { ...editData, ...newData };
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!editing) return;

    if (event.key === 'Escape') {
      handleCancel();
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSave();
    }
  }

  function handleDelete() {
    canvas.deleteNode(id);
  }

  function handleDuplicate() {
    canvas.duplicateNode(id);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Full resize controls when selected -->
<NodeResizer
  isVisible={selected}
  minWidth={150}
  minHeight={80}
  lineClass="resize-line"
  handleClass="resize-handle-corner"
/>

<!-- Simple gripper when not selected -->
{#if !selected}
  <NodeResizeControl
    minWidth={150}
    minHeight={80}
    position="bottom-right"
    style="background: transparent; border: none; cursor: nwse-resize;"
  >
    <svg width="12" height="12" viewBox="0 0 10 10" style="opacity: 0.5;">
      <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.5" />
      <line x1="9" y1="4" x2="4" y2="9" stroke="currentColor" stroke-width="1.5" />
      <line x1="9" y1="7" x2="7" y2="9" stroke="currentColor" stroke-width="1.5" />
    </svg>
  </NodeResizeControl>
{/if}

<div
  class="base-node"
  class:selected
  style:--header-color={headerColor}
  style:--border-color={borderColor}
  style:--bg-color={backgroundColor}
>
  <div class="node-header">
    {#if editing}
      <input
        type="text"
        class="node-title-input nodrag"
        bind:value={editTitle}
        placeholder={title}
      />
    {:else}
      <span class="node-title">{displayTitle}</span>
    {/if}
    <div class="node-actions">
      {#if actions}
        {@render actions({ editing })}
      {/if}
      {#if editing}
        <button class="action-btn save-btn nodrag" onclick={handleSave} title="Save (Cmd+Enter)">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        <button class="action-btn cancel-btn nodrag" onclick={handleCancel} title="Cancel (Escape)">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      {:else}
        {#if showDuplicate}
          <button class="action-btn nodrag" onclick={handleDuplicate} title="Duplicate">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        {/if}
        {#if showDelete}
          <button class="action-btn delete-btn nodrag" onclick={handleDelete} title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        {/if}
      {/if}
    </div>
  </div>

  <div
    class="node-content"
    bind:this={contentEl}
    style:min-width={editing ? editMinWidth : undefined}
    style:min-height={editing ? editMinHeight : undefined}
  >
    {#if editing}
      {@render editContent({ data, editData, onUpdate: handleUpdateEditData })}
      <div class="edit-hint">Cmd+Enter to save, Escape to cancel</div>
    {:else}
      {@render viewContent({ data, onEdit: handleEdit })}
    {/if}
  </div>

  {#if handles.left}
    <Handle type="target" position={Position.Left} />
  {/if}
  {#if handles.right}
    <Handle type="source" position={Position.Right} />
  {/if}
  {#if handles.top}
    <Handle type="target" position={Position.Top} />
  {/if}
  {#if handles.bottom}
    <Handle type="source" position={Position.Bottom} />
  {/if}
</div>

<style>
  .base-node {
    position: relative;
    background: var(--bg-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    width: 100%;
    height: 100%;
    min-width: 150px;
    min-height: 80px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.15s ease, border-color 0.15s ease;
  }

  .base-node.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .node-header {
    background: var(--header-color);
    padding: 6px 10px;
    border-radius: 7px 7px 0 0;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .node-title {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .node-title-input {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    padding: 2px 6px;
    outline: none;
  }

  .node-title-input:focus {
    background: white;
    border-color: #3b82f6;
  }

  .node-title-input::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  .node-actions {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .action-btn {
    background: transparent;
    border: none;
    padding: 2px;
    cursor: pointer;
    color: #6b7280;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #374151;
  }

  .save-btn:hover {
    background: #d1fae5;
    color: #059669;
  }

  .cancel-btn:hover,
  .delete-btn:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  .node-content {
    flex: 1;
    border-radius: 0 0 7px 7px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Make edit content containers fill available space */
  .node-content > :first-child {
    flex: 1;
  }

  .edit-hint {
    margin-top: auto;
    padding: 4px 10px 8px;
    font-size: 11px;
    color: #6b7280;
    background: rgba(0, 0, 0, 0.03);
  }


  /* NodeResizer styling when selected */
  :global(.resize-line) {
    border-color: #3b82f6 !important;
  }

  :global(.resize-handle-corner) {
    width: 8px !important;
    height: 8px !important;
    background: #3b82f6 !important;
    border: none !important;
    border-radius: 2px !important;
  }
</style>
