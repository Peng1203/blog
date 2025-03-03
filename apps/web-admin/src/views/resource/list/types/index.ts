// import { ListApiBaseResponse } from 'Api'

export interface ResourceData {
  dev: number
  mode: number
  nlink: number
  uid: number
  gid: number
  rdev: number
  blksize: number
  ino: number
  size: number
  blocks: number
  atimeMs: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
  name: string
  type: string
  mimeType: string | false
  atime: string
  mtime: string
  ctime: string
  birthtime: string
  url: string
}

export interface ResourceListItem extends ResourceData {
  process: number
}

// export type ResourceListData = ListApiBaseResponse<ResourceData>
export type ResourceListData = ResourceData[]
