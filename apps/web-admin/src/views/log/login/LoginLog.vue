<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <div class="mb15 flex-sb-c">
        <div>
          <!-- bindValue="name" -->
          <UserSelect
            v-model="userId"
            @change="getDataList"
          />

          <PengButton
            ml10
            size="default"
            type="danger"
            :disabled="!!!tableState.selectVal.length"
            @click="handleDelete({} as any, 2)"
          >
            <el-icon>
              <Delete />
            </el-icon>
            删 除
          </PengButton>
        </div>

        <DatePicker
          :type="2"
          v-model="timeVal"
          @change="getDataList"
        />
      </div>
      <PengTable
        selection
        filterColumn
        isFilterShowColumn
        :operationColumnWidth="120"
        :stripe="false"
        :data="tableState.data"
        :get-data="getDataList"
        :total="tableState.total"
        :columns="tableState.columns"
        v-model:page="tableState.page"
        v-model:pageSize="tableState.pageSize"
        v-model:loading="tableState.loading"
        :row-class-name="tableRowStatus"
        :operationColumnBtns="['delete']"
        @deleteBtn="row => handleDelete(row, 1)"
        @selectionChange="(val: any) => tableState.selectVal = val.map((item: any)=> item.id)"
      >
        <!-- 请求方式 -->
        <template #methodSlot="{ row, prop }">
          <el-tag
            w60
            style="border: none"
            effect="dark"
            :color="handleMethodTagColor(row[prop])"
          >
            {{ handleMethodTagText(row[prop]) }}
          </el-tag>
        </template>

        <template #operStatusSlot="{ row, prop }">
          <el-tag
            effect="dark"
            type="success"
            v-if="row[prop]"
          >
            {{ `成 功` }}
          </el-tag>

          <el-tag
            effect="dark"
            type="danger"
            v-else
          >
            {{ `失 败` }}
          </el-tag>
        </template>

        <template #loginTimeSlot="{ row, prop }">
          <el-tooltip
            effect="dark"
            placement="top-start"
            :content="row[prop]"
          >
            {{ getFromNow(row[prop]) }}
          </el-tooltip>
        </template>

        <template #operationEndSlot="{ row }">
          <!-- {{ row }} -->
          <el-popover
            placement="top-start"
            title="IP 信息"
            width="auto"
            trigger="hover"
            :content="row.ipInfo || '暂无IP信息'"
          >
            <template #reference>
              <PengButton
                circle
                title="解析IP"
                size="small"
                type="info"
                @click="handleParseIpInfo(row)"
              >
                <el-icon class="iconfont icon-weixiefenxi-keyiIPshijian" />
              </PengButton>
            </template>
          </el-popover>
        </template>
      </PengTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLoginAuditApi, useCommonApi } from '@/api'
import { getFromNow } from '@/utils/date'
import DatePicker from '@/components/Date'
import { LoginAuditLogData, LoginAuditLogListData } from './types'
import { resourceMethodOptions } from '@/views/auth/authPermission'
import UserSelect from '@/views/user/user/components/UserSelect.vue'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { useTableState } from '@/hooks'
import { CodeEnum } from '@/constants'

const { getLoginAuditLogs, deleteById, deletes } = useLoginAuditApi()
const { getIPInfo } = useCommonApi()

const {
  tableState, //
  setData,
  setTotal,
  setColumns,
  startLoading,
  stopLoading,
  getCommonParams,
} = useTableState<LoginAuditLogData>()
const timeVal = ref<string[]>([])
const userId = ref<number>(0)
tableState.pageSize = 30

setColumns([
  {
    label: '用户名',
    prop: 'userName',
    minWidth: 130,
    tooltip: true,
  },
  {
    label: '设备',
    prop: 'device',
    minWidth: 100,
  },
  {
    label: '状态码',
    prop: 'loginStatus',
    minWidth: 100,
    formatter: (row: any) => {
      if (row.loginStatus === 1) return '成功'
      return row.loginStatus
    },
  },
  {
    label: '失败原因',
    prop: 'failureReason',
    minWidth: 150,
  },
  {
    label: '登录时长',
    prop: 'loginDuration',
    minWidth: 120,
  },
  {
    label: '登录地点',
    prop: 'location',
    minWidth: 120,
    tooltip: true,
  },
  {
    label: '登录方式',
    prop: 'loginMethod',
    minWidth: 120,
    tooltip: true,
  },
  {
    label: '浏览器',
    prop: 'browser',
    width: 130,
    tooltip: true,
  },
  {
    label: '操作系统',
    prop: 'os',
    width: 130,
    tooltip: true,
  },

  {
    label: '用户代理',
    prop: 'userAgent',
    minWidth: 100,
    tooltip: true,
  },
  {
    label: 'IP',
    prop: 'ip',
    minWidth: 130,
  },
  {
    label: '用户ID',
    prop: 'userId',
    minWidth: 100,
  },
  {
    label: '登录时间',
    prop: 'loginTime',
    minWidth: 100,
    slotName: 'loginTimeSlot',
  },
])

const getDataList = async () => {
  try {
    startLoading()
    const [startTime, endTime] = timeVal.value
    const params = {
      startTime,
      endTime,
      userId: userId.value,
      ...getCommonParams(),
    }
    const { data: res } = await getLoginAuditLogs<LoginAuditLogListData>(params)
    const { code, data, success } = res
    if (code !== CodeEnum.GET_SUCCESS || !success) return
    setData(data.list)
    setTotal(data.total)
  } catch (e) {
    console.log('e', e)
  } finally {
    stopLoading()
  }
}

const handleMethodTagColor = (value: any) => {
  return resourceMethodOptions.find(item => item.value === value)!.color
}

const handleMethodTagText = (value: any) => {
  return resourceMethodOptions.find(item => item.value === value)!.label
}

const tableRowStatus = ({ row }: { row: LoginAuditLogData }) => {
  return row.loginStatus === 1 ? 'success-row' : 'fail-row'
}

const handleDelete = async (row: LoginAuditLogData, type: 1 | 2) => {
  const delRes = type === 1 ? await deleteAudit(row.id) : await batchDelete()
  if (!delRes) return
  getDataList()
}

const deleteAudit = async (id: number) => {
  try {
    const { data: res } = await deleteById(id)
    const { code, message, data, success } = res

    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    useNotificationMsg(message, data)
    return true
  } catch (e) {
    console.log('e', e)
    return false
  }
}

const batchDelete = async () => {
  try {
    const { data: res } = await deletes(tableState.selectVal)
    const { code, message, data, success } = res
    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    useNotificationMsg(message, data)
    return true
  } catch (e) {
    console.log('e', e)
    return false
  }
}

const handleParseIpInfo = async row => {
  if (row.ipInfo) return
  const parseResult = await getIPParseInfo(row.ip)
  row.ipInfo = parseResult.region
}

const getIPParseInfo = async (ip: string) => {
  try {
    const { data: res } = await getIPInfo(ip)
    const { code, data, success } = res
    if (code !== CodeEnum.GET_SUCCESS || !success) return
    return data
  } catch (e) {
    console.log('e', e)
    return { region: '' }
  }
}

onMounted(() => {
  getDataList()
})
</script>
<style scoped lang="scss">
.iconfont {
  margin-right: 0 !important;
}
</style>
