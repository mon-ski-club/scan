import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { addRxPlugin } from 'rxdb'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { EnvironmentProps } from './environment.type'

export const environment: EnvironmentProps = {
  // Current environment
  NODE_ENV: 'production',

  // Database config
  DATABASE: {
    name: 'scan-prod',
    multiInstances: true,
    realTimeReplications: true,
    credentials: {
      name: 'admin',
      password: 'secret',
    },
    rxdbSyncUrl: `http://${window.location.hostname}:5984`,
    addRxDBPlugins() {
      addRxPlugin(RxDBDevModePlugin)
      addRxPlugin(RxDBLeaderElectionPlugin)
      addRxPlugin(RxDBQueryBuilderPlugin)
    },
    getRxStorage() {
      return wrappedValidateAjvStorage({
        storage: getRxStorageDexie(),
      })
    },
  },
}
