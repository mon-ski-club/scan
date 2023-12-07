import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb'
import { Identifiable } from '../database/identifiable'

export interface Person extends Identifiable {
  firstName: string
  lastName: string
  gender: string
  birthDate: Date
  address: string
  zip: string
  city: string
  email: string
  phone1: string
  phone2: string
  archived: boolean
}

export const PERSON_SCHEMA: RxJsonSchema<Person> = {
  title: 'Person Schema',
  description: 'Schema of a single person',
  version: 0,
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
}

export type PersonDocument = RxDocument<Person>
export type PersonCollection = RxCollection<Person>
