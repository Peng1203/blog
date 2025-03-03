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

export enum RequestMethodEnum {
  GET = 1,
  POST = 2,
  PUT = 3,
  DELETE = 4,
  PATCH = 5,
}

export const PERMISSION_DATA = [
  {
    permissionName: '用户管理',
    permissionCode: PermissionEnum.USER_PARENT,
    children: [
      {
        permissionName: '创建用户',
        permissionCode: PermissionEnum.CREATE_USER,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/user',
      },
      {
        permissionName: '更新用户',
        permissionCode: PermissionEnum.UPDATE_USER,
        resourceMethod: RequestMethodEnum.PATCH,
        resourceUrl: '/user/:id',
      },
      {
        permissionName: '删除用户',
        permissionCode: PermissionEnum.DELETE_USER,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/user/:id',
      },
    ],
  },
  {
    permissionName: '角色管理',
    permissionCode: PermissionEnum.ROLE_PARENT,
    children: [
      {
        permissionName: '创建角色',
        permissionCode: PermissionEnum.CREATE_ROLE,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/user',
      },
      {
        permissionName: '更新角色',
        permissionCode: PermissionEnum.UPDATE_ROLE,
        resourceMethod: RequestMethodEnum.PATCH,
        resourceUrl: '/role/:id',
      },
      {
        permissionName: '删除角色',
        permissionCode: PermissionEnum.DELETE_ROLE,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/role/:id',
      },
    ],
  },
  {
    permissionName: '菜单管理',
    permissionCode: PermissionEnum.MENU_PARENT,
    children: [
      {
        permissionName: '创建菜单',
        permissionCode: PermissionEnum.CREATE_MENU,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/menu',
      },
      {
        permissionName: '更新菜单',
        permissionCode: PermissionEnum.UPDATE_MENU,
        resourceMethod: RequestMethodEnum.PATCH,
        resourceUrl: '/menu/:id',
      },
      {
        permissionName: '删除菜单',
        permissionCode: PermissionEnum.DELETE_MENU,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/menu/:id',
      },
      {
        permissionName: '初始化菜单',
        permissionCode: PermissionEnum.INIT_MENU,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/menu/init',
      },
    ],
  },
  {
    permissionName: '权限标识管理',
    permissionCode: PermissionEnum.PERMISSION_PARENT,
    children: [
      {
        permissionName: '创建权限标识',
        permissionCode: PermissionEnum.CREATE_PERMISSION,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/permission',
      },
      {
        permissionName: '更新权限标识',
        permissionCode: PermissionEnum.UPDATE_PERMISSION,
        resourceMethod: RequestMethodEnum.PATCH,
        resourceUrl: '/permission/:id',
      },
      {
        permissionName: '删除权限标识',
        permissionCode: PermissionEnum.DELETE_PERMISSION,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/permission/:id',
      },
      {
        permissionName: '初始化权限标识',
        permissionCode: PermissionEnum.INIT_PERMISSION,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/permission/:id',
      },
    ],
  },
  {
    permissionName: '文章标签管理',
    permissionCode: PermissionEnum.TAG_PARENT,

    children: [
      {
        permissionName: '创建标签',
        permissionCode: PermissionEnum.CREATE_TAG,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/tag',
      },
      {
        permissionName: '删除标签',
        permissionCode: PermissionEnum.DELETE_TAG,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/tag/:id',
      },
      {
        permissionName: '更新标签',
        permissionCode: PermissionEnum.UPDATE_TAG,
        resourceMethod: RequestMethodEnum.PATCH,
        resourceUrl: '/tag/:id',
      },
    ],
  },
  {
    permissionName: '文章分类管理',
    permissionCode: PermissionEnum.CATEGORY_PARENT,
    children: [
      {
        permissionName: '创建分类',
        permissionCode: PermissionEnum.CREATE_CATEGORY,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/category',
      },
      {
        permissionName: '删除分类',
        permissionCode: PermissionEnum.DELETE_CATEGORY,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/category/:id',
      },
      {
        permissionName: '更新分类',
        permissionCode: PermissionEnum.UPDATE_CATEGORY,
        resourceMethod: RequestMethodEnum.PATCH,
        resourceUrl: '/category/:id',
      },
    ],
  },
  {
    permissionName: '日志管理',
    permissionCode: PermissionEnum.AUDIT_LOG_PARENT,
    children: [
      {
        permissionName: '获取审计日志',
        permissionCode: PermissionEnum.GET_AUDIT_LOG,
        resourceMethod: RequestMethodEnum.GET,
        resourceUrl: '/audit',
      },
      {
        permissionName: '删除审计日志',
        permissionCode: PermissionEnum.DELETE_AUDIT_LOG,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/audit',
      },
      {
        permissionName: '获取登录日志',
        permissionCode: PermissionEnum.GET_LOGIN_LOG,
        resourceMethod: RequestMethodEnum.GET,
        resourceUrl: '/login/audit',
      },
      {
        permissionName: '删除登录日志',
        permissionCode: PermissionEnum.DELETE_LOGIN_LOG,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/login/audit',
      },
    ],
  },
  {
    permissionName: '文章管理',
    permissionCode: PermissionEnum.ARTICLE_PARENT,
    children: [
      {
        permissionName: '发布文章',
        permissionCode: PermissionEnum.CREATE_ARTICLE,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/article',
      },
    ],
  },
  {
    permissionName: '资源管理',
    permissionCode: PermissionEnum.RESOURCE_PARENT,
    children: [
      {
        permissionName: '上传资源',
        permissionCode: PermissionEnum.UPLOAD_RESOURCE,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/resource',
      },
      {
        permissionName: '删除资源',
        permissionCode: PermissionEnum.DELETE_RESOURCE,
        resourceMethod: RequestMethodEnum.DELETE,
        resourceUrl: '/resource/:fileName',
      },
    ],
  },
  {
    permissionName: '动态管理',
    permissionCode: PermissionEnum.MOMENT_PARENT,
    children: [
      {
        permissionName: '发布动态',
        permissionCode: PermissionEnum.CREATE_MOMENT,
        resourceMethod: RequestMethodEnum.POST,
        resourceUrl: '/moment',
      },
    ],
  },
]
