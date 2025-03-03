/**
 * 操作权限标识枚举
 */
export enum PermissionEnum {
  TEST = 'test_1',

  /** 用户 */
  USER_PARENT = 'user_parent',
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',

  /** 角色 */
  ROLE_PARENT = 'role_parent',
  CREATE_ROLE = 'create_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',

  /** 菜单 */
  MENU_PARENT = 'menu_parent',
  CREATE_MENU = 'create_menu',
  UPDATE_MENU = 'update_menu',
  DELETE_MENU = 'delete_menu',
  INIT_MENU = 'init_menu',

  /** 权限标识 */
  PERMISSION_PARENT = 'permission_parent',
  GET_PERMISSION = 'get_permission',
  CREATE_PERMISSION = 'create_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',
  INIT_PERMISSION = 'init_permission',

  /** 文章标签 */
  TAG_PARENT = 'tag_parent',
  CREATE_TAG = 'create_tag',
  UPDATE_TAG = 'update_tag',
  DELETE_TAG = 'delete_tag',

  /** 文章分类 */
  CATEGORY_PARENT = 'category_parent',
  CREATE_CATEGORY = 'create_category',
  UPDATE_CATEGORY = 'update_category',
  DELETE_CATEGORY = 'delete_category',

  /** 文章 */
  ARTICLE_PARENT = 'article_parent',
  CREATE_ARTICLE = 'create_article',
  UPDATE_ARTICLE = 'update_article',
  DELETE_ARTICLE = 'delete_article',

  /** 日志管理 */
  AUDIT_LOG_PARENT = 'audit_log_parent',
  GET_AUDIT_LOG = 'get_audit_log',
  DELETE_AUDIT_LOG = 'delete_audit_log',
  GET_LOGIN_LOG = 'get_login_log',
  DELETE_LOGIN_LOG = 'delete_login_log',

  /** 资源管理 */
  RESOURCE_PARENT = 'resource_parent',
  UPLOAD_RESOURCE = 'upload_resource',
  DELETE_RESOURCE = 'delete_resource',

  /** 动态 */
  MOMENT_PARENT = 'moment_parent',
  CREATE_MOMENT = 'create_moment',
}

