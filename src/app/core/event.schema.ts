import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb'
import { Identifiable } from './identifiable'

export interface Event extends Identifiable {
  name: string
  date: Date
  description: string
  cancelled: boolean
  image: string
  location: string
  archived: boolean
}

export const EVENT_SCHEMA: RxJsonSchema<Event> = {
  title: 'Event Schema',
  description: 'Schema of a single event',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 /* UUID v4 standards */ },
    name: { type: 'string', maxLength: 100 },
    date: { type: 'string', format: 'date', maxLength: 100 },
    description: { type: 'string' },
    cancelled: { type: 'boolean' },
    image: { type: 'string' },
    location: { type: 'string' },
    archived: { type: 'boolean' },
  },
  required: ['id', 'name', 'date'],
  indexes: ['name', 'date'],
}

export type EventDocument = RxDocument<Event>
export type EventCollection = RxCollection<Event>
