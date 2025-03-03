type preThemes = 'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis' | 'arknights'
type codeTheme = 'atom' | 'a11y' | 'github' | 'gradient' | 'kimbie' | 'paraiso' | 'qtcreator' | 'stackoverflow'

export interface MarkdownEditorAttibute {
  // toolbar配置
  toolbarModel?: 'all' | 'common'
  // 预览主题
  preTheme?: preThemes
  // 语言
  lang?: string
  // 代码块主题
  codeTheme?: codeTheme
  // 代码块是否显示行数
  showCodeRowNumber?: boolean
  // 不展示的工具栏
  toolbarsExclude?: string[]
  height?: string
}

export interface PreviewAttibute {
  height?: string
  catalogVisible?: boolean
}
