import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb'
import { Person } from './person'

const PERSON_SCHEMA_LITERAL = {
  title: 'person schema',
  description: '',
  version: 0,
  // keyCompression: true,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    firstName: { type: 'string', maxLength: 100 },
    lastName: { type: 'string', maxLength: 100 },
    gender: { type: 'string' },
    birthDate: { type: 'string', format: 'date' },
    address: { type: 'string' },
    zip: { type: 'string' },
    city: { type: 'string' },
    email: { type: 'string' },
    phone1: { type: 'string' },
    phone2: { type: 'string' },
    archived: { type: 'boolean' },
  },
  required: ['id', 'firstName', 'lastName'],
  indexes: [
    'firstName',
    'lastName',
    ['lastName', 'firstName'],
    ['firstName', 'lastName'],
  ],
} as const

const typedJsonSchema = toTypedRxJsonSchema(PERSON_SCHEMA_LITERAL)
type PersonDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof typedJsonSchema
>

type PersonOrmMethods = {}

export const PERSON_SCHEMA: RxJsonSchema<Person> = PERSON_SCHEMA_LITERAL
export type PersonDocument = RxDocument<Person, PersonOrmMethods>
export type PersonCollection = RxCollection<Person, PersonOrmMethods, {}>
