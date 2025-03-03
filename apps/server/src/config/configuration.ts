// ts文件配置项 会加载到 process.env 中
export default () => ({
  // access_token 有效时间 单位秒
  JWT_ACCESS_TOKEN_EXPIRES_IN: 60 * 60 * 3, // 3小时
  // refresh_token 有效时间 单位秒
  JWT_REFRESH_TOKEN_EXPIRES_IN: 60 * 60 * 24 * 7, // 7天
  // 网盘跟目录
  NETDISK_ROOT_DIR: 'netdisk',
})
