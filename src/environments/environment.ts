import { EnvironmentProps } from './environment.type'

export const environment: EnvironmentProps = {
  name: 'development',
  user: 'admin',
  password: 'secret',
  url: `http://${window.location.hostname}:5984`,
}
