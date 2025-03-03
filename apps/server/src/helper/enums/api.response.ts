export enum ApiResponseCodeEnum {
  /** 成功 */
  SUCCESS = 20000,
  /** 更新成功 */
  UPDATE = 20001,
  /** 创建成功 */
  CREATED = 20100,
  NOCONTENT = 20400,

  BADREQUEST = 40000,
  /** 新密码与旧密码一致 */
  BADREQUEST_OLD_NEW_PWD = 40099,

  UNAUTHORIZED = 40100,
  /** 验证码过期 */
  UNAUTHORIZED_CAPTCHA_EXPIRE = 40101,
  /** 验证码输入有误 */
  UNAUTHORIZED_CAPTCHA_ERROR = 40102,
  /** 无法获取 Session信息 */
  UNAUTHORIZED_NOTFOUND_SESSION = 40103,
  /** access_token 过期 */
  UNAUTHORIZED_ACCESS_TOKEN = 40104,
  /** refresh_token 过期 */
  UNAUTHORIZED_REFRESH_TOKEN = 40105,
  /** 用户名或密码错误 */
  UNAUTHORIZED_UNAME_OR_PWD_NOMATCH = 40106,
  /** 修改密码 旧密码错误 */
  UNAUTHORIZED_OLD_PWD = 40107,

  /** 权限不足 */
  FORBIDDEN = 40300,
  FORBIDDEN_USER = 40301,
  FORBIDDEN_ROLE = 40302,
  FORBIDDEN_PERMISSION = 40303,
  /** 账号被锁定 */
  FORBIDDEN_USER_DISABLED = 40399,

  NOTFOUND = 40400,
  /** 未找到用户 */
  NOTFOUND_USER = 40401,
  /** 未找到角色 */
  NOTFOUND_ROLE = 40402,

  /** 操作冲突 */
  CONFLICT = 40900,

  PAYLOAD_TOO_LARGE = 41300,
  /** 文件上传过大 */
  FILE_TOO_LARGE = 41301,

  INTERNALSERVERERROR = 50000,
  /** 数据库 查询操作失败 */
  INTERNALSERVERERROR_SQL_FIND = 50001,
  /** 数据库 创建操作失败 */
  INTERNALSERVERERROR_SQL_CREATED = 50002,
  /** 数据库 更新操作失败 */
  INTERNALSERVERERROR_SQL_UPDATE = 50003,
  /** 数据库 删除操作失败 */
  INTERNALSERVERERROR_SQL_DELETE = 50004,

  /** Redis 操作失败 */
  INTERNALSERVERERROR_REDIS = 50050,

  /** 云存储操作失败 */
  INTERNALSERVERERROR_COS = 50060,
}

export const ApiResponseMessageEnum = {
  [ApiResponseCodeEnum.SUCCESS]: '操作成功',
  [ApiResponseCodeEnum.UPDATE]: '更新成功',
  [ApiResponseCodeEnum.CREATED]: '创建成功',
  [ApiResponseCodeEnum.NOCONTENT]: '没有内容',
  [ApiResponseCodeEnum.BADREQUEST]: '客户端请求错误',
  [ApiResponseCodeEnum.UNAUTHORIZED]: '未授权访问',
  [ApiResponseCodeEnum.FORBIDDEN]: '权限不足!禁止访问',
  [ApiResponseCodeEnum.NOTFOUND]: '资源不存在',
  [ApiResponseCodeEnum.NOTFOUND_USER]: '未找到相关用户信息',
  [ApiResponseCodeEnum.INTERNALSERVERERROR]: '服务器内部错误',
}

export enum ResponseMessageEnum {
  TRUE = 'Success',
  FALSE = 'Failed',
}
