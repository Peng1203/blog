import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

export function copyToClipboard(trigger: Element, text: string): void {
  const clipboard: any = new Clipboard(trigger, {
    text: () => text,
  })

  clipboard.on('success', () => {
    ElMessage.success('复制成功!')
    clipboard.destroy()
  })

  clipboard.on('error', () => {
    ElMessage.error('复制失败!')
    clipboard.destroy()
  })

  // clipboard.onClick(null)
}
