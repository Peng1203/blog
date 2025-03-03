import { EChartsOption } from 'echarts'

export interface ChartAttribute {
  /** 图表options 配置 */
  options: EChartsOption
  /** 宽度 */
  width?: string
  /** 高度 */
  height?: string
  /** 图表加载 */
  loading?: boolean
}
