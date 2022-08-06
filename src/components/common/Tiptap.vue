<template>
  <FloatingMenu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    :should-show="() => true">
    <button
      :class="{ 'is-active': editor.isActive('bold') }"
      type="button"
      @click="editor.chain().focus().toggleBold().run()">
      <q-icon name="format_bold" size="16px" />
    </button>
    <button
      :class="{ 'is-active': editor.isActive('italic') }"
      type="button"
      @click="editor.chain().focus().toggleItalic().run()">
      <q-icon name="format_italic" size="16px" />
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
      H3
    </button>
    <button
      :class="{ 'is-active': editor.isActive('bulletList') }"
      type="button"
      @click="editor.chain().focus().toggleBulletList().run()">
      <q-icon name="list" size="16px" />
    </button>
  </FloatingMenu>
  <EditorContent :editor="editor" :readonly="readonly" />
</template>

<script>
  import StarterKit from '@tiptap/starter-kit'
  import { Editor, EditorContent, FloatingMenu } from '@tiptap/vue-3'
  import { createMarkdownEditor } from 'tiptap-markdown'
  const MarkdownEditor = createMarkdownEditor(Editor)

  export default {
    components: {
      EditorContent,
      FloatingMenu,
    },

    props: {
      modelValue: {
        type: String,
        default: '',
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    emits: ['update:modelValue'],

    data() {
      return {
        editor: null,
      }
    },

    watch: {
      modelValue(value) {
        const isSame = this.editor.getMarkdown() === value

        if (isSame) {
          return
        }

        this.editor.commands.setContent(value, false)
      },
    },

    mounted() {
      this.editor = new MarkdownEditor({
        extensions: [StarterKit],
        content: this.modelValue,
        onUpdate: () => {
          this.$emit('update:modelValue', this.editor.getMarkdown())
        },
      })
    },

    beforeUnmount() {
      this.editor.destroy()
    },
  }
</script>

<style lang="scss" scoped>
  button {
    font-size: 14px !important;
    font-family: inherit;
    color: #000;
    margin: 0.1rem;
    border: 1px solid black;
    border-radius: 0.3rem;
    padding: 0.06rem 0.2rem;
    background: white;
    accent-color: black;

    &.is-active {
      background: black;
      color: #fff;
    }
  }
</style>

<style lang="scss">
  .ProseMirror:focus {
    outline: none;
  }

  .ProseMirror {
    min-height: 100px;
    max-height: 180px;
    overflow: scroll;
    border: 1px solid #aaa;
    border-radius: 3px;
    padding: 5px;
    position: relative;
  }
  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
  }
  .ProseMirror [contenteditable='false'] {
    white-space: normal;
  }
  .ProseMirror [contenteditable='false'] [contenteditable='true'] {
    white-space: pre-wrap;
  }
  .ProseMirror pre {
    white-space: pre-wrap;
  }
  img.ProseMirror-separator {
    display: inline !important;
    border: none !important;
    margin: 0 !important;
    width: 1px !important;
    height: 1px !important;
  }
  .ProseMirror-gapcursor {
    display: none;
    pointer-events: none;
    position: absolute;
    margin: 0;
  }
  .ProseMirror-gapcursor:after {
    content: '';
    display: block;
    position: absolute;
    top: -2px;
    width: 20px;
    border-top: 1px solid black;
    animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
  }
  @keyframes ProseMirror-cursor-blink {
    to {
      visibility: hidden;
    }
  }
  .ProseMirror-hideselection *::selection {
    background: transparent;
  }
  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }
  .ProseMirror-hideselection * {
    caret-color: transparent;
  }
  .ProseMirror-focused .ProseMirror-gapcursor {
    display: block;
  }
  .tippy-box[data-animation='fade'][data-state='hidden'] {
    opacity: 0;
  }

  .ProseMirror {
    --color-prettylights-syntax-comment: #6e7781;
    --color-prettylights-syntax-constant: #0550ae;
    --color-prettylights-syntax-entity: #8250df;
    --color-prettylights-syntax-storage-modifier-import: #24292f;
    --color-prettylights-syntax-entity-tag: #116329;
    --color-prettylights-syntax-keyword: #cf222e;
    --color-prettylights-syntax-string: #0a3069;
    --color-prettylights-syntax-variable: #953800;
    --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
    --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
    --color-prettylights-syntax-invalid-illegal-bg: #82071e;
    --color-prettylights-syntax-carriage-return-text: #f6f8fa;
    --color-prettylights-syntax-carriage-return-bg: #cf222e;
    --color-prettylights-syntax-string-regexp: #116329;
    --color-prettylights-syntax-markup-list: #3b2300;
    --color-prettylights-syntax-markup-heading: #0550ae;
    --color-prettylights-syntax-markup-italic: #24292f;
    --color-prettylights-syntax-markup-bold: #24292f;
    --color-prettylights-syntax-markup-deleted-text: #82071e;
    --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
    --color-prettylights-syntax-markup-inserted-text: #116329;
    --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
    --color-prettylights-syntax-markup-changed-text: #953800;
    --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
    --color-prettylights-syntax-markup-ignored-text: #eaeef2;
    --color-prettylights-syntax-markup-ignored-bg: #0550ae;
    --color-prettylights-syntax-meta-diff-range: #8250df;
    --color-prettylights-syntax-brackethighlighter-angle: #57606a;
    --color-prettylights-syntax-sublimelinter-gutter-mark: #8c959f;
    --color-prettylights-syntax-constant-other-reference-link: #0a3069;
    --color-fg-default: #24292f;
    --color-fg-muted: #57606a;
    --color-fg-subtle: #6e7781;
    --color-canvas-default: #ffffff;
    --color-canvas-subtle: #f6f8fa;
    --color-border-default: #d0d7de;
    --color-border-muted: hsla(210, 18%, 87%, 1);
    --color-neutral-muted: rgba(175, 184, 193, 0.2);
    --color-accent-fg: #0969da;
    --color-accent-emphasis: #0969da;
    --color-attention-subtle: #fff8c5;
    --color-danger-fg: #cf222e;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    margin: 0;
    color: var(--color-fg-default);
    background-color: var(--color-canvas-default);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji';
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .ProseMirror details,
  .ProseMirror figcaption,
  .ProseMirror figure {
    display: block;
  }

  .ProseMirror summary {
    display: list-item;
  }

  .ProseMirror [hidden] {
    display: none !important;
  }

  .ProseMirror a {
    background-color: transparent;
    color: var(--color-accent-fg);
    text-decoration: none;
  }

  .ProseMirror a:active,
  .ProseMirror a:hover {
    outline-width: 0;
  }

  .ProseMirror abbr[title] {
    border-bottom: none;
    text-decoration: underline dotted;
  }

  .ProseMirror b,
  .ProseMirror strong {
    font-weight: 600;
  }

  .ProseMirror dfn {
    font-style: italic;
  }

  .ProseMirror h1 {
    margin: 0.67em 0;
    font-weight: 600;
    padding-bottom: 0.3em;
    font-size: 2em;
    border-bottom: 1px solid var(--color-border-muted);
  }

  .ProseMirror mark {
    background-color: var(--color-attention-subtle);
    color: var(--color-text-primary);
  }

  .ProseMirror small {
    font-size: 90%;
  }

  .ProseMirror sub,
  .ProseMirror sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  .ProseMirror sub {
    bottom: -0.25em;
  }

  .ProseMirror sup {
    top: -0.5em;
  }

  .ProseMirror img {
    border-style: none;
    max-width: 100%;
    box-sizing: content-box;
    background-color: var(--color-canvas-default);
  }

  .ProseMirror code,
  .ProseMirror kbd,
  .ProseMirror pre,
  .ProseMirror samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  .ProseMirror figure {
    margin: 1em 40px;
  }

  .ProseMirror hr {
    box-sizing: content-box;
    overflow: hidden;
    background: transparent;
    border-bottom: 1px solid var(--color-border-muted);
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: var(--color-border-default);
    border: 0;
  }

  .ProseMirror input {
    font: inherit;
    margin: 0;
    overflow: visible;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .ProseMirror [type='button'],
  .ProseMirror [type='reset'],
  .ProseMirror [type='submit'] {
    -webkit-appearance: button;
  }

  .ProseMirror [type='button']::-moz-focus-inner,
  .ProseMirror [type='reset']::-moz-focus-inner,
  .ProseMirror [type='submit']::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  .ProseMirror [type='button']:-moz-focusring,
  .ProseMirror [type='reset']:-moz-focusring,
  .ProseMirror [type='submit']:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  .ProseMirror [type='checkbox'],
  .ProseMirror [type='radio'] {
    box-sizing: border-box;
    padding: 0;
  }

  .ProseMirror [type='number']::-webkit-inner-spin-button,
  .ProseMirror [type='number']::-webkit-outer-spin-button {
    height: auto;
  }

  .ProseMirror [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  .ProseMirror [type='search']::-webkit-search-cancel-button,
  .ProseMirror [type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  .ProseMirror ::-webkit-input-placeholder {
    color: inherit;
    opacity: 0.54;
  }

  .ProseMirror ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  .ProseMirror a:hover {
    text-decoration: underline;
  }

  .ProseMirror hr::before {
    display: table;
    content: '';
  }

  .ProseMirror hr::after {
    display: table;
    clear: both;
    content: '';
  }

  .ProseMirror table {
    border-spacing: 0;
    border-collapse: collapse;
    display: block;
    width: max-content;
    max-width: 100%;
    overflow: auto;
  }

  .ProseMirror td,
  .ProseMirror th {
    padding: 0;
  }

  .ProseMirror details summary {
    cursor: pointer;
  }

  .ProseMirror details:not([open]) > *:not(summary) {
    display: none !important;
  }

  .ProseMirror kbd {
    display: inline-block;
    padding: 3px 5px;
    font: 11px ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    line-height: 10px;
    color: var(--color-fg-default);
    vertical-align: middle;
    background-color: var(--color-canvas-subtle);
    border: solid 1px var(--color-neutral-muted);
    border-bottom-color: var(--color-neutral-muted);
    border-radius: 6px;
    box-shadow: inset 0 -1px 0 var(--color-neutral-muted);
  }

  .ProseMirror h1,
  .ProseMirror h2,
  .ProseMirror h3,
  .ProseMirror h4,
  .ProseMirror h5,
  .ProseMirror h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  .ProseMirror h2 {
    font-weight: 600;
    padding-bottom: 0.3em;
    font-size: 1.5em;
    border-bottom: 1px solid var(--color-border-muted);
  }

  .ProseMirror h3 {
    font-weight: 600;
    font-size: 1.25em;
  }

  .ProseMirror h4 {
    font-weight: 600;
    font-size: 1em;
  }

  .ProseMirror h5 {
    font-weight: 600;
    font-size: 0.875em;
  }

  .ProseMirror h6 {
    font-weight: 600;
    font-size: 0.85em;
    color: var(--color-fg-muted);
  }

  .ProseMirror p {
    margin-top: 0;
    margin-bottom: 10px !important;
  }

  .ProseMirror blockquote {
    margin: 0;
    padding: 0 1em;
    color: var(--color-fg-muted);
    border-left: 0.25em solid var(--color-border-default);
  }

  .ProseMirror ul,
  .ProseMirror ol {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 2em;
  }

  .ProseMirror ul {
    list-style-type: disc;
  }

  .ProseMirror ol {
    list-style-type: decimal;
  }

  .ProseMirror ol ol,
  .ProseMirror ul ol {
    list-style-type: lower-roman;
  }

  .ProseMirror ul ul ol,
  .ProseMirror ul ol ol,
  .ProseMirror ol ul ol,
  .ProseMirror ol ol ol {
    list-style-type: lower-alpha;
  }

  .ProseMirror dd {
    margin-left: 0;
  }

  .ProseMirror tt,
  .ProseMirror code {
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 12px;
  }

  .ProseMirror pre {
    margin-top: 0;
    margin-bottom: 0;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 12px;
    word-wrap: normal;
  }

  .ProseMirror g-emoji {
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1em;
    font-style: normal !important;
    font-weight: 400;
    line-height: 1;
    vertical-align: -0.075em;
  }

  .ProseMirror g-emoji img {
    width: 1em;
    height: 1em;
  }

  .ProseMirror::before {
    display: table;
    content: '';
  }

  .ProseMirror::after {
    display: table;
    clear: both;
    content: '';
  }

  .ProseMirror > *:first-child {
    margin-top: 0 !important;
  }

  .ProseMirror > *:last-child {
    margin-bottom: 0 !important;
  }

  .ProseMirror a:not([href]) {
    color: inherit;
    text-decoration: none;
  }

  .ProseMirror .absent {
    color: var(--color-danger-fg);
  }

  .ProseMirror .anchor {
    float: left;
    padding-right: 4px;
    margin-left: -20px;
    line-height: 1;
  }

  .ProseMirror .anchor:focus {
    outline: none;
  }

  .ProseMirror p,
  .ProseMirror blockquote,
  .ProseMirror ul,
  .ProseMirror ol,
  .ProseMirror dl,
  .ProseMirror table,
  .ProseMirror pre,
  .ProseMirror details {
    margin-top: 0;
    margin-bottom: 16px;
  }

  .ProseMirror blockquote > :first-child {
    margin-top: 0;
  }

  .ProseMirror blockquote > :last-child {
    margin-bottom: 0;
  }

  .ProseMirror sup > a::before {
    content: '[';
  }

  .ProseMirror sup > a::after {
    content: ']';
  }

  .ProseMirror h1 .octicon-link,
  .ProseMirror h2 .octicon-link,
  .ProseMirror h3 .octicon-link,
  .ProseMirror h4 .octicon-link,
  .ProseMirror h5 .octicon-link,
  .ProseMirror h6 .octicon-link {
    color: var(--color-fg-default);
    vertical-align: middle;
    visibility: hidden;
  }

  .ProseMirror h1:hover .anchor,
  .ProseMirror h2:hover .anchor,
  .ProseMirror h3:hover .anchor,
  .ProseMirror h4:hover .anchor,
  .ProseMirror h5:hover .anchor,
  .ProseMirror h6:hover .anchor {
    text-decoration: none;
  }

  .ProseMirror h1:hover .anchor .octicon-link,
  .ProseMirror h2:hover .anchor .octicon-link,
  .ProseMirror h3:hover .anchor .octicon-link,
  .ProseMirror h4:hover .anchor .octicon-link,
  .ProseMirror h5:hover .anchor .octicon-link,
  .ProseMirror h6:hover .anchor .octicon-link {
    visibility: visible;
  }

  .ProseMirror h1 tt,
  .ProseMirror h1 code,
  .ProseMirror h2 tt,
  .ProseMirror h2 code,
  .ProseMirror h3 tt,
  .ProseMirror h3 code,
  .ProseMirror h4 tt,
  .ProseMirror h4 code,
  .ProseMirror h5 tt,
  .ProseMirror h5 code,
  .ProseMirror h6 tt,
  .ProseMirror h6 code {
    padding: 0 0.2em;
    font-size: inherit;
  }

  .ProseMirror ul.no-list,
  .ProseMirror ol.no-list {
    padding: 0;
    list-style-type: none;
  }

  .ProseMirror ol[type='1'] {
    list-style-type: decimal;
  }

  .ProseMirror ol[type='a'] {
    list-style-type: lower-alpha;
  }

  .ProseMirror ol[type='i'] {
    list-style-type: lower-roman;
  }

  .ProseMirror div > ol:not([type]) {
    list-style-type: decimal;
  }

  .ProseMirror ul ul,
  .ProseMirror ul ol,
  .ProseMirror ol ol,
  .ProseMirror ol ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  .ProseMirror li > p {
    margin-top: 16px;
    margin-bottom: 0;
  }

  .ProseMirror li > p:first-child {
    margin-top: 0;
    margin-bottom: 0;
  }

  .ProseMirror li + li {
    margin-top: 0.25em;
  }

  .ProseMirror dl {
    padding: 0;
  }

  .ProseMirror dl dt {
    padding: 0;
    margin-top: 16px;
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
  }

  .ProseMirror dl dd {
    padding: 0 16px;
    margin-bottom: 16px;
  }

  .ProseMirror table th {
    font-weight: 600;
  }

  .ProseMirror table th,
  .ProseMirror table td {
    padding: 6px 13px;
    border: 1px solid var(--color-border-default);
  }

  .ProseMirror table tr {
    background-color: var(--color-canvas-default);
    border-top: 1px solid var(--color-border-muted);
  }

  .ProseMirror table tr:nth-child(2n) {
    background-color: var(--color-canvas-subtle);
  }

  .ProseMirror code,
  .ProseMirror tt {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: var(--color-neutral-muted);
    border-radius: 6px;
  }

  .ProseMirror code br,
  .ProseMirror tt br {
    display: none;
  }

  .ProseMirror del code {
    text-decoration: inherit;
  }

  .ProseMirror pre code {
    font-size: 100%;
  }

  .ProseMirror pre > code {
    padding: 0;
    margin: 0;
    word-break: normal;
    white-space: pre;
    background: transparent;
    border: 0;
  }

  .ProseMirror .highlight pre {
    margin-bottom: 0;
    word-break: normal;
  }

  .ProseMirror .highlight pre,
  .ProseMirror pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: var(--color-canvas-subtle);
    border-radius: 6px;
  }

  .ProseMirror pre code,
  .ProseMirror pre tt {
    display: inline;
    max-width: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: transparent;
    border: 0;
  }
</style>
