import { Plugin } from 'vite'

export default function scriptSetupNamePlugin(): Plugin {
  return {
    name: 'vite-plugin-script-setup-name',

    transform(code: string, id: string) {
      // 只处理 .vue 文件
      if (!id.endsWith('.vue')) {
        return null
      }

      // 正则匹配 script setup 标签，并提取 name 属性
      const scriptSetupRegex = /<script\s+setup\s+[^>]*name=["']([^"']+)["'][^>]*lang=["']ts["'][^>]*>/
      const match = code.match(scriptSetupRegex)

      if (match) {
        const componentName = match[1]

        // 将解析出来的 name 注入到默认导出的组件中
        const nameInjection = `\n<script lang="ts">
export default {
  name: '${componentName}'
}
</script>`

        // 返回修改后的代码
        return code.replace(match[0], match[0] + nameInjection)
      }

      return code
    },
  }
}
