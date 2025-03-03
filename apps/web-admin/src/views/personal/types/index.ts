export interface Personal {
  userName: string
  nickName: string
  userAvatar: string
  articleCount: number
  categoryCount: number
  tagCount: number
  userId: number
  sign: string
  icp: string
  uv: number
  pv: number
  upTime: string
  email?: string | null
  notice?: string | null
}

export type EditPersionType = Pick<Personal, 'icp' | 'sign' | 'notice'>
