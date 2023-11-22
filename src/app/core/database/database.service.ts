import {} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { createRxDatabase } from 'rxdb'
import {
  replicateCouchDB,
  getFetchWithCouchDBAuthorization,
} from 'rxdb/plugins/replication-couchdb'
import { v4 as uuid } from 'uuid'
import { environment } from '../../../environments/environment'
import {
  APP_COLLECTIONS,
  AppCollections,
  AppDatabase,
  AppSchemas,
} from '../../../environments/environment.type'

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  /**
   * Initialize RxDB Database
   */
  async initializeDatabase() {
    /* Plugins */
    environment.DATABASE.addRxDBPlugins()

    /* Creation */
    const database = await this.createRxDBDatabase()

    /* DevTools */
    this.addDevTools({ database })

    /* Authentication */
    const isAuthenticated = await this.authenticateCouchDB()

    /* AuthGuard */
    if (isAuthenticated) {
      /* Collections */
      await this.addRxDBCollections({ database })

      /* Middlewares */
      this.applyMiddleWares({ database })

      /* Synchronization */
      // TODO LOG GENERIC
      this.synchronizeCouchDB({ database, collectionName: 'events' })
      this.synchronizeCouchDB({ database, collectionName: 'persons' })
    }

    /* Reinitialization */
    /* await reinitializeIndexedDB() */
  }

  /**
   * Create RxDB Database
   */
  private async createRxDBDatabase(): Promise<AppDatabase> {
    console.debug('Creating database...')

    const database = await createRxDatabase<AppCollections>({
      name: environment.DATABASE.name,
      storage: environment.DATABASE.getRxStorage(),
      multiInstance: environment.DATABASE.multiInstance,
    })
    console.debug(`Database >>> ${database.name} <<< created !`)

    return database
  }

  /**
   * Add DevTools
   */
  private addDevTools({ database }: { database: AppDatabase }) {
    if (environment.NODE_ENV === 'development') {
      /**
       * Allow to interact with CouchDB Database within the browser console.
       * eg. window.database.insert({...})
       */
      ;(window as any)['database'] = database // eslint-disable-line @typescript-eslint/no-explicit-any

      /**
       * Helps identify which instance of RxDB is leader
       * (Add an icon in the browser Tab)
       */
      if (environment.DATABASE.multiInstance) {
        database.waitForLeadership().then(() => {
          document.title = `♛ ${document.title}`
        })
      }
    }
  }

  /**
   * Authenticate CouchDB
   */
  private async authenticateCouchDB(): Promise<boolean> {
    console.debug('Authenticating...')

    const getCouchDB = getFetchWithCouchDBAuthorization(
      environment.DATABASE.credentials.name,
      environment.DATABASE.credentials.password,
    )

    const response = await getCouchDB(
      `${environment.DATABASE.rxdbSyncUrl}/_session`,
    )

    if (!response.ok) {
      console.debug('Authentication failed...')

      return false
    }

    console.debug('Authentication successful !')

    return true
  }

  /**
   * Add RxDB Collections
   */
  private async addRxDBCollections({
    database,
  }: {
    database: AppDatabase
  }): Promise<void> {
    console.debug('Adding collections...')

    await database.addCollections(APP_COLLECTIONS)

    console.debug('Collections added !')
  }

  /**
   * Apply Middlewares
   */
  private applyMiddleWares({ database }: { database: AppDatabase }): void {
    Object.keys(APP_COLLECTIONS).forEach((collection) => {
      database[collection as keyof AppCollections].preInsert(
        (test: AppSchemas[keyof AppCollections]) => {
          test.id = uuid()
        },
        false,
      )
    })
  }

  /**
   * Synchronize CouchDB
   */
  private synchronizeCouchDB({
    database,
    collectionName,
  }: {
    database: AppDatabase
    collectionName: keyof AppCollections
  }): void {
    const collection = database[collectionName]

    const onGoingReplication = replicateCouchDB({
      url: `${environment.DATABASE.rxdbSyncUrl}/${collectionName}/`,
      collection: collection,
      live: environment.DATABASE.realTimeReplication,
      fetch: getFetchWithCouchDBAuthorization(
        environment.DATABASE.credentials.name,
        environment.DATABASE.credentials.password,
      ),
      pull: {},
      push: {},
    })

    onGoingReplication.error$.subscribe(({ parameters: { errors } }) => {
      console.error(
        errors &&
          `Synchronization failed for ${collectionName} : ${
            errors?.[0]?.parameters?.args.jsonResponse.reason ??
            'Unknown error.'
          } Retrying in ${onGoingReplication.retryTime * 0.001}s...`,
      )
    })

    console.debug(`Synchronization is now active for : ${collectionName} !`)
  }

  /**
   * Reinitialize IndexedDB
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async reinitializeIndexedDBs() {
    if (environment.NODE_ENV !== 'development') {
      return
    }

    console.debug('Reinitializing IndexedDB databases...')

    const databases = await indexedDB.databases()

    databases.forEach(async (database) => {
      if (!database.name) {
        return
      }
      indexedDB.deleteDatabase(database.name)
    })

    console.debug('IndexedDB databases reinitialized !')
  }
}
