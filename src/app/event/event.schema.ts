import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb'

const EVENT_SCHEMA_LITERAL = {
  title: 'event schema',
  description: '',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    name: { type: 'string', maxLength: 100 },
    description: { type: 'string' },
    date: { type: 'string', format: 'date', maxLength: 100 },
    cancelled: { type: 'boolean' },
    // image: => attachment
    // options: {},
    // registrations: {},
    // location: { type: 'string' },
    // archived: { type: 'boolean' }
  },
  required: ['id', 'name', 'date'],
  indexes: ['name', 'date'],
} as const

const typedJsonSchema = toTypedRxJsonSchema(EVENT_SCHEMA_LITERAL)

export type Event = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof typedJsonSchema
>

export const EVENT_SCHEMA: RxJsonSchema<Event> = EVENT_SCHEMA_LITERAL
