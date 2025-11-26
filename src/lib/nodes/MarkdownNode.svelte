<script lang="ts">
  import { marked } from 'marked';
  import BaseNode from './BaseNode.svelte';
  import CodeMirrorEditor from '$lib/components/CodeMirrorEditor.svelte';

  type Props = {
    id: string;
    data: Record<string, unknown>;
    selected?: boolean;
  };

  let { id, data, selected }: Props = $props();

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  function renderMarkdown(text: string): string {
    if (!text) return '<p class="placeholder">Double-click to edit...</p>';
    return marked.parse(text) as string;
  }
</script>

<BaseNode
  {id}
  {data}
  {selected}
  title="Markdown"
  showDuplicate={true}
>
  {#snippet viewContent({ data, onEdit }: { data: Record<string, unknown>; onEdit: () => void })}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="markdown-view nodrag nowheel" ondblclick={onEdit}>
      {@html renderMarkdown((data.content as string) ?? '')}
    </div>
  {/snippet}

  {#snippet editContent({ editData, onUpdate }: { editData: Record<string, unknown>; onUpdate: (data: Record<string, unknown>) => void })}
    <div class="markdown-edit-container nodrag nowheel">
      <CodeMirrorEditor
        value={(editData.content as string) ?? ''}
        language="markdown"
        placeholder="Write markdown here..."
        onchange={(value) => onUpdate({ content: value })}
      />
    </div>
  {/snippet}
</BaseNode>

<style>
  .markdown-view {
    padding: 12px;
    min-height: 60px;
    overflow: auto;
    -webkit-user-select: text !important;
    user-select: text !important;
    cursor: text !important;
    font-size: 14px;
    line-height: 1.5;
    color: #1f2937;
  }

  .markdown-edit-container {
    background: #f9fafb;
  }

  /* Markdown rendered styles */
  .markdown-view :global(h1) {
    font-size: 1.25em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
    color: #111827;
  }

  .markdown-view :global(h2) {
    font-size: 1.1em;
    font-weight: 600;
    margin: 0.75em 0 0.4em 0;
    color: #1f2937;
  }

  .markdown-view :global(h3) {
    font-size: 1em;
    font-weight: 600;
    margin: 0.6em 0 0.3em 0;
    color: #374151;
  }

  .markdown-view :global(p) {
    margin: 0 0 0.5em 0;
  }

  .markdown-view :global(p.placeholder) {
    color: #9ca3af;
    font-style: italic;
  }

  .markdown-view :global(ul),
  .markdown-view :global(ol) {
    margin: 0 0 0.5em 0;
    padding-left: 1.5em;
  }

  .markdown-view :global(li) {
    margin: 0.2em 0;
  }

  .markdown-view :global(code) {
    background: #f3f4f6;
    padding: 0.15em 0.4em;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9em;
  }

  .markdown-view :global(pre) {
    background: #1f2937;
    color: #e5e7eb;
    padding: 0.75em;
    border-radius: 4px;
    overflow-x: auto;
    margin: 0.5em 0;
  }

  .markdown-view :global(pre code) {
    background: none;
    padding: 0;
    color: inherit;
  }

  .markdown-view :global(blockquote) {
    border-left: 3px solid #d1d5db;
    margin: 0.5em 0;
    padding-left: 1em;
    color: #6b7280;
  }

  .markdown-view :global(a) {
    color: #3b82f6;
    text-decoration: underline;
  }

  .markdown-view :global(strong) {
    font-weight: 600;
  }

  .markdown-view :global(em) {
    font-style: italic;
  }
</style>
