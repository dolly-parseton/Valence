<script lang="ts">
  import BaseNode from './BaseNode.svelte';
  import CodeMirrorEditor from '$lib/components/CodeMirrorEditor.svelte';

  type Props = {
    id: string;
    data: Record<string, unknown>;
    selected?: boolean;
  };

  let { id, data, selected }: Props = $props();

  function formatJson(content: unknown): string {
    if (!content) return '';
    try {
      if (typeof content === 'string') {
        // Try to parse if it's a string
        return JSON.stringify(JSON.parse(content), null, 2);
      }
      return JSON.stringify(content, null, 2);
    } catch {
      return String(content);
    }
  }

  function syntaxHighlight(json: string): string {
    if (!json) return '<span class="placeholder">Double-click to edit...</span>';

    // Escape HTML first
    const escaped = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply syntax highlighting
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }

  function validateJson(text: string): { valid: boolean; error?: string } {
    if (!text.trim()) return { valid: true };
    try {
      JSON.parse(text);
      return { valid: true };
    } catch (e) {
      return { valid: false, error: (e as Error).message };
    }
  }
</script>

<BaseNode
  {id}
  {data}
  {selected}
  title="JSON"
  headerColor="#e0e7ff"
  borderColor="#6366f1"
  backgroundColor="#f5f3ff"
  showDuplicate={true}
>
  {#snippet viewContent({ data, onEdit }: { data: Record<string, unknown>; onEdit: () => void })}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="json-view nodrag nowheel" ondblclick={onEdit}>
      <pre class="json-content">{@html syntaxHighlight(formatJson(data.content))}</pre>
    </div>
  {/snippet}

  {#snippet editContent({ editData, onUpdate }: { editData: Record<string, unknown>; onUpdate: (data: Record<string, unknown>) => void })}
    {@const validation = validateJson((editData.content as string) ?? '')}
    <div class="json-edit-container nodrag nowheel" class:invalid={!validation.valid}>
      <CodeMirrorEditor
        value={(editData.content as string) ?? ''}
        language="json"
        placeholder={'{"key": "value"}'}
        onchange={(value) => onUpdate({ content: value })}
      />
      {#if !validation.valid}
        <div class="validation-error">{validation.error}</div>
      {/if}
    </div>
  {/snippet}
</BaseNode>

<style>
  .json-view {
    padding: 10px;
    min-height: 60px;
    overflow: auto;
  }

  .json-content {
    margin: 0;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
    -webkit-user-select: text !important;
    user-select: text !important;
    cursor: text !important;
  }

  .json-content :global(.placeholder) {
    color: #9ca3af;
    font-style: italic;
    font-family: inherit;
  }

  .json-content :global(.json-key) {
    color: #7c3aed;
  }

  .json-content :global(.json-string) {
    color: #059669;
  }

  .json-content :global(.json-number) {
    color: #d97706;
  }

  .json-content :global(.json-boolean) {
    color: #dc2626;
  }

  .json-content :global(.json-null) {
    color: #6b7280;
  }

  .json-edit-container {
    display: flex;
    flex-direction: column;
    background: #faf5ff;
  }

  .json-edit-container.invalid {
    background: #fef2f2;
  }

  .validation-error {
    padding: 6px 10px;
    font-size: 11px;
    color: #dc2626;
    background: #fef2f2;
    border-top: 1px solid #fecaca;
  }
</style>
