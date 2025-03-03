// export interface CommentItem extends Comment {
//   replyData: Comment[]
//   replyCount: number
// }

import type { Moment } from './data'

export interface MomentItem extends Moment {
  commentVisible: boolean
}
