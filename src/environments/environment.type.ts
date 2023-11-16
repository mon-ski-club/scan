import { RxStorage } from 'rxdb'

export interface EnvironmentProps {
  NODE_ENV: 'development' | 'production'

  DATABASE: {
    name: string
    credentials: {
      name: string
      password: string
    }
    rxdbSyncUrl: `http://${string}:${string}`
    multiInstances: boolean
    realTimeReplications: boolean
    addRxDBPlugins: () => void
    getRxStorage: () => RxStorage<any, any>
  }
}
