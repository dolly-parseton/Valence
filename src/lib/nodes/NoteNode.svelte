<script lang="ts">
  import BaseNode from './BaseNode.svelte';

  type Props = {
    id: string;
    data: Record<string, unknown>;
    selected?: boolean;
  };

  let { id, data, selected }: Props = $props();
</script>

<BaseNode
  {id}
  {data}
  {selected}
  title="Note"
  headerColor="#fcd34d"
  borderColor="#d97706"
  backgroundColor="#fef3c7"
  showDuplicate={true}
>
  {#snippet viewContent({ data, onEdit }: { data: Record<string, unknown>; onEdit: () => void })}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="note-view nodrag nowheel" ondblclick={onEdit}>
      {#if data.text}
        <span class="note-text">{data.text}</span>
      {:else}
        <span class="placeholder">Double-click to edit...</span>
      {/if}
    </div>
  {/snippet}

  {#snippet editContent({ editData, onUpdate }: { editData: Record<string, unknown>; onUpdate: (data: Record<string, unknown>) => void })}
    <textarea
      class="note-editor nodrag nowheel"
      value={(editData.text as string) ?? ''}
      oninput={(e) => onUpdate({ text: (e.target as HTMLTextAreaElement).value })}
      placeholder="Enter notes..."
    ></textarea>
  {/snippet}
</BaseNode>

<style>
  .note-view {
    padding: 10px;
    min-height: 60px;
    overflow: auto;
  }

  .note-text {
    display: block;
    font-size: 14px;
    color: #78350f;
    white-space: pre-wrap;
    word-break: break-word;
    -webkit-user-select: text !important;
    user-select: text !important;
    cursor: text !important;
  }

  .placeholder {
    display: block;
    color: #b45309;
    opacity: 0.6;
    font-style: italic;
  }

  .note-editor {
    width: 100%;
    min-height: 80px;
    padding: 10px;
    border: none;
    background: #fef9e7;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
    color: #78350f;
    box-sizing: border-box;
  }

  .note-editor:focus {
    outline: none;
  }

  .note-editor::placeholder {
    color: #b45309;
    opacity: 0.6;
  }
</style>
