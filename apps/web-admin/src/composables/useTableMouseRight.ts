import { ref } from 'vue'
import { Column } from 'element-plus'

export const userTableRightMenu = <T>() => {
  const rightMenuInfo = ref({
    visible: false, //默认隐藏自己自定义的菜单列表
    left: 0,
    top: 0,
    row: ref<T>(), //el-table当前列表的信息
  })
  //右键菜单的方法
  const handleMouseRightRowClick = (row: T, column: Column, event: PointerEvent) => {
    event.preventDefault() //阻止鼠标右键默认行为
    rightMenuInfo.value.row = row
    rightMenuInfo.value.left = event.clientX
    rightMenuInfo.value.top = event.pageY
    rightMenuInfo.value.visible = true
  }

  return {
    rightMenuInfo,
    handleMouseRightRowClick,
  }
}
