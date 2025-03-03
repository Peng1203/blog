export enum StatusEnum {
  FALSE = 0,
  TRUE = 1,
}

export enum BolEnum {
  FALSE = 0,
  TRUE = 1,
}

export enum LoginStatusEnum {
  /** 登录成功 */
  SUCCESS = 1,
  /** 登录失败 未知原因 */
  FAILURE = 2,
  /** 密码错误 */
  INCORRECT_PASSWORD = 3,
  /** 账号不存在 */
  ACCOUNT_NOT_FOUND = 4,
  /** 账号锁定 */
  ACCOUNT_LOCKED = 5,
  /** 账号禁用 */
  ACCOUNT_DISABLED = 6,
  /** 验证码过期 */
  CAPTCHA_EXPIRED = 7,
  /** 验证码错误 */
  CAPTCHA_ERROR = 8,
}

export enum CommentType {
  ARTICLE = 1,
  MOMENT = 2,
}

export enum FindCommentType {
  ALL = 0,
  ARTICLE = 1,
  MOMENT = 2,
}
