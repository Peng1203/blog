import { ApiProperty } from '@nestjs/swagger'

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '图片资源',
  })
  file: any
}
