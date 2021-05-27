import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model'
import { nodes, marks } from 'prosemirror-schema-basic'

interface Attrs {
  type: string
  start?: number
}

const italic: MarkSpec = {
  parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
  toDOM: () => ['i', 0],
}

const underline: MarkSpec = {
  parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
  toDOM: () => ['span', { style: 'text-decoration:underline' }, 0],
}

const list: NodeSpec = {
  attrs: {
    type: { default: 'ordered' }, // 'ordered', 'bullet', 'simple'
    start: { default: 1 }, // for ordered lists
  },
  group: 'block list',
  content: 'listItem+',
  parseDOM: [
    {
      tag: 'ol',
      // @ts-ignore
      getAttrs: (element: HTMLOListElement): Attrs => {
        const start = element.getAttribute('start')

        return {
          type: 'ordered',
          start: start === null ? 1 : Number(start),
        }
      },
    },
    { tag: 'ul.simple', getAttrs: () => ({ type: 'simple' }) },
    { tag: 'ul', getAttrs: () => ({ type: 'bullet' }) },
  ],
  toDOM: (node) => {
    const { type, start } = node.attrs as Attrs

    switch (type) {
      case 'ordered':
        return ['ol', { start: start === 1 ? undefined : String(start) }, 0]

      case 'simple':
        return ['ul', { class: 'simple' }, 0]

      case 'bullet':
      default:
        return ['ul', 0]
    }
  },
}

const listItem: NodeSpec = {
  content: 'paragraph block*', // 'block+',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM: () => ['li', 0],
}

const doc: NodeSpec = {
  content: 'block+',
}

const lineBreak: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM: () => ['br'],
}

const paragraph: NodeSpec = {
  group: 'block',
  content: 'inline*',
  parseDOM: [{ tag: 'p' }],
  toDOM: () => ['p', 0],
}

const text: NodeSpec = {
  group: 'inline',
}

const heading: NodeSpec = {
  attrs: {
    level: { default: 1 },
  },
  group: 'block heading',
  content: 'inline*',
  marks: 'italic',
  defining: true,
  parseDOM: [
    { tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    { tag: 'h3', attrs: { level: 3 } },
    { tag: 'h4', attrs: { level: 4 } },
    { tag: 'h5', attrs: { level: 5 } },
    { tag: 'h6', attrs: { level: 6 } },
  ],
  toDOM: (node) => [`h${String(node.attrs.level)}`, 0],
}

const horizontalRule: NodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM: () => ['hr'],
}

const blockquote: NodeSpec = {
  attrs: {
    cite: { default: null },
  },
  content: 'block+',
  group: 'block',
  defining: true,
  parseDOM: [
    {
      tag: 'blockquote',
      // @ts-ignore
      getAttrs: (element: HTMLElement) => ({
        cite: element.getAttribute('cite'),
      }),
    },
  ],
  toDOM: (node) => {
    const { cite } = node.attrs as { cite?: string }

    return ['blockquote', { cite }, 0]
  },
}

export const schema = new Schema({
  marks: { ...marks, underline, italic },
  nodes: {
    ...nodes,
    list,
    listItem,
    doc,
    lineBreak,
    paragraph,
    text,
    heading,
    horizontalRule,
    blockquote,
  },
})
