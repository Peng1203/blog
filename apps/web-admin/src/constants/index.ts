/** 文章相关静态数据 */
export const ARTICLE = {
  // 文章类型筛选数据
  typeOptions: [
    { label: '全部', value: 0 },
    { label: '原创', value: 1 },
    { label: '转载', value: 2 },
    { label: '翻译', value: 3 },
  ],
  radioTypeOptions: [
    { label: '原创', value: 1 },
    { label: '转载', value: 2 },
    { label: '翻译', value: 3 },
  ],

  // 文章状态筛选数据
  statusOptions: [
    { label: '全部', value: 0 },
    { label: '已发布', value: 1 },
    { label: '私密', value: 2 },
    { label: '草稿箱', value: 3 },
    { label: '已删除', value: 4 },
    { label: '待审核', value: 5 },
    { label: '已拒绝', value: 6 },
  ],
  radioStatusOptions: [
    { label: '公开', value: 1 },
    { label: '私密', value: 2 },
    { label: '草稿箱', value: 3 },
  ],
}

export const MB = 1024 * 1024

export enum BroadcastChannelEnum {
  /** 资源列表通信信道 */
  RESOURCE_CHANNEL = 'resourceChannel',
}

export enum CodeEnum {
  /**
   * 获取成功
   */
  GET_SUCCESS = 20000,
  /**
   * 创建成功
   */
  POST_SUCCESS = 20100,
  /**
   * 更新成功
   */
  UPDATE_SUCCESS = 20001,
  /**
   * 删除成功
   */
  DELETE_SUCCESS = 20000,
  /**
   * 局部更新成功
   */
  PATCH_SUCCESS = 20000,
}
