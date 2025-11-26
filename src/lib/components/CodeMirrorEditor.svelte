<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView, keymap, placeholder as cmPlaceholder } from '@codemirror/view';
  import { EditorState, type Extension } from '@codemirror/state';
  import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
  import { closeBrackets, closeBracketsKeymap, autocompletion } from '@codemirror/autocomplete';
  import { json } from '@codemirror/lang-json';
  import { markdown } from '@codemirror/lang-markdown';
  import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
  import { searchKeymap } from '@codemirror/search';

  type Props = {
    value: string;
    language: 'json' | 'markdown';
    placeholder?: string;
    onchange: (value: string) => void;
    class?: string;
  };

  let {
    value,
    language,
    placeholder = '',
    onchange,
    class: className = '',
  }: Props = $props();

  let container: HTMLDivElement;
  let view: EditorView | null = null;

  // Track if we're updating from props to avoid loops
  let isUpdatingFromProps = false;

  function getLanguageExtension(): Extension {
    switch (language) {
      case 'json':
        return json();
      case 'markdown':
        return markdown();
      default:
        return [];
    }
  }

  function createEditor() {
    const extensions: Extension[] = [
      // Basic editing
      history(),
      closeBrackets(),
      bracketMatching(),
      indentOnInput(),
      autocompletion(),
      syntaxHighlighting(defaultHighlightStyle),

      // Language support
      getLanguageExtension(),

      // Keymaps
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
      ]),

      // Placeholder
      cmPlaceholder(placeholder),

      // Update listener
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !isUpdatingFromProps) {
          onchange(update.state.doc.toString());
        }
      }),

      // Theme/styling
      EditorView.theme({
        '&': {
          fontSize: '13px',
          fontFamily: "'Monaco', 'Menlo', 'Consolas', monospace",
        },
        '.cm-content': {
          padding: '8px 0',
          minHeight: '80px',
        },
        '.cm-line': {
          padding: '0 10px',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-placeholder': {
          color: '#9ca3af',
          fontStyle: 'italic',
        },
        '.cm-matchingBracket': {
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          outline: '1px solid rgba(59, 130, 246, 0.5)',
        },
      }),

      // Make it grow with content but have a max height
      EditorView.contentAttributes.of({ class: 'cm-editor-content' }),
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    view = new EditorView({
      state,
      parent: container,
    });
  }

  // Sync external value changes to editor
  $effect(() => {
    if (view && value !== view.state.doc.toString()) {
      isUpdatingFromProps = true;
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
      isUpdatingFromProps = false;
    }
  });

  onMount(() => {
    createEditor();
  });

  onDestroy(() => {
    view?.destroy();
  });
</script>

<div bind:this={container} class="codemirror-wrapper {className}"></div>

<style>
  .codemirror-wrapper {
    width: 100%;
    min-width: 280px;
    max-height: 300px;
    overflow: auto;
    border: none;
  }

  .codemirror-wrapper :global(.cm-editor) {
    height: 100%;
  }

  .codemirror-wrapper :global(.cm-scroller) {
    overflow: auto;
  }
</style>
