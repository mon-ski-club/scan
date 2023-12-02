export interface User {
  name: string
  roles: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export type LoginResponse =
  | ({
      ok: true
    } & (User | null))
  | {
      ok: false
    }

export type VerifySession =
  | ({
      ok: true
    } & {
      userCtx: User
    })
  | {
      ok: false
    }
