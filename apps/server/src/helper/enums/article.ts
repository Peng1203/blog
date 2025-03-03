/**
 * 文章类型枚举
 */
export enum ArticleTypeEnum {
  /** 原创 */
  ORIGINAL = 1,
  /** 转载 */
  REPRINT = 2,
  /** 翻译 */
  TRANSLATE = 3,
}

/**
 * 文章类型状态枚举
 */
export enum ArticleTypeStateEnum {
  /** 全部 */
  ALL = 0,
  /** 原创 */
  ORIGINAL = 1,
  /** 转载 */
  REPRINT = 2,
  /** 翻译 */
  TRANSLATE = 3,
}

/**
 * 文章状态枚举
 */
export enum ArticleStatusEnum {
  /** 已发布 */
  PUBLISHED = 1,
  /** 私密 */
  PRIVATE = 2,
  /** 草稿箱 */
  DRAFT = 3,
  /** 已删除 */
  DELETED = 4,
  /** 待审核 */
  PENDING_REVIEW = 5,
  /** 已拒绝 */
  REJECTED = 6,
}

/**
 * 文章状态 状态信息枚举
 */
export enum ArticleStatusStateEnum {
  /** 全部 */
  ALL = 0,
  /** 已发布 */
  PUBLISHED = 1,
  /** 私密 */
  PRIVATE = 2,
  /** 草稿箱 */
  DRAFT = 3,
  /** 已删除 */
  DELETED = 4,
  /** 待审核 */
  PENDING_REVIEW = 5,
  /** 已拒绝 */
  REJECTED = 6,
}

/**
 * 文章内容 模式
 */
export enum ContentModelEnum {
  /** markdown 内容 */
  MARKDOWN = 0,
  /** 富文本 内容 */
  RICHTEXT = 1,
}
