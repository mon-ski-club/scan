import { RxCollectionCreator, RxDatabase, RxStorage } from 'rxdb'
import {
  EVENT_SCHEMA,
  Event,
  EventCollection,
} from '../app/core/events/event.schema'
import {
  PERSON_SCHEMA,
  Person,
  PersonCollection,
} from '../app/core/persons/person.schema'

export interface EnvironmentProps {
  NODE_ENV: 'development' | 'production'

  DATABASE: {
    name: string
    credentials: {
      name: string
      password: string
    }
    rxdbSyncUrl: `http://${string}:${string}`
    multiInstance: boolean
    realTimeReplication: boolean
    addRxDBPlugins: () => void
    getRxStorage: () => RxStorage<any, any>
  }
}

export interface AppCollections {
  events: EventCollection
  persons: PersonCollection
}
export interface AppSchemas {
  events: Event
  persons: Person
}

export type AppDatabase = RxDatabase<AppCollections>

export const APP_COLLECTIONS: Record<
  keyof AppCollections,
  RxCollectionCreator
> = {
  events: {
    schema: EVENT_SCHEMA,
  },
  persons: {
    schema: PERSON_SCHEMA,
  },
}
