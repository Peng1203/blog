import type { App } from 'vue'
import { authDirective } from '@/directive/authDirective'
import { wavesDirective, dragDirective, oneClickCopy, setXScrollWheel } from '@/directive/customDirective'
import { slideIn } from './animationDirective'

/**
 * 导出指令方法：v-xxx
 * @methods authDirective 用户权限指令，用法：v-auth
 * @methods wavesDirective 按钮波浪指令，用法：v-waves
 * @methods dragDirective 自定义拖动指令，用法：v-drag
 */
export function directive(app: App) {
  // 用户权限指令
  authDirective(app)
  // 按钮波浪指令
  wavesDirective(app)
  // 自定义拖动指令
  dragDirective(app)
  // 一键复制指令
  oneClickCopy(app)
  // 列表滚动过渡
  slideIn(app)
  // 滚轮控制横向滚动
  setXScrollWheel(app)
}
