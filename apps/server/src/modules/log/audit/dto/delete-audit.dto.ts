import { IsArray, IsNumber } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteAuditLogsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ default: [], description: '删除审计记录id列表' })
  ids: number[]
}
