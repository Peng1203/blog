export interface UserParams {
  userName: string
  password?: string
  roleIds: number[]
  email?: string
  nickName: string
  userEnabled: number | 0 | 1
  userAvatar: string
}
