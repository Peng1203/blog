import { watch, isRef } from 'vue'

/**
 * 编辑时 编辑表单赋值
 */
export function useFormWatcher(propGetter, target, customHandler?) {
  watch(
    propGetter,
    val => {
      if (!val) return
      // 如果目标是 ref，则使用 .value 访问；否则直接使用 target
      const form = isRef(target) ? target.value : target

      for (const key in form) {
        if (val[key] !== undefined) {
          form[key] = val[key]
        }
      }

      // 自定义处理逻辑
      if (customHandler) customHandler(val)
    },
    { deep: true }
  )
}
