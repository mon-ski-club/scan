import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb'
import { Event } from '../event/event'

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
type EventDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof typedJsonSchema
>

interface EventOrmMethods {}

export const EVENT_SCHEMA: RxJsonSchema<EventDocType> = EVENT_SCHEMA_LITERAL
export type EventDocument = RxDocument<Event, EventOrmMethods>
export type EventCollection = RxCollection<Event, EventOrmMethods, {}>
