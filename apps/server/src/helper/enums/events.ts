export enum EventsEnum {
  /** 通用执行更新触发的事件 */
  UPDATE_SYSTEM_MSG = 'update.system.msg',
  /** 更新完成触发的事件 */
  UPDATE_SYSTEM_COMPLETED = 'update.system.completed',
  /** 执行部分更新Web命令完成 操作触发的事件 */
  UPDATE_WEB_MSG = 'update.web.msg',
  /** 执行部分更新Admin命令完成 操作触发的事件 */
  UPDATE_ADMIN_MSG = 'update.admin.msg',
  /** 执行部分更新Serve命令完成 操作触发的事件 */
  UPDATE_SERVE_MSG = 'update.serve.msg',
}
