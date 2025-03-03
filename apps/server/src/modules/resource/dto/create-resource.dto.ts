import { IsNumberString, IsString } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateResourceDto {}

export class CreateFileDirDto {
  @IsString()
  @ApiProperty({ description: '目录名称由文件 hash + 用户id 组成' })
  uploadId: string
}

export class UploadChunkDto {
  @IsNumberString()
  @ApiProperty({ description: '第几片切片数' })
  index: number

  @IsNumberString()
  @ApiProperty({ description: '分片开始字节' })
  start: number

  @IsNumberString()
  @ApiProperty({ description: '分片结束字节' })
  end: number

  @IsNumberString()
  @ApiProperty({ description: '文件的总大小' })
  size: number

  @IsString()
  @ApiProperty({ description: '上传目录' })
  uploadId: string
}

export class MergeFileChunksDto {
  @IsString()
  @ApiProperty({ description: '合成目录' })
  uploadId: string

  @IsString()
  @ApiProperty({ description: '文件名' })
  fileName: string

  @IsString()
  @ApiProperty({ description: '文件扩展名' })
  extName: string
}
