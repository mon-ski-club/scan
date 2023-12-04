import { EnvironmentProps } from './environment.type'

export const environment: EnvironmentProps = {
  name: 'production',
  user: 'admin',
  password: 'secret',
  url: `http://${window.location.hostname}:5984`,
}
