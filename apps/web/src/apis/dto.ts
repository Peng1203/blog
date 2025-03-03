import type { Comment } from '@/types/data'

type BaseCommentAttr =
  | 'name'
  | 'userId'
  | 'email'
  | 'content'
  | 'avatar'
  | 'type'
  | 'targetId'
  | 'replyId'
  | 'parentId'
  | 'blogUrl'

export type AddCommentDto = Pick<Comment, BaseCommentAttr>

export interface ReplyToReplyParams {
  /** 提交的评论数据 */
  form: AddCommentDto
  /** 被回复的评论对象 */
  replyTo: Comment
}
