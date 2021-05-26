import { MarkSpec, Schema } from 'prosemirror-model'
import { nodes, marks } from 'prosemirror-schema-basic'

const underline: MarkSpec = {
  parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
  toDOM: () => ['span', { style: 'text-decoration:underline' }, 0],
}

export const schema = new Schema({ nodes, marks: { ...marks, underline } })
