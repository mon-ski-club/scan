import {} from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  RxDatabase,
  addRxPlugin,
  createRxDatabase,
  RxCollectionCreator,
  removeRxDatabase,
  RxStorage,
} from 'rxdb'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'

import {
  getFetchWithCouchDBAuthorization,
  replicateCouchDB,
} from 'rxdb/plugins/replication-couchdb'
import { v4 as uuid } from 'uuid'
import { environment } from '../../../environments/environment'

import { EVENT_SCHEMA, EventCollection } from '../events/event.schema'
import { PERSON_SCHEMA, PersonCollection } from '../persons/person.schema'

interface Collections {
  events: EventCollection
  persons: PersonCollection
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  collectionCreators: Record<keyof Collections, RxCollectionCreator> = {
    events: {
      schema: EVENT_SCHEMA,
    },
    persons: {
      schema: PERSON_SCHEMA,
    },
  }

  database: RxDatabase<Collections> | null = null
  storage: RxStorage<any, any> | null = null

  async initialize() {
    addRxPlugin(RxDBDevModePlugin)
    addRxPlugin(RxDBLeaderElectionPlugin)
    addRxPlugin(RxDBQueryBuilderPlugin)

    this.storage = wrappedValidateAjvStorage({
      storage: getRxStorageDexie(),
    })

    this.database = await createRxDatabase<Collections>({
      name: environment.name,
      storage: this.storage,
      multiInstance: true,
    })

    this.addDevTools()

    const authenticated = await this.authenticate()
    if (authenticated) {
      await this.database?.addCollections(this.collectionCreators)

      this.installIdGenerators()

      this.replicate('events')
      this.replicate('persons')
    }
  }

  private addDevTools() {
    if (environment.name === 'development') {
      if (this.database) {
        // Allow to interact with CouchDB Database within the browser console.
        // eg. window.database.insert({...})
        ;(window as any)['database'] = this.database // eslint-disable-line @typescript-eslint/no-explicit-any

        // Helps identify which instance of RxDB is leader
        // (Add an icon in the browser Tab)
        this.database.waitForLeadership().then(() => {
          document.title = `♛ ${document.title}`
        })
      }
    }
  }

  private getSecuredFetch() {
    return getFetchWithCouchDBAuthorization(
      environment.user,
      environment.password,
    )
  }

  // TODO remove as authentication is handle at replication level
  private async authenticate(): Promise<boolean> {
    const fetch = this.getSecuredFetch()

    const response = await fetch(`${environment.url}/_session`)
    return response.ok
  }

  private installIdGenerators() {
    const collectionNames = Object.keys(this.collectionCreators)
    collectionNames.forEach((collection) =>
      this.installIdGenerator(collection as keyof Collections),
    )
  }

  private installIdGenerator(collectionName: keyof Collections) {
    if (this.database) {
      this.database[collectionName].preInsert((doc) => (doc.id = uuid()), false)
    }
  }

  private replicate(collectionName: keyof Collections) {
    if (this.database) {
      const collection = this.database[collectionName]

      const replication = replicateCouchDB({
        url: `${environment.url}/${collectionName}/`,
        collection: collection,
        live: true,
        fetch: this.getSecuredFetch(),
        pull: {},
        push: {},
      })

      replication.error$.subscribe(({ parameters: { errors } }) => {
        console.error(
          errors &&
            `Synchronization failed for ${collectionName} : ${
              errors?.[0]?.parameters?.args.jsonResponse.reason ??
              'Unknown error.'
            } Retrying in ${replication.retryTime * 0.001}s...`,
        )
      })
    }
  }

  async reset() {
    if (this.storage) {
      removeRxDatabase(environment.name, this.storage)
    }
  }
}
