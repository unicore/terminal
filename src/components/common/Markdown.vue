<template>
  <div class="markdown-root">
    <VueMarkdown :source="props.text" />
  </div>
</template>

<script setup lang="ts">
  import VueMarkdown from 'vue-markdown-render'

  const props = defineProps<{
    text: string
  }>()
</script>

<style lang="scss">
  .markdown-root {
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
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    word-wrap: break-word;
  }

  .markdown-root details,
  .markdown-root figcaption,
  .markdown-root figure {
    display: block;
  }

  .markdown-root summary {
    display: list-item;
  }

  .markdown-root [hidden] {
    display: none !important;
  }

  .markdown-root a {
    background-color: transparent;
    color: var(--color-accent-fg);
    text-decoration: none;
  }

  .markdown-root a:active,
  .markdown-root a:hover {
    outline-width: 0;
  }

  .markdown-root abbr[title] {
    border-bottom: none;
    text-decoration: underline dotted;
  }

  .markdown-root b,
  .markdown-root strong {
    font-weight: 600;
  }

  .markdown-root dfn {
    font-style: italic;
  }

  .markdown-root h1 {
    margin: 0.67em 0;
    font-weight: 600;
    padding-bottom: 0.3em;
    font-size: 2em;
    border-bottom: 1px solid var(--color-border-muted);
  }

  .markdown-root mark {
    background-color: var(--color-attention-subtle);
    color: var(--color-text-primary);
  }

  .markdown-root small {
    font-size: 90%;
  }

  .markdown-root sub,
  .markdown-root sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  .markdown-root sub {
    bottom: -0.25em;
  }

  .markdown-root sup {
    top: -0.5em;
  }

  .markdown-root img {
    border-style: none;
    max-width: 100%;
    box-sizing: content-box;
    background-color: var(--color-canvas-default);
  }

  .markdown-root code,
  .markdown-root kbd,
  .markdown-root pre,
  .markdown-root samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  .markdown-root figure {
    margin: 1em 40px;
  }

  .markdown-root hr {
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

  .markdown-root input {
    font: inherit;
    margin: 0;
    overflow: visible;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .markdown-root [type='button'],
  .markdown-root [type='reset'],
  .markdown-root [type='submit'] {
    -webkit-appearance: button;
  }

  .markdown-root [type='button']::-moz-focus-inner,
  .markdown-root [type='reset']::-moz-focus-inner,
  .markdown-root [type='submit']::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  .markdown-root [type='button']:-moz-focusring,
  .markdown-root [type='reset']:-moz-focusring,
  .markdown-root [type='submit']:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  .markdown-root [type='checkbox'],
  .markdown-root [type='radio'] {
    box-sizing: border-box;
    padding: 0;
  }

  .markdown-root [type='number']::-webkit-inner-spin-button,
  .markdown-root [type='number']::-webkit-outer-spin-button {
    height: auto;
  }

  .markdown-root [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  .markdown-root [type='search']::-webkit-search-cancel-button,
  .markdown-root [type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  .markdown-root ::-webkit-input-placeholder {
    color: inherit;
    opacity: 0.54;
  }

  .markdown-root ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  .markdown-root a:hover {
    text-decoration: underline;
  }

  .markdown-root hr::before {
    display: table;
    content: '';
  }

  .markdown-root hr::after {
    display: table;
    clear: both;
    content: '';
  }

  .markdown-root table {
    border-spacing: 0;
    border-collapse: collapse;
    display: block;
    width: max-content;
    max-width: 100%;
    overflow: auto;
  }

  .markdown-root td,
  .markdown-root th {
    padding: 0;
  }

  .markdown-root details summary {
    cursor: pointer;
  }

  .markdown-root details:not([open]) > *:not(summary) {
    display: none !important;
  }

  .markdown-root kbd {
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

  .markdown-root h1,
  .markdown-root h2,
  .markdown-root h3,
  .markdown-root h4,
  .markdown-root h5,
  .markdown-root h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  .markdown-root h2 {
    font-weight: 600;
    padding-bottom: 0.3em;
    font-size: 1.5em;
    border-bottom: 1px solid var(--color-border-muted);
  }

  .markdown-root h3 {
    font-weight: 600;
    font-size: 1.25em;
  }

  .markdown-root h4 {
    font-weight: 600;
    font-size: 1em;
  }

  .markdown-root h5 {
    font-weight: 600;
    font-size: 0.875em;
  }

  .markdown-root h6 {
    font-weight: 600;
    font-size: 0.85em;
    color: var(--color-fg-muted);
  }

  .markdown-root p {
    margin-top: 0;
    margin-bottom: 10px !important;
  }

  .markdown-root blockquote {
    margin: 0;
    padding: 0 1em;
    color: var(--color-fg-muted);
    border-left: 0.25em solid var(--color-border-default);
  }

  .markdown-root ul,
  .markdown-root ol {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 2em;
  }

  .markdown-root ul {
    list-style-type: disc;
  }

  .markdown-root ol {
    list-style-type: decimal;
  }

  .markdown-root ol ol,
  .markdown-root ul ol {
    list-style-type: lower-roman;
  }

  .markdown-root ul ul ol,
  .markdown-root ul ol ol,
  .markdown-root ol ul ol,
  .markdown-root ol ol ol {
    list-style-type: lower-alpha;
  }

  .markdown-root dd {
    margin-left: 0;
  }

  .markdown-root tt,
  .markdown-root code {
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 12px;
  }

  .markdown-root pre {
    margin-top: 0;
    margin-bottom: 0;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 12px;
    word-wrap: normal;
  }

  .markdown-root g-emoji {
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1em;
    font-style: normal !important;
    font-weight: 400;
    line-height: 1;
    vertical-align: -0.075em;
  }

  .markdown-root g-emoji img {
    width: 1em;
    height: 1em;
  }

  .markdown-root::before {
    display: table;
    content: '';
  }

  .markdown-root::after {
    display: table;
    clear: both;
    content: '';
  }

  .markdown-root > *:first-child {
    margin-top: 0 !important;
  }

  .markdown-root > *:last-child {
    margin-bottom: 0 !important;
  }

  .markdown-root a:not([href]) {
    color: inherit;
    text-decoration: none;
  }

  .markdown-root .absent {
    color: var(--color-danger-fg);
  }

  .markdown-root .anchor {
    float: left;
    padding-right: 4px;
    margin-left: -20px;
    line-height: 1;
  }

  .markdown-root .anchor:focus {
    outline: none;
  }

  .markdown-root p,
  .markdown-root blockquote,
  .markdown-root ul,
  .markdown-root ol,
  .markdown-root dl,
  .markdown-root table,
  .markdown-root pre,
  .markdown-root details {
    margin-top: 0;
    margin-bottom: 16px;
  }

  .markdown-root blockquote > :first-child {
    margin-top: 0;
  }

  .markdown-root blockquote > :last-child {
    margin-bottom: 0;
  }

  .markdown-root sup > a::before {
    content: '[';
  }

  .markdown-root sup > a::after {
    content: ']';
  }

  .markdown-root h1 .octicon-link,
  .markdown-root h2 .octicon-link,
  .markdown-root h3 .octicon-link,
  .markdown-root h4 .octicon-link,
  .markdown-root h5 .octicon-link,
  .markdown-root h6 .octicon-link {
    color: var(--color-fg-default);
    vertical-align: middle;
    visibility: hidden;
  }

  .markdown-root h1:hover .anchor,
  .markdown-root h2:hover .anchor,
  .markdown-root h3:hover .anchor,
  .markdown-root h4:hover .anchor,
  .markdown-root h5:hover .anchor,
  .markdown-root h6:hover .anchor {
    text-decoration: none;
  }

  .markdown-root h1:hover .anchor .octicon-link,
  .markdown-root h2:hover .anchor .octicon-link,
  .markdown-root h3:hover .anchor .octicon-link,
  .markdown-root h4:hover .anchor .octicon-link,
  .markdown-root h5:hover .anchor .octicon-link,
  .markdown-root h6:hover .anchor .octicon-link {
    visibility: visible;
  }

  .markdown-root h1 tt,
  .markdown-root h1 code,
  .markdown-root h2 tt,
  .markdown-root h2 code,
  .markdown-root h3 tt,
  .markdown-root h3 code,
  .markdown-root h4 tt,
  .markdown-root h4 code,
  .markdown-root h5 tt,
  .markdown-root h5 code,
  .markdown-root h6 tt,
  .markdown-root h6 code {
    padding: 0 0.2em;
    font-size: inherit;
  }

  .markdown-root ul.no-list,
  .markdown-root ol.no-list {
    padding: 0;
    list-style-type: none;
  }

  .markdown-root ol[type='1'] {
    list-style-type: decimal;
  }

  .markdown-root ol[type='a'] {
    list-style-type: lower-alpha;
  }

  .markdown-root ol[type='i'] {
    list-style-type: lower-roman;
  }

  .markdown-root div > ol:not([type]) {
    list-style-type: decimal;
  }

  .markdown-root ul ul,
  .markdown-root ul ol,
  .markdown-root ol ol,
  .markdown-root ol ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  .markdown-root li > p {
    margin-top: 16px;
    margin-bottom: 0;
  }

  .markdown-root li > p:first-child {
    margin-top: 0;
    margin-bottom: 0;
  }

  .markdown-root li + li {
    margin-top: 0.25em;
  }

  .markdown-root dl {
    padding: 0;
  }

  .markdown-root dl dt {
    padding: 0;
    margin-top: 16px;
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
  }

  .markdown-root dl dd {
    padding: 0 16px;
    margin-bottom: 16px;
  }

  .markdown-root table th {
    font-weight: 600;
  }

  .markdown-root table th,
  .markdown-root table td {
    padding: 6px 13px;
    border: 1px solid var(--color-border-default);
  }

  .markdown-root table tr {
    background-color: var(--color-canvas-default);
    border-top: 1px solid var(--color-border-muted);
  }

  .markdown-root table tr:nth-child(2n) {
    background-color: var(--color-canvas-subtle);
  }

  .markdown-root code,
  .markdown-root tt {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: var(--color-neutral-muted);
    border-radius: 6px;
  }

  .markdown-root code br,
  .markdown-root tt br {
    display: none;
  }

  .markdown-root del code {
    text-decoration: inherit;
  }

  .markdown-root pre code {
    font-size: 100%;
  }

  .markdown-root pre > code {
    padding: 0;
    margin: 0;
    word-break: normal;
    white-space: pre;
    background: transparent;
    border: 0;
  }

  .markdown-root .highlight pre {
    margin-bottom: 0;
    word-break: normal;
  }

  .markdown-root .highlight pre,
  .markdown-root pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: var(--color-canvas-subtle);
    border-radius: 6px;
  }

  .markdown-root pre code,
  .markdown-root pre tt {
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
