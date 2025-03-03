import { ApiProperty } from '@nestjs/swagger'

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '请选择文件',
  })
  file: any
}
