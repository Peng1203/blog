<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <div class="mb15 flex-sb-c">
        <div>
          <UserSelect
            v-model="userId"
            :otherOptions="[{ label: '未知', value: -1 }]"
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

        <template #createTimeSlot="{ row, prop }">
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
import { useAuditApi, useCommonApi } from '@/api'
import { getFromNow } from '@/utils/date'
import DatePicker from '@/components/Date'
import { AuditLogData, AuditLogListData } from './types'
import { resourceMethodOptions } from '@/views/auth/authPermission'
import UserSelect from '@/views/user/user/components/UserSelect.vue'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { useTableState } from '@/hooks'
import { CodeEnum } from '@/constants'

const { getAuditLogs, deleteById, deletes } = useAuditApi()
const { getIPInfo } = useCommonApi()

const {
  tableState, //
  setData,
  setTotal,
  setColumns,
  startLoading,
  stopLoading,
  getCommonParams,
} = useTableState<AuditLogData>()
const timeVal = ref<string[]>([])
const userId = ref<number>(0)
tableState.pageSize = 30

setColumns([
  // {
  //   label: 'ID',
  //   prop: 'id',
  //   minWidth: 100,
  // },
  {
    label: '请求资源',
    prop: 'router',
    minWidth: 130,
    // fixed: 'left',
    tooltip: true,
  },
  {
    label: '请求方式',
    prop: 'method',
    minWidth: 100,
    // fixed: 'left',
    slotName: 'methodSlot',
  },
  // {
  //   label: '操作状态',
  //   prop: 'operationStatus',
  //   minWidth: 100,
  //   slotName: 'operStatusSlot',
  // },
  {
    label: '状态码',
    prop: 'statusCode',
    minWidth: 100,
  },
  {
    label: '响应耗时 (ms)',
    prop: 'responseTime',
    minWidth: 120,
  },
  {
    label: '请求查询参数',
    prop: 'requestQueryParams',
    minWidth: 120,
    tooltip: true,
  },
  {
    label: '请求主体参数',
    prop: 'requestBodyParams',
    minWidth: 120,
    tooltip: true,
  },
  {
    label: '错误消息',
    prop: 'errMessage',
    width: 130,
    tooltip: true,
  },
  {
    label: '描述',
    prop: 'description',
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
  // {
  //   label: '用户ID',
  //   prop: 'userId',
  //   minWidth: 100,
  // },
  {
    label: '用户',
    prop: 'userName',
    minWidth: 80,
    // fixed: 'right',
  },
  {
    label: '请求于',
    prop: 'createTime',
    minWidth: 100,
    slotName: 'createTimeSlot',
    // fixed: 'right',
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
    const { data: res } = await getAuditLogs<AuditLogListData>(params)
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

const tableRowStatus = ({ row }: { row: AuditLogData }) => {
  return row.operationStatus ? 'success-row' : 'fail-row'
}

const handleDelete = async (row: AuditLogData, type: 1 | 2) => {
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
  const parseResult = await parseIP(row.ip)
  row.ipInfo = parseResult.region
}

const parseIP = async (ip: string) => {
  try {
    const { data: res } = await getIPInfo(ip)
    const { code, data, success } = res
    if (code !== CodeEnum.GET_SUCCESS || !success) return
    return data
  } catch (e) {
    console.log('e', e)
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
